import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ESTILOS, obtenerInstrucciones } from "./logica/instrucciones.js";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
export const MODELO_PREDETERMINADO = "gemini-3.8-flash";
const LIMITE_CUERPO = 1024 * 1024;
const PUBLICOS = new Set([
  "index.html", "estilos.css", "app.js", "logo.png", "logo.webp", "icono.ico", "icono-app.ico",
  "icono.svg", "icono-192.png", "icono-512.png", "manifest.webmanifest", "service-worker.js",
  "favicon-16-v4.png", "favicon-32-v4.png", "icono-ventana-v4.ico",
  "logica/gemini.js", "logica/mejorador.js", "logica/historial.js", "logica/vista.js", "logica/solicitud.js"
]);
const TIPOS = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml" };
const CABECERAS = {
  "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
};

function fallo(estado, codigo, mensaje) { return Object.assign(new Error(mensaje), { estado, codigo }); }

function responderJson(respuesta, estado, datos) {
  if (respuesta.destroyed || respuesta.writableEnded) return;
  respuesta.writeHead(estado, { ...CABECERAS, "Content-Type": "application/json; charset=utf-8" });
  respuesta.end(JSON.stringify(datos));
}

// Se consulta en cada petición; nunca se devuelve ni se imprime su contenido.
function leerEntorno() {
  const valores = Object.create(null);
  let contenido;
  try { contenido = fs.readFileSync(path.join(RAIZ, ".env"), "utf8"); } catch { return valores; }
  for (const linea of contenido.split(/\r?\n/)) {
    const coincidencia = linea.trim().match(/^(GEMINI_API_KEY|GEMINI_MODELO)\s*=\s*(.*)$/);
    if (coincidencia) valores[coincidencia[1]] = coincidencia[2].replace(/^(["'])(.*)\1$/, "$2").trim();
  }
  return valores;
}

async function leerCuerpo(peticion) {
  const trozos = [];
  let longitud = 0;
  // No se destruye el socket al superar el límite: aún debemos entregar el 413.
  let demasiadoLargo = false;
  for await (const trozo of peticion) {
    longitud += trozo.length;
    if (longitud > LIMITE_CUERPO) { demasiadoLargo = true; trozos.length = 0; }
    if (!demasiadoLargo) trozos.push(trozo);
  }
  if (demasiadoLargo) throw fallo(413, "texto_largo", "El texto supera 1 MiB. Divide la petición en partes más pequeñas.");
  try { return JSON.parse(Buffer.concat(trozos).toString("utf8")); }
  catch { throw fallo(400, "peticion_invalida", "La petición no se pudo leer. Envía un objeto JSON."); }
}

export function extraerPrompt(contenido) {
  const candidato = contenido?.candidates?.[0];
  if (candidato?.finishReason === "MAX_TOKENS") throw fallo(502, "respuesta_truncada", "La respuesta quedó incompleta. Divide el texto y vuelve a intentarlo.");
  if (contenido?.promptFeedback?.blockReason || (candidato?.finishReason && candidato.finishReason !== "STOP")) {
    throw fallo(502, "respuesta_bloqueada", "La IA no pudo completar esta petición. Revisa el texto e inténtalo de nuevo.");
  }
  const prompt = candidato?.content?.parts?.filter(parte => !parte.thought && typeof parte.text === "string").map(parte => parte.text).join("").trim();
  if (!prompt) throw fallo(502, "respuesta_vacia", "La IA no devolvió un prompt. Inténtalo de nuevo.");
  return prompt;
}

export async function llamarGemini(clave, modelo, texto, estilo, signal, instrucciones = obtenerInstrucciones(estilo)) {
  const respuesta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`, {
    method: "POST", signal,
    headers: { "Content-Type": "application/json", "x-goog-api-key": clave },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: instrucciones }] },
      contents: [{ role: "user", parts: [{ text: texto }] }],
      generationConfig: { maxOutputTokens: 16384 }
    })
  });
  if (!respuesta.ok) {
    const mensajes = {
      400: "La petición o la clave no son válidas. Revisa la configuración en .env.",
      403: "La clave no tiene acceso al modelo. Revisa la clave y el modelo en .env.",
      404: "El modelo no está disponible. Revisa GEMINI_MODELO en .env.",
      429: "Has llegado al límite del servicio de IA. Espera un momento y vuelve a intentarlo."
    };
    await respuesta.body?.cancel();
    throw fallo(502, "api", mensajes[respuesta.status] || "El servicio de IA está teniendo problemas. Inténtalo de nuevo más tarde.");
  }
  let contenido;
  try { contenido = await respuesta.json(); }
  catch { throw fallo(502, "respuesta_invalida", "La respuesta de la IA no se pudo leer. Inténtalo de nuevo."); }
  return extraerPrompt(contenido);
}

// Las dependencias inyectables permiten probar sin claves ni llamadas reales.
export function crearServidor({ raiz = RAIZ, obtenerEntorno = leerEntorno, generar = llamarGemini, tiempoEspera = 60000 } = {}) {
  return http.createServer(async (peticion, respuesta) => {
    try {
      const puerto = respuesta.socket.localPort;
      const destinos = [`localhost:${puerto}`, `127.0.0.1:${puerto}`];
      if (!destinos.includes(peticion.headers.host)) throw fallo(403, "origen", "Destino no permitido.");
      const url = new URL(peticion.url, `http://${peticion.headers.host}`);
      const ruta = decodeURIComponent(url.pathname);
      if (ruta === "/api/mejorar") {
        if (peticion.method !== "POST") throw fallo(405, "metodo", "Método no permitido.");
        if (peticion.headers.origin && !destinos.some(destino => peticion.headers.origin === `http://${destino}`)) throw fallo(403, "origen", "La petición debe proceder de Sin Rodeos.");
        if (!/^application\/json(?:;|$)/i.test(peticion.headers["content-type"] || "")) throw fallo(415, "formato", "Envía el texto como JSON.");
        const datos = await leerCuerpo(peticion);
        const texto = typeof datos?.texto === "string" ? datos.texto.trim() : "";
        if (!texto) throw fallo(400, "texto_vacio", "Escribe primero lo que quieres pedir.");
        const entorno = obtenerEntorno();
        const clave = (entorno.GEMINI_API_KEY || "").trim();
        if (!clave || clave === "TU_CLAVE_AQUI") throw fallo(503, "sin_clave", "Falta la clave de IA. Copia .env.example como .env y configura GEMINI_API_KEY.");
        const controlador = new AbortController();
        const cancelar = () => { if (!respuesta.writableEnded) controlador.abort(); };
        respuesta.on("close", cancelar);
        const temporizador = setTimeout(() => controlador.abort(fallo(504, "tiempo_agotado", "La IA tardó demasiado. Inténtalo de nuevo.")), tiempoEspera);
        let alAbortar;
        try {
          const cancelacion = new Promise((_, rechazar) => {
            alAbortar = () => rechazar(controlador.signal.reason);
            controlador.signal.addEventListener("abort", alAbortar, { once: true });
          });
          const prompt = await Promise.race([
            generar(clave, entorno.GEMINI_MODELO?.trim() || MODELO_PREDETERMINADO, texto, Object.hasOwn(ESTILOS, datos.estilo) ? datos.estilo : "preciso", controlador.signal), cancelacion
          ]);
          responderJson(respuesta, 200, { prompt });
        } finally {
          clearTimeout(temporizador);
          controlador.signal.removeEventListener("abort", alAbortar);
          respuesta.off("close", cancelar);
        }
        return;
      }
      if (!["GET", "HEAD"].includes(peticion.method)) throw fallo(405, "metodo", "Método no permitido.");
      const nombre = ruta === "/" ? "index.html" : ruta === "/favicon.ico" ? "icono-ventana-v4.ico" : ruta.slice(1);
      if (!PUBLICOS.has(nombre)) throw fallo(404, "no_encontrado", "No se encontró el archivo solicitado.");
      const contenido = await fs.promises.readFile(path.join(raiz, nombre));
      respuesta.writeHead(200, { ...CABECERAS, "Content-Type": `${TIPOS[path.extname(nombre)]}; charset=utf-8` });
      respuesta.end(peticion.method === "HEAD" ? undefined : contenido);
    } catch (error) {
      const estado = error instanceof URIError || error.code === "ERR_INVALID_URL" ? 400 : error.estado || (error.code === "ENOENT" ? 404 : 502);
      responderJson(respuesta, estado, { codigo: error.codigo || "peticion_fallida", error: error.estado ? error.message : "No se pudo completar la petición. Revisa la conexión e inténtalo de nuevo." });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const puerto = Number(process.env.PUERTO || 8000);
  const servidor = crearServidor();
  servidor.on("error", () => { console.error("No se pudo abrir Sin Rodeos. Comprueba si ya está abierto o si el puerto está ocupado."); process.exitCode = 1; });
  servidor.listen(puerto, "127.0.0.1", () => console.log(`Sin Rodeos funcionando en http://127.0.0.1:${puerto}`));
}
