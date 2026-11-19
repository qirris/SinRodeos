// Comunicación con Ollama en local. Ningún texto sale del ordenador.

export const MODELO_PREDETERMINADO = "qwen3:8b";
const RUTA_PROXY = "/api/ollama";
const RUTA_DIRECTA = "http://127.0.0.1:11434";

export const INSTRUCCIONES_SISTEMA = `Eres Sin Rodeos, una herramienta que mejora la forma de un prompt sin tocar su contenido.

REGLAS OBLIGATORIAS:
1. Conserva TODA la información del texto del usuario: peticiones, detalles, ejemplos y restricciones.
2. NO añadas requisitos nuevos, NO elimines ninguno y NO cambies el alcance ni la intención.
3. Corrige únicamente ortografía, puntuación, redacción y orden, para que una IA lo entienda mejor.
4. Escribe todo en español.
5. Organiza la salida en secciones claras solo si el contenido lo permite; no inventes secciones vacías.
6. Si algo es ambiguo, conserva la ambigüedad y añade una nota entre corchetes: [Aclarar: ...]. No la resuelvas por tu cuenta.
7. Devuelve ÚNICAMENTE el prompt mejorado. Sin comentarios, sin explicaciones y sin texto previo.`;

async function pedir(ruta, opciones = {}) {
  const rutas = [RUTA_PROXY + ruta, RUTA_DIRECTA + ruta];
  let ultimoError;

  for (const url of rutas) {
    try {
      const respuesta = await fetch(url, opciones);
      if (!respuesta.ok) {
        const cuerpo = await respuesta.json().catch(() => ({}));
        const error = new Error(cuerpo.error || `Ollama respondió con estado ${respuesta.status}.`);
        if (respuesta.status === 404) {
          ultimoError = error;
          continue;
        }
        throw error;
      }
      return await respuesta.json();
    } catch (error) {
      if (error instanceof TypeError) {
        ultimoError = error;
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    "No se pudo conectar con Ollama. Inícialo con el comando ollama serve o usa el modo estricto. " +
      (ultimoError ? `Detalle: ${ultimoError.message}` : "")
  );
}

export async function listarModelos() {
  const datos = await pedir("/api/tags");
  return (datos.models || []).map(modelo => modelo.name).sort();
}

export async function mejorarConOllama(texto, opciones = {}) {
  const { modelo = MODELO_PREDETERMINADO, incluirReglas = true } = opciones;
  const reglasExtra = incluirReglas
    ? "\nAñade al final una sección llamada 'Reglas de precisión' con: respetar literalmente lo indicado, no añadir ni quitar requisitos, preguntar si algo no está claro y responder en español."
    : "\nNo incluyas reglas adicionales: devuelve solo el contenido del usuario reescrito.";

  const datos = await pedir("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: modelo,
      system: INSTRUCCIONES_SISTEMA + reglasExtra,
      prompt: `Texto del usuario:\n---\n${texto}\n---`,
      stream: false,
      options: { temperature: 0.1 }
    })
  });

  const resultado = String(datos.response || "").trim();
  if (!resultado) throw new Error("Ollama devolvió una respuesta vacía. Prueba de nuevo o usa el modo estricto.");
  return resultado;
}
