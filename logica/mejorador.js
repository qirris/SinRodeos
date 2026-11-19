// Comprobación interna de conservación. No genera el prompt: solo revisa que la IA
// no se haya dejado ninguna idea fuera. Es una red de seguridad aproximada, nunca
// sustituye el resultado de Gemini ni bloquea la entrega.

const PALABRAS_VACIAS = new Set([
  "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "y", "o", "u",
  "en", "con", "por", "para", "que", "se", "su", "sus", "al", "del", "lo",
  "como", "más", "mi", "mis", "tu", "tus", "me", "te", "le", "les", "ya",
  "hay", "eso", "esta", "este", "esto", "porque", "cuando", "si"
]);

export function normalizarEspacios(texto) {
  return String(texto || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function dividirEnIdeas(texto) {
  const limpio = normalizarEspacios(texto);
  if (!limpio) return [];

  const conSaltos = limpio
    .replace(/([.!?;])\s+/g, "$1\n")
    .replace(/\n+/g, "\n");

  return conSaltos
    .split("\n")
    .map(idea => idea.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

function normalizarParaComparar(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function palabrasSignificativas(texto) {
  return normalizarParaComparar(texto)
    .split(" ")
    .filter(palabra => palabra.length >= 2 && !PALABRAS_VACIAS.has(palabra));
}

export function verificarConservacion(textoOriginal, prompt) {
  const ideas = dividirEnIdeas(textoOriginal)
    .map(idea => ({ idea, palabras: palabrasSignificativas(idea) }))
    .filter(entrada => entrada.palabras.length > 0);

  const usadas = new Set(palabrasSignificativas(prompt));
  const faltantes = [];
  let conservadas = 0;

  for (const { idea, palabras } of ideas) {
    const encontradas = palabras.filter(palabra => usadas.has(palabra)).length;
    if (encontradas / palabras.length >= 0.5) {
      conservadas++;
    } else {
      faltantes.push(idea);
    }
  }

  const total = ideas.length;
  return {
    total,
    conservadas,
    porcentaje: total ? Math.round((conservadas / total) * 100) : 0,
    faltantes
  };
}
