// Servidor local: sirve la aplicación y llama a Gemini desde aquí para que la clave
// nunca llegue al navegador. Solo usa módulos nativos de Node: cero dependencias.

import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INSTRUCCIONES_SISTEMA } from "./logica/instrucciones.js";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVO_ENTORNO = path.join(RAIZ, ".env");
const PUERTO = Number(process.env.PUERTO || 8000);
const MODELO_PREDETERMINADO = "gemini-3.5-flash-lite";
const LIMITE_CUERPO = 1024 * 1024;

const TIPOS_MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

function responderJson(respuesta, estado, datos) {
  respuesta.writeHead(estado, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  respuesta.end(JSON.stringify(datos));
}

// Se lee en cada petición para que pegar la clave en .env no exija reiniciar.
function leerEntorno() {
  const valores = {};
  let contenido;

  try {
    contenido = fs.readFileSync(ARCHIVO_ENTORNO, "utf8");
  } catch {
    return valores;
  }

  for (const linea of contenido.split(/\r?\n/)) {
    const recortada = linea.trim();
    if (!recortada || recortada.startsWith("#")) continue;

    const separador = recortada.indexOf("=");
    if (separador < 0) continue;

    const clave = recortada.slice(0, separador).trim();
    let valor = recortada.slice(separador + 1).trim();

    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }

    valores[clave] = valor;
  }

  return valores;
}

