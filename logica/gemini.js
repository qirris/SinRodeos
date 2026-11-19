// Llamada al servidor local, que es quien guarda la clave y habla con Gemini.
// El navegador nunca ve la clave API.

const RUTA_MEJORAR = "/api/mejorar";

export function limpiarRespuesta(texto) {
  if (!texto) return "";

  let resultado = String(texto).trim();

  // A veces la IA envuelve el resultado en un bloque de código aunque se le diga que no.
  resultado = resultado.replace(/^```(?:markdown|md|text)?\s*\n?/i, "").replace(/\n?```\s*$/, "");

  // Tampoco debería aparecer, pero si sale una frase de introducción, se quita.
  resultado = resultado.replace(
    /^(?:aqu[ií] tienes|aqu[ií] est[aá]|claro|por supuesto|seguro)[^:\n]{0,40}:\s*/i,
    ""
  );

  return resultado.trim();
}

export async function mejorarConGemini(texto, estilo = "preciso") {
  let respuesta;

  try {
    respuesta = await fetch(RUTA_MEJORAR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto, estilo })
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor local. Comprueba que la aplicación esté abierta.");
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(datos.error || "No se pudo generar el prompt.");
    error.codigo = datos.codigo || "desconocido";
    throw error;
  }

  const prompt = limpiarRespuesta(datos.prompt);
  if (!prompt) {
    throw new Error("La IA devolvió una respuesta vacía. Prueba de nuevo.");
  }

  return prompt;
}
