// Servidor local: sirve la aplicación y reenvía las peticiones a Ollama.
// Solo usa módulos nativos de Node para no necesitar instalación.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const PUERTO = Number(process.env.PUERTO || 8000);
const HOST_OLLAMA = "127.0.0.1";
const PUERTO_OLLAMA = 11434;

const TIPOS_MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

function responderJson(respuesta, estado, datos) {
  respuesta.writeHead(estado, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  respuesta.end(JSON.stringify(datos));
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
      "Cache-Control": "no-cache"
    });
    respuesta.end(contenido);
  });
}

function proxyOllama(peticion, respuesta, subRuta) {
  const destino = new URL(`http://${HOST_OLLAMA}:${PUERTO_OLLAMA}${subRuta}`);
  const opciones = {
    hostname: destino.hostname,
    port: destino.port,
    path: destino.pathname + destino.search,
    method: peticion.method,
    headers: { ...peticion.headers, host: `${HOST_OLLAMA}:${PUERTO_OLLAMA}` }
  };

  const reenvio = http.request(opciones, respuestaOllama => {
    respuesta.writeHead(respuestaOllama.statusCode || 502, {
      "Content-Type": respuestaOllama.headers["content-type"] || "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    });
    respuestaOllama.pipe(respuesta);
  });

  reenvio.on("error", error => {
    responderJson(respuesta, 502, {
      error: "Ollama no responde. Inícialo con ollama serve o usa el modo estricto.",
      detalle: error.code || error.message
    });
  });

  peticion.pipe(reenvio);
}

const servidor = http.createServer((peticion, respuesta) => {
  const url = new URL(peticion.url, `http://localhost:${PUERTO}`);

  if (peticion.method === "OPTIONS") {
    respuesta.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    respuesta.end();
    return;
  }

  if (url.pathname.startsWith("/api/ollama/")) {
    if (peticion.method !== "GET" && peticion.method !== "POST") {
      responderJson(respuesta, 405, { error: "Método no permitido." });
      return;
    }
    proxyOllama(peticion, respuesta, url.pathname.slice("/api/ollama".length) + url.search);
    return;
  }

  if (peticion.method !== "GET" && peticion.method !== "HEAD") {
    responderJson(respuesta, 405, { error: "Método no permitido." });
    return;
  }

  servirArchivo(url.pathname, respuesta);
});

servidor.listen(PUERTO, () => {
  console.log(`Sin Rodeos funcionando en http://localhost:${PUERTO}`);
  console.log(`Ollama esperado en http://${HOST_OLLAMA}:${PUERTO_OLLAMA} (opcional)`);
});
