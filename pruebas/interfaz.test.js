import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderizarMarkdown } from "../logica/vista.js";

// DOM mínimo para probar eventos y nodos reales del módulo, sin instalar librerías.
function crearDocumento() {
  const documento = { eventos: {}, addEventListener(tipo, accion) { this.eventos[tipo] = accion; } };
  class Nodo {
    constructor(etiqueta) { this.tagName = etiqueta.toUpperCase(); this.ownerDocument = documento; this.children = []; this.atributos = {}; this.eventos = {}; this.value = ""; this.hidden = false; this.disabled = false; this._texto = ""; }
    append(...nodos) { for (const nodo of nodos) this.children.push(...(nodo.tagName === "FRAGMENT" ? nodo.children : [nodo])); }
    replaceChildren(...nodos) { this.children = []; this._texto = ""; this.append(...nodos); }
    set textContent(texto) { this._texto = texto; this.children = []; }
    get textContent() { return this._texto + this.children.map(nodo => nodo.textContent).join(""); }
    setAttribute(clave, valor) { this.atributos[clave] = valor; }
    addEventListener(tipo, accion) { this.eventos[tipo] = accion; }
    focus() { documento.activeElement = this; }
    select() { documento.seleccion = this.value; }
    remove() { documento.body.children = documento.body.children.filter(nodo => nodo !== this); }
  }
  documento.createElement = etiqueta => new Nodo(etiqueta);
  documento.createTextNode = texto => { const nodo = new Nodo("texto"); nodo.textContent = texto; return nodo; };
  documento.createDocumentFragment = () => new Nodo("fragment");
  documento.body = new Nodo("body");
  return documento;
}

test("la vista previa crea nodos de texto seguros y conserva el código", () => {
  const documento = crearDocumento();
  const contenedor = documento.createElement("div");
  renderizarMarkdown(contenedor, "# Objetivo\n**Importante** y `codigo`\n- <img src=x onerror=alert(1)>\n```js\nconst x = '<script>';\n```");
  assert.equal(contenedor.children[0].tagName, "H3");
  assert.ok(contenedor.textContent.includes("<img src=x onerror=alert(1)>"));
  assert.ok(contenedor.textContent.includes("const x = '<script>';"));
  const etiquetas = nodo => [nodo.tagName, ...nodo.children.flatMap(etiquetas)];
  assert.ok(!etiquetas(contenedor).includes("IMG"));
  assert.ok(!etiquetas(contenedor).includes("SCRIPT"));
  assert.ok(etiquetas(contenedor).includes("STRONG"));
});

test("la vista previa conserva el número de paso y sus restricciones anidadas", () => {
  const documento = crearDocumento();
  const contenedor = documento.createElement("div");
  renderizarMarkdown(contenedor, "3. Migra el esquema.\n   - No borres los datos.\n4. Reinicia el servidor.");
  assert.equal(contenedor.children.length, 1);
  const lista = contenedor.children[0];
  assert.equal(lista.start, 3);
  assert.equal(lista.children[0].value, 3);
  assert.equal(lista.children[1].value, 4);
  assert.equal(lista.children[0].children[1].tagName, "UL");
  assert.match(lista.children[0].textContent, /No borres los datos/);
});

test("flujo de interfaz: ejemplo, duplicados, limpiar, cancelar, copiar, historial y error", async t => {
  const nombres = ["document", "window", "navigator", "localStorage", "fetch"];
  const originales = Object.fromEntries(nombres.map(nombre => [nombre, Object.getOwnPropertyDescriptor(globalThis, nombre)]));
  t.after(() => { for (const nombre of nombres) { if (originales[nombre]) Object.defineProperty(globalThis, nombre, originales[nombre]); else delete globalThis[nombre]; } });
  const documento = crearDocumento();
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const elementos = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(([, id]) => [id, documento.createElement("div")]));
  documento.getElementById = id => elementos[id];
  elementos.selectorEstilo.value = "preciso";
  documento.execCommand = () => false;
  const almacen = new Map();
  let copiado = "";
  let llamadas = 0;
  let completar;
  for (const [nombre, valor] of Object.entries({
    document: documento,
    window: { addEventListener() {} },
    navigator: { clipboard: { writeText: async texto => { copiado = texto; } } },
    localStorage: { getItem: clave => almacen.get(clave) || null, setItem: (clave, valor) => almacen.set(clave, valor), removeItem: clave => almacen.delete(clave) },
    fetch: async () => { llamadas++; return new Promise(resolver => { completar = resolver; }); }
  })) Object.defineProperty(globalThis, nombre, { value: valor, writable: true, configurable: true });
  await import("../app.js");
  const pulsar = id => elementos[id].eventos.click();
  elementos.selectorEjemplo.value = "fallo";
  elementos.selectorEjemplo.eventos.change();
  assert.match(elementos.textoEntrada.value, /React/);
  assert.match(elementos.contadorEntrada.textContent, /caracteres/);
  const pendiente = pulsar("botonMejorar");
  assert.equal(elementos.botonMejorar.disabled, true);
  documento.eventos.keydown({ ctrlKey: true, key: "Enter", preventDefault() {} });
  assert.equal(llamadas, 1);
  pulsar("botonLimpiar");
  completar(new Response(JSON.stringify({ prompt: "respuesta antigua" })));
  await pendiente;
  assert.equal(elementos.textoSalida.value, "");
  assert.equal(elementos.textoEntrada.value, "");
  elementos.textoEntrada.value = "Una petición";
  const cancelada = pulsar("botonMejorar");
  pulsar("botonCancelar");
  completar(new Response(JSON.stringify({ prompt: "respuesta cancelada" })));
  await cancelada;
  assert.equal(elementos.textoSalida.value, "");
  const generada = pulsar("botonMejorar");
  const prompt = "## Objetivo\nUna petición **clara**.";
  completar(new Response(JSON.stringify({ prompt })));
  await generada;
  assert.equal(elementos.textoSalida.value, prompt);
  assert.equal(elementos.vistaPrevia.hidden, false);
  assert.equal(elementos.botonCopiar.disabled, false);
  assert.equal(elementos.contadorHistorial.textContent, "1");
  pulsar("botonVistaTexto");
  assert.equal(elementos.textoSalida.hidden, false);
  await pulsar("botonCopiar");
  assert.equal(copiado, prompt);
  navigator.clipboard.writeText = async () => { throw new Error("permiso"); };
  await pulsar("botonCopiar");
  assert.equal(documento.seleccion, prompt);
  assert.match(elementos.estado.textContent, /texto seleccionado/);
  pulsar("botonLimpiar");
  elementos.listaHistorial.children[0].children[0].eventos.click();
  assert.equal(elementos.textoSalida.value, prompt);
  pulsar("botonBorrarHistorial");
  assert.equal(elementos.contadorHistorial.textContent, "0");
  const fallida = pulsar("botonMejorar");
  completar(new Response(JSON.stringify({ codigo: "sin_clave", error: "Falta configurar la clave." }), { status: 503 }));
  await fallida;
  assert.equal(elementos.avisoConfiguracion.hidden, false);
  assert.match(elementos.estado.textContent, /clave/);
  assert.equal(elementos.botonMejorar.disabled, false);
});
