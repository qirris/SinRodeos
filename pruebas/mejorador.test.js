import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizarEspacios,
  dividirEnIdeas,
  clasificarIdea,
  construirPrompt,
  verificarConservacion,
  mejorarEstricto
} from "../logica/mejorador.js";

const EJEMPLO = `cuando estoy haciendo un proyecto con la ia no me hace caso
quiero que me pases el prompt ya puesto
sin cambiar nada de lo que pido
devuélvemelo en español`;

test("normalizarEspacios agrupa espacios y salto de línea", () => {
  assert.equal(normalizarEspacios("  hola   mundo  \n\n\n  adiós "), "hola mundo\n\nadiós");
});

test("dividirEnIdeas quita viñetas y separa frases", () => {
  const ideas = dividirEnIdeas("-primera idea.   segunda idea!\n• tercera idea");
  assert.deepEqual(ideas, ["primera idea.", "segunda idea!", "tercera idea"]);
});

test("clasificarIdea reconoce restricciones, entrega y contexto", () => {
  assert.equal(clasificarIdea("No cambies nada de lo que pido."), "restricciones");
  assert.equal(clasificarIdea("Devuélveme un README en español."), "entrega");
  assert.equal(clasificarIdea("Cuando trabajo con IA me ignora."), "contexto");
  assert.equal(clasificarIdea("Haz una aplicación para mi ordenador."), "objetivo");
  assert.equal(clasificarIdea("Cuando trabajo con la IA no me hace caso."), "contexto");
  assert.equal(clasificarIdea("Devuélvemelo en español."), "entrega");
});

test("mejorarEstricto conserva todas las ideas del usuario", () => {
  const resultado = mejorarEstricto(EJEMPLO);
  assert.equal(resultado.conservacion.total, 4);
  assert.equal(resultado.conservacion.conservadas, 4);
  assert.equal(resultado.conservacion.porcentaje, 100);
  assert.match(resultado.prompt, /^# Prompt mejorado/);
  assert.match(resultado.prompt, /## Restricciones/);
  assert.match(resultado.prompt, /## Entrega esperada/);
});

test("construirPrompt añade reglas solo cuando se piden", () => {
  const ideas = ["Haz una web."];
  assert.doesNotMatch(construirPrompt(ideas, { incluirReglas: false }), /Reglas de precisión/);
  assert.match(construirPrompt(ideas, { incluirReglas: true }), /## Reglas de precisión/);
});

test("verificarConservacion detecta contenido perdido", () => {
  const resultado = verificarConservacion(
    "Haz una web. No uses Java.",
    "## Objetivo\n- Haz una web."
  );
  assert.equal(resultado.total, 2);
  assert.equal(resultado.conservadas, 1);
  assert.deepEqual(resultado.faltantes, ["no uses java"]);
});

test("mejorarEstricto con texto vacío no inventa contenido", () => {
  const resultado = mejorarEstricto("   ");
  assert.equal(resultado.prompt, "# Prompt mejorado");
  assert.equal(resultado.conservacion.total, 0);
});