function servirArchivo(rutaSolicitada, respuesta) {
  let nombre = decodeURIComponent(rutaSolicitada.split("?")[0]);
  if (nombre === "/") nombre = "/index.html";

  const rutaCompleta = path.resolve(RAIZ, "." + nombre);
  const dentroDeRAIZ = rutaCompleta === RAIZ || rutaCompleta.startsWith(RAIZ + path.sep);

  if (!dentroDeRAIZ) {
    responderJson(respuesta, 403, { error: "Ruta no permitida." });
    return;
  }

  fs.readFile(rutaCompleta, (error, contenido) => {
    if (error) {
      responderJson(respuesta, 404, { error: "No se encontró el archivo solicitado." });
      return;
    }

    respuesta.writeHead(200, {
      "Content-Type": TIPOS_MIME[path.extname(rutaCompleta).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    respuesta.end(contenido);
  });
}

function leerCuerpo(peticion) {
  return new Promise((resolver, rechazar) => {
    let datos = "";

    peticion.on("data", trozo => {
      datos += trozo;
      if (datos.length > LIMITE_CUERPO) {
        rechazar(new Error("El texto es demasiado largo."));
        peticion.destroy();
      }
    });
    peticion.on("end", () => resolver(datos));
    peticion.on("error", rechazar);
  });
}

function traducirError(estado) {
  if (estado === 400) {
    return "La clave no es válida o la petición no se pudo enviar. Revisa GEMINI_API_KEY en el archivo .env.";
  }
  if (estado === 403) {
    return "Esa clave no tiene acceso al modelo gratuito. Comprueba que la copiaste completa.";
  }
  if (estado === 404) {
    return "El modelo configurado no está disponible. Cambia el modelo en .env.";
  }
  if (estado === 429) {
    return "Has llegado al límite gratuito. Espera un momento y vuelve a intentarlo.";
  }
  if (estado >= 500) {
    return "El servicio de IA está teniendo problemas ahora mismo. Prueba de nuevo en unos segundos.";
  }
  return "La IA respondió con un error inesperado. Prueba de nuevo.";
}

function llamarGemini(clave, modelo, texto) {
  const cuerpo = JSON.stringify({
    system_instruction: { parts: [{ text: INSTRUCCIONES_SISTEMA }] },
    contents: [{ role: "user", parts: [{ text: texto }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
  });

  const opciones = {
    hostname: "generativelanguage.googleapis.com",
    path: `/v1beta/models/${encodeURIComponent(modelo)}:generateContent?key=${encodeURIComponent(clave)}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(cuerpo)
    }
  };

  return new Promise((resolver, rechazar) => {
    const peticion = https.request(opciones, respuesta => {
      let datos = "";
      respuesta.setEncoding("utf8");
      respuesta.on("data", trozo => { datos += trozo; });

      respuesta.on("end", () => {
        let contenido;
        try {
          contenido = JSON.parse(datos);
        } catch {
          rechazar({
            estado: 502,
            codigo: "respuesta_invalida",
            error: "La IA devolvió una respuesta que no se pudo leer. Prueba de nuevo."
          });
          return;
        }

        if (respuesta.statusCode >= 200 && respuesta.statusCode < 300) {
          const partes = contenido?.candidates?.[0]?.content?.parts;
          const generado = Array.isArray(partes)
            ? partes.map(parte => parte.text || "").join("").trim()
            : "";

          if (!generado) {
            rechazar({
              estado: 502,
              codigo: "respuesta_vacia",
              error: "La IA devolvió una respuesta vacía. Prueba de nuevo."
            });
            return;
          }

          resolver(generado);
          return;
        }

        rechazar({
          estado: 502,
          codigo: "api",
          error: traducirError(respuesta.statusCode)
        });
      });
    });

    peticion.on("error", error => {
      rechazar({
        estado: 502,
        codigo: "red",
        error: `No se pudo conectar con la IA. Revisa tu conexión a internet. (${error.code || error.message})`
      });
    });

    peticion.write(cuerpo);
    peticion.end();
  });
}

async function atenderMejorar(peticion, respuesta) {
  try {
    const entorno = leerEntorno();
    const clave = (entorno.GEMINI_API_KEY || "").trim();

    if (!clave || clave === "TU_CLAVE_AQUI") {
      responderJson(respuesta, 500, {
        codigo: "sin_clave",
        error: "Falta la clave de la IA. Abre el archivo .env y pega tu clave en GEMINI_API_KEY."
      });
      return;
    }

    const cuerpo = await leerCuerpo(peticion);
    let datos;
    try {
      datos = JSON.parse(cuerpo);
    } catch {
      responderJson(respuesta, 400, { codigo: "peticion_invalida", error: "La petición no se pudo leer." });
      return;
    }

    const texto = typeof datos?.texto === "string" ? datos.texto.trim() : "";
    if (!texto) {
      responderJson(respuesta, 400, { codigo: "texto_vacio", error: "Escribe primero lo que quieres pedir." });
      return;
    }

    const modelo = (entorno.GEMINI_MODELO || MODELO_PREDETERMINADO).trim();
    const prompt = await llamarGemini(clave, modelo, texto);
    responderJson(respuesta, 200, { prompt });
  } catch (error) {
    responderJson(respuesta, Number(error?.estado) || 502, {
      codigo: error?.codigo || "desconocido",
      error: error?.error || "No se pudo generar el prompt. Prueba de nuevo."
    });
  }
}

const servidor = http.createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, `http://localhost:${PUERTO}`);

  if (url.pathname === "/api/mejorar") {
    if (peticion.method !== "POST") {
      responderJson(respuesta, 405, { error: "Método no permitido." });
      return;
    }
    atenderMejorar(peticion, respuesta);
    return;
  }

  if (peticion.method !== "GET" && peticion.method !== "HEAD") {
    responderJson(respuesta, 405, { error: "Método no permitido." });
    return;
  }

  servirArchivo(url.pathname, respuesta);
});

servidor.listen(PUERTO, () => {
  const tieneClave = Boolean((leerEntorno().GEMINI_API_KEY || "").trim());
  console.log(`Sin Rodeos funcionando en http://localhost:${PUERTO}`);
  console.log(
    tieneClave
      ? "Clave de la IA encontrada en .env."
      : "Falta la clave de la IA: pégala en el archivo .env (GEMINI_API_KEY)."
  );
});
