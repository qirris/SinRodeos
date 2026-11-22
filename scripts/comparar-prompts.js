// Comparación manual reproducible. La clave solo la lee el servidor de la aplicación.
import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { crearServidor, llamarGemini } from "../servidor.js";
import { limpiarRespuesta } from "../logica/gemini.js";
import { verificarConservacion } from "../logica/mejorador.js";
import { CASOS_PROMPTS } from "../pruebas/casos-prompts.js";

if (!process.argv.includes("--real")) {
  console.log("Esta comparación envía 24 peticiones ficticias a Gemini usando la configuración de .env. Ejecuta npm run comparar -- --real para realizarla. No mide automáticamente la calidad semántica.");
} else {
  const origen = execFileSync("git", ["show", "14e7c1a:logica/instrucciones.js"], { encoding: "utf8" });
  const anteriores = await import(`data:text/javascript;base64,${Buffer.from(origen).toString("base64")}`);
  let variante = "actual";
  const servidor = crearServidor({ generar: (clave, modelo, texto, estilo, signal) => llamarGemini(clave, modelo, texto, estilo, signal, variante === "anterior" ? anteriores.obtenerInstrucciones(estilo) : undefined) });
  await new Promise(resolver => servidor.listen(0, "127.0.0.1", resolver));
  const url = `http://127.0.0.1:${servidor.address().port}/api/mejorar`;
  const informe = { fecha: new Date().toISOString(), tipo: "Comparación real con entradas ficticias, mismo modelo configurado y límite de salida para ambas variantes.", criterio: "Revisión manual: fidelidad de todos los requisitos, ausencia de añadidos, claridad de tarea y entrega, concisión y adecuación del estilo. Los avisos automáticos no son una puntuación semántica.", casos: [] };
  try {
    for (const caso of CASOS_PROMPTS) {
      const entrada = { ...caso };
      for (variante of ["anterior", "actual"]) {
        const respuesta = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(caso) });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.error);
        const prompt = limpiarRespuesta(datos.prompt);
        entrada[variante] = { prompt, avisos: verificarConservacion(caso.texto, prompt).avisos };
        console.log(`${caso.nombre}: ${variante} completada.`);
        await new Promise(resolver => setTimeout(resolver, 8000));
      }
      informe.casos.push(entrada);
    }
  } catch (error) {
    informe.incompleto = true;
    informe.error = error.message;
    console.error(`Comparación pendiente: ${error.message}`);
    process.exitCode = 1;
  } finally {
    servidor.closeAllConnections();
    await new Promise(resolver => servidor.close(resolver));
    await fs.mkdir(".impeccable/review", { recursive: true });
    await fs.writeFile(".impeccable/review/comparacion-prompts.json", JSON.stringify(informe, null, 2));
    console.log(`Pares completos: ${informe.casos.length}/12. Informe en .impeccable/review/comparacion-prompts.json`);
  }
}
