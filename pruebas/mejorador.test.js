import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizarEspacios,
  dividirEnIdeas,
  palabrasSignificativas,
  verificarConservacion
} from "../logica/mejorador.js";

const EJEMPLO = `cuando estoy haciendo un proyecto con la ia no me hace caso
quiero que me pases el prompt ya puesto
sin cambiar nada de lo que pido
devuélvemelo en español`;

test("normalizarEspacios agrupa espacios y saltos de línea", () => {
  assert.equal(normalizarEspacios("  hola   mundo  \n\n\n  adiós "), "hola mundo\n\nadiós");
});

test("dividirEnIdeas quita viñetas y separa frases", () => {
  const ideas = dividirEnIdeas("-primera idea.   segunda idea!\n• tercera idea");
  assert.deepEqual(ideas, ["primera idea.", "segunda idea!", "tercera idea"]);
});

test("palabrasSignificativas descarta palabras vacías y conserva negaciones", () => {
  const palabras = palabrasSignificativas("No quiero que añadas nada sin permiso");
  assert.ok(palabras.includes("no"));
  assert.ok(palabras.includes("anadas"));
  assert.ok(palabras.includes("sin"));
  assert.ok(!palabras.includes("que"));
});

test("verificarConservacion da el 100 % cuando aparecen todas las ideas", () => {
  const resultado = verificarConservacion(EJEMPLO, `# Prompt mejorado

## Contexto

- Cuando estoy haciendo un proyecto con la IA no me hace caso.

## Restricciones

- Sin cambiar nada de lo que pido.

## Entrega

- Pásame el prompt ya puesto.
- Devuélvemelo en español.`);

  assert.equal(resultado.total, 4);
  assert.equal(resultado.conservadas, 4);
  assert.equal(resultado.porcentaje, 100);
  assert.deepEqual(resultado.faltantes, []);
});

test("verificarConservacion tolera sinónimos y cambios de redacción", () => {
  const resultado = verificarConservacion(
    "Quiero una página web en español",
    "### Objetivo\n\n- Se desea una página web en español."
  );
  assert.equal(resultado.total, 1);
  assert.equal(resultado.conservadas, 1);
});

test("verificarConservacion detecta una idea que la IA se dejó fuera", () => {
  const resultado = verificarConservacion("Haz una web. No uses Java.", "## Objetivo\n- Haz una web.");
  assert.equal(resultado.total, 2);
  assert.equal(resultado.conservadas, 1);
  assert.equal(resultado.faltantes.length, 1);
  assert.match(resultado.faltantes[0], /java/i);
});

test("verificarConservacion con texto vacío no inventa ideas", () => {
  const resultado = verificarConservacion("   ", "# Prompt mejorado");
  assert.equal(resultado.total, 0);
  assert.equal(resultado.porcentaje, 0);
  assert.deepEqual(resultado.faltantes, []);
});
