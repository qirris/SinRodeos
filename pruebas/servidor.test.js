import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { crearServidor, extraerPrompt, MODELO_PREDETERMINADO, llamarGemini } from "../servidor.js";

async function iniciar(t, opciones = {}) {
  const servidor = crearServidor(opciones);
  await new Promise(resolver => servidor.listen(0, "127.0.0.1", resolver));
  t.after(() => { servidor.closeAllConnections(); return new Promise(resolver => servidor.close(resolver)); });
  return `http://127.0.0.1:${servidor.address().port}`;
}
const envio = datos => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) });

test("solo sirve recursos públicos, nunca archivos internos ni fuentes del servidor", async t => {
  const url = await iniciar(t);
  for (const ruta of ["/.env", "/.git/config", "/README.md", "/servidor.js", "/memoria.md", "/.env.example", "/logica/instrucciones.js", "/%2eenv", "/logica%5c..%5c.env"]) {
    assert.equal((await fetch(url + ruta)).status, 404, ruta);
  }
  for (const ruta of ["/", "/app.js", "/estilos.css", "/logica/vista.js", "/logo.webp", "/manifest.webmanifest"]) {
    const respuesta = await fetch(url + ruta);
    assert.equal(respuesta.status, 200, ruta);
    assert.ok(respuesta.headers.get("content-security-policy"));
  }
  assert.equal(await (await fetch(url, { method: "HEAD" })).text(), "");
});

test("una URL malformada no cierra el servidor", async t => {
  const url = await iniciar(t);
  assert.equal((await fetch(url + "/%ZZ")).status, 400);
  assert.equal((await fetch(url)).status, 200);
});

test("valida método, origen, JSON, texto y presencia de clave", async t => {
  const url = await iniciar(t, { obtenerEntorno: () => ({}) });
  assert.equal((await fetch(url + "/api/mejorar")).status, 405);
  assert.equal((await fetch(url + "/api/mejorar", { ...envio({ texto: "hola" }), headers: { "Content-Type": "application/json", Origin: "https://externo.example" } })).status, 403);
  assert.equal((await fetch(url + "/api/mejorar", { method: "POST", body: "texto=hola" })).status, 415);
  assert.equal((await fetch(url + "/api/mejorar", { ...envio({}), body: "{" })).status, 400);
  assert.equal((await fetch(url + "/api/mejorar", envio({ texto: " " }))).status, 400);
  const respuesta = await fetch(url + "/api/mejorar", envio({ texto: "hola" }));
  assert.equal(respuesta.status, 503);
  assert.equal((await respuesta.json()).codigo, "sin_clave");
});

test("rechaza Host ajeno al equipo local", async t => {
  const url = await iniciar(t);
  const estado = await new Promise((resolver, rechazar) => {
    http.get(url, { headers: { Host: "externo.example" } }, respuesta => { respuesta.resume(); resolver(respuesta.statusCode); }).on("error", rechazar);
  });
  assert.equal(estado, 403);
});

test("limita el cuerpo en bytes y devuelve un 413 legible", async t => {
  const url = await iniciar(t);
  const respuesta = await fetch(url + "/api/mejorar", envio({ texto: "á".repeat(600000) }));
  assert.equal(respuesta.status, 413);
  assert.equal((await respuesta.json()).codigo, "texto_largo");
});

test("preserva el contrato, estilo y modelo; vuelve a leer configuración en cada petición", async t => {
  const llamadas = [];
  let configurado = false;
  const url = await iniciar(t, {
    obtenerEntorno: () => ({ GEMINI_API_KEY: "clave-ficticia", ...(configurado ? { GEMINI_MODELO: "modelo-elegido" } : {}) }),
    generar: async (...argumentos) => { llamadas.push(argumentos.slice(0, 4)); return "# Prompt de prueba"; }
  });
  const respuesta = await fetch(url + "/api/mejorar", envio({ texto: " tarea ", estilo: "directo" }));
  assert.deepEqual(await respuesta.json(), { prompt: "# Prompt de prueba" });
  assert.deepEqual(llamadas[0], ["clave-ficticia", MODELO_PREDETERMINADO, "tarea", "directo"]);
  configurado = true;
  await fetch(url + "/api/mejorar", envio({ texto: "tarea", estilo: "inventado" }));
  assert.equal(llamadas[1][1], "modelo-elegido");
  assert.equal(llamadas[1][3], "preciso");
});

test("agota el tiempo, aborta la generación y admite otra petición", async t => {
  let señal;
  const url = await iniciar(t, { obtenerEntorno: () => ({ GEMINI_API_KEY: "ficticia" }), tiempoEspera: 20, generar: async (...argumentos) => { señal = argumentos[4]; return new Promise(() => {}); } });
  const respuesta = await fetch(url + "/api/mejorar", envio({ texto: "tarea" }));
  assert.equal(respuesta.status, 504);
  assert.equal(señal.aborted, true);
  assert.equal((await fetch(url)).status, 200);
});

test("rechaza respuestas parciales, bloqueadas y vacías; omite pensamientos", () => {
  for (const motivo of ["MAX_TOKENS", "SAFETY", "RECITATION"]) assert.throws(() => extraerPrompt({ candidates: [{ finishReason: motivo, content: { parts: [{ text: "parcial" }] } }] }));
  assert.throws(() => extraerPrompt({ promptFeedback: { blockReason: "SAFETY" } }));
  assert.throws(() => extraerPrompt({ candidates: [] }));
  assert.equal(extraerPrompt({ candidates: [{ finishReason: "STOP", content: { parts: [{ thought: true, text: "interno" }, { text: "Prompt" }] } }] }), "Prompt");
});

test("envía la clave por cabecera y no muestra errores internos de Gemini", async t => {
  const anterior = globalThis.fetch;
  t.after(() => { globalThis.fetch = anterior; });
  globalThis.fetch = async (url, opciones) => {
    assert.ok(!url.includes("secreto-ficticio"));
    assert.equal(opciones.headers["x-goog-api-key"], "secreto-ficticio");
    assert.equal(JSON.parse(opciones.body).generationConfig.maxOutputTokens, 16384);
    return new Response("detalle interno ficticio", { status: 429 });
  };
  await assert.rejects(llamarGemini("secreto-ficticio", MODELO_PREDETERMINADO, "tarea", "preciso"), error => error.codigo === "api" && !error.message.includes("interno"));
});
