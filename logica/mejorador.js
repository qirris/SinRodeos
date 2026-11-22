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

  const candidatas = dividirEnIdeas(prompt);
  const auxiliares = new Set(["no", "sin", "nunca", "quiero", "debes", "debe", "uses", "usar", "usa", "haz", "hacer", "es"]);
  const negacion = /\b(no|sin|nunca|jamás|evita|evitar|prohíbe)\b/i;
  const faltantes = [];
  let conservadas = 0;

  for (const { idea, palabras } of ideas) {
    const importantes = palabras.filter(palabra => !auxiliares.has(palabra));
    const buscar = importantes.length ? importantes : palabras;
    const coincide = candidatas.some(candidata => {
      const usadas = new Set(palabrasSignificativas(candidata));
      const proporcion = buscar.filter(palabra => usadas.has(palabra)).length / buscar.length;
      return proporcion >= 0.5 && (!negacion.test(idea) || negacion.test(candidata));
    });
    const literales = extraerLiterales(idea);
    if (coincide && literales.every(literal => contieneLiteral(prompt, literal))) {
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
    faltantes,
    avisos: [...new Set([
      ...extraerLiterales(textoOriginal).filter(literal => !contieneLiteral(prompt, literal)).map(literal => `Comprueba este dato o literal: ${literal}`),
      ...faltantes.map(idea => `Revisa esta parte de tu petición: ${idea}`)
    ])]
  };
}

function contieneLiteral(texto, literal) {
  // Los límites impiden dar por conservado 500 cuando el resultado dice 5000.
  const escapado = literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\p{L}\\p{N}_])${escapado}(?![\\p{L}\\p{N}_])`, "u").test(texto);
}

function extraerLiterales(texto) {
  const patrones = /`([^`\n]+)`|https?:\/\/[^\s<>]+|(?:[\w.-]+\/)+[\w./-]+|\d+(?:[.,]\d+)*(?:\s?%)?/g;
  return [...String(texto || "").matchAll(patrones)].map(coincidencia => coincidencia[1] || coincidencia[0]);
}
