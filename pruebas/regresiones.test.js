import test from "node:test";
import assert from "node:assert/strict";
import { verificarConservacion } from "../logica/mejorador.js";
import { crearControlSolicitudes } from "../logica/solicitud.js";
import { obtenerHistorial } from "../logica/historial.js";

test("avisa cuando se elimina una negación o se cambia una cifra", () => {
  for (const [original, generado] of [["No debes usar Java.", "Debes usar Java."], ["El presupuesto máximo es 500 euros.", "El presupuesto máximo es 5000 euros."], ["No uses Java.", "Usa Java. No uses Python."]]) {
    const revision = verificarConservacion(original, generado);
    assert.ok(revision.faltantes.length > 0);
    assert.ok(revision.avisos.length > 0);
  }
});

test("vigila rutas, código y cifras con decimales", () => {
  const revision = verificarConservacion("Modifica src/precios.js al 21% y conserva `precioBase` en 5,50 euros.", "Modifica src/otro.js al 20% y conserva precioFinal en 5,50 euros.");
  assert.ok(revision.avisos.some(aviso => aviso.includes("src/precios.js")));
  assert.ok(revision.avisos.some(aviso => aviso.includes("precioBase")));
  assert.ok(revision.avisos.some(aviso => aviso.includes("21%")));
});

test("bloquea duplicados y descarta una respuesta cancelada aunque llegue tarde", async () => {
  const control = crearControlSolicitudes();
  let terminar;
  const antigua = control.ejecutar(() => new Promise(resolver => { terminar = resolver; }));
  let duplicada = false;
  assert.deepEqual(await control.ejecutar(() => { duplicada = true; }), { vigente: false });
  assert.equal(duplicada, false);
  control.cancelar();
  const nueva = await control.ejecutar(async () => "nuevo");
  terminar("antiguo");
  assert.equal((await antigua).vigente, false);
  assert.deepEqual(nueva, { vigente: true, valor: "nuevo" });
});

test("cancelar comunica la señal y permite reintentar tras un error", async () => {
  const control = crearControlSolicitudes();
  await assert.rejects(control.ejecutar(async () => { throw new Error("red"); }), /red/);
  let señal;
  const activa = control.ejecutar(signal => new Promise((_, rechazar) => {
    señal = signal;
    signal.addEventListener("abort", () => rechazar(signal.reason));
  }));
  control.cancelar();
  assert.equal(señal.aborted, true);
  assert.equal((await activa).vigente, false);
  assert.equal(control.activa, false);
});

test("un historial malformado no impide abrir la aplicación", () => {
  const anterior = globalThis.localStorage;
  try {
    globalThis.localStorage = { getItem: () => '[null,{},12,{"texto":"bien","prompt":"ok"}]' };
    assert.deepEqual(obtenerHistorial(), [{ texto: "bien", prompt: "ok" }]);
  } finally { globalThis.localStorage = anterior; }
});
