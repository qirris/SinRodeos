// La clave solo la conoce el servidor local.
export function limpiarRespuesta(texto) {
  if (typeof texto !== "string") return "";
  let resultado = texto.trim();
  // Solo se retira una introducción inequívoca, nunca un título como «Seguro de viaje».
  resultado = resultado.replace(/^(?:aqu[ií] tienes|aqu[ií] est[aá]) (?:tu |el )?prompt(?: mejorado)?\s*:\s*\n/i, "");
  const envoltorio = resultado.match(/^```(?:markdown|md|text)\s*\n([\s\S]*)\n```$/i);
  if (envoltorio && !envoltorio[1].includes("```")) resultado = envoltorio[1];
  return resultado.trim();
}

export async function mejorarConGemini(texto, estilo = "preciso", { signal } = {}) {
  let respuesta;
  try {
    respuesta = await fetch("/api/mejorar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, estilo }),
      signal
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("No se pudo conectar con el servidor local. Vuelve a abrir Sin Rodeos.");
  }
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(datos.error || "No se pudo generar el prompt. Inténtalo de nuevo.");
    error.codigo = datos.codigo || "desconocido";
    throw error;
  }
  const prompt = limpiarRespuesta(datos.prompt);
  if (!prompt) throw new Error("La IA devolvió una respuesta vacía. Inténtalo de nuevo.");
  return prompt;
}
