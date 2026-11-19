import test from "node:test";
import assert from "node:assert/strict";

import { limpiarRespuesta } from "../logica/gemini.js";
import { INSTRUCCIONES_SISTEMA, obtenerInstrucciones } from "../logica/instrucciones.js";

test("limpiarRespuesta quita el envoltorio de código Markdown", () => {
  const entrada = "```markdown\n# Prompt mejorado\n\n- Haz una web.\n```";
  assert.equal(limpiarRespuesta(entrada), "# Prompt mejorado\n\n- Haz una web.");
});

test("limpiarRespuesta quita introducciones que no se pidieron", () => {
  assert.equal(limpiarRespuesta("Aquí tienes tu prompt:\n# Prompt mejorado"), "# Prompt mejorado");
});

test("limpiarRespuesta respeta texto ya limpio y entradas vacías", () => {
  assert.equal(limpiarRespuesta("  # Prompt  "), "# Prompt");
  assert.equal(limpiarRespuesta(""), "");
  assert.equal(limpiarRespuesta(null), "");
});

test("las instrucciones de sistema protegen el contenido y piden buen formato", () => {
  assert.match(INSTRUCCIONES_SISTEMA, /NO añadas/);
  assert.match(INSTRUCCIONES_SISTEMA, /NO elimines/);
  assert.match(INSTRUCCIONES_SISTEMA, /NO cambies/);
  assert.match(INSTRUCCIONES_SISTEMA, /español/);
  assert.match(INSTRUCCIONES_SISTEMA, /Markdown/);
});

test("cada estilo añade sus reglas y mantiene las comunes", () => {
  const estilos = {
    preciso: /Objetivo, Contexto, Restricciones y Formato de salida/,
    directo: /m[aá]ximo de 6 l[ií]neas/,
    analitico: /Razonamiento paso a paso/,
    creativo: /Sugerencias/
  };

  for (const [estilo, patron] of Object.entries(estilos)) {
    const instrucciones = obtenerInstrucciones(estilo);
    assert.match(instrucciones, patron);
    assert.match(instrucciones, /NO añadas/);
    assert.match(instrucciones, /NO elimines/);
    assert.match(instrucciones, /NO cambies/);
    assert.match(instrucciones, /español/);
  }
});

test("un estilo desconocido usa el preciso por defecto", () => {
  assert.equal(obtenerInstrucciones("inexistente"), INSTRUCCIONES_SISTEMA);
});
