// Lógica pura del modo estricto: ordena y limpia sin tocar el contenido.

export const REGLAS_PRECISION = [
  "Respeta literalmente todo lo indicado; no añadas, no quites y no cambies ningún requisito.",
  "Si algo no está claro, pregunta antes de asumir.",
  "Responde siempre en español."
];

const PATRONES = {
  restricciones: [
    /^no\s/i,
    /\bno\s+(cambies|cambie|modifiques|modifique|añadas|añada|agregues|agregue|quites|quite|elimines|elimine|inventes|invente|uses|use|escribas|escriba)\b/i,
    /\bsin\s+(cambiar|añadir|agregar|quitar|eliminar|inventar|modificar)\b/i,
    /\bnunca\b/i,
    /\bsolo\b/i,
    /\bsolamente\b/i,
    /\búnicamente\b/i,
    /\bevita\b/i,
    /\bevitar\b/i,
    /\bprohibido\b/i
  ],
  entrega: [
    /\bdevuelve\b/i,
    /\bdevuélveme\b/i,
    /\bdevuélvemelo\b/i,
    /\bdevuelvemelo\b/i,
    /\bdevolver\b/i,
    /\bentrega\b/i,
    /\barchivo\b/i,
    /\breadme\b/i,
    /\bcódigo\b/i,
    /\bejemplo\b/i,
    /\bformato\b/i,
    /\bsalida\b/i,
    /\bexplica\b/i,
    /\bexplicar\b/i,
    /\bdocumentación\b/i,
    /\bresponde\b/i,
    /\brespuesta\b/i,
    /\bquiero que\b/i,
    /\bpásame\b/i,
    /\bpasame\b/i,
    /\bpásamelo\b/i
  ],
  contexto: [
    /\bcuando\b/i,
    /\bestoy\b/i,
    /\bestás\b/i,
    /\btengo\b/i,
    /\bes para\b/i,
    /\bproyecto\b/i,
    /\bproyetos\b/i,
    /\btrabajo\b/i,
    /\bcontexto\b/i,
    /\bantes\b/i,
    /\bactualmente\b/i,
    /\bporque\b/i
  ]
};

const ORDEN_SECCIONES = ["objetivo", "contexto", "restricciones", "entrega"];
const TITULOS = {
  objetivo: "Objetivo",
  contexto: "Contexto",
  restricciones: "Restricciones",
  entrega: "Entrega esperada"
};

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

export function clasificarIdea(idea) {
  for (const [seccion, patrones] of Object.entries(PATRONES)) {
    if (patrones.some(patron => patron.test(idea))) return seccion;
  }
  return "objetivo";
}

function terminarFrase(idea) {
  return /[.!?]$/.test(idea) ? idea : `${idea}.`;
}

export function construirPrompt(ideas, opciones = {}) {
  const { incluirReglas = true } = opciones;
  const grupos = { objetivo: [], contexto: [], restricciones: [], entrega: [] };

  for (const idea of ideas) {
    grupos[clasificarIdea(idea)].push(terminarFrase(idea));
  }

  const bloques = ["# Prompt mejorado"];

  for (const seccion of ORDEN_SECCIONES) {
    if (grupos[seccion].length === 0) continue;
    bloques.push(`\n## ${TITULOS[seccion]}\n`);
    bloques.push(grupos[seccion].map(idea => `- ${idea}`).join("\n"));
  }

  if (incluirReglas && ideas.length > 0) {
    bloques.push("\n## Reglas de precisión\n");
    bloques.push(REGLAS_PRECISION.map(regla => `- ${regla}`).join("\n"));
  }

  return bloques.join("\n").trim();
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

export function verificarConservacion(textoOriginal, prompt) {
  const ideas = dividirEnIdeas(textoOriginal)
    .map(normalizarParaComparar)
    .filter(Boolean);
  const destino = normalizarParaComparar(prompt);
  const faltantes = ideas.filter(idea => !destino.includes(idea));
  const conservadas = ideas.length - faltantes.length;

  return {
    total: ideas.length,
    conservadas,
    porcentaje: ideas.length ? Math.round((conservadas / ideas.length) * 100) : 0,
    faltantes
  };
}

export function mejorarEstricto(texto, opciones = {}) {
  const ideas = dividirEnIdeas(texto);
  const prompt = construirPrompt(ideas, opciones);

  return {
    prompt,
    ideas,
    conservacion: verificarConservacion(texto, prompt)
  };
}
