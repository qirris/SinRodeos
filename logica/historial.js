// Historial local en el navegador. No se envía a ningún servidor.

const CLAVE = "sinrodeos.historial.v1";
const LIMITE = 10;

export function obtenerHistorial() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) || "[]");
    return Array.isArray(datos) ? datos.filter(entrada => entrada && typeof entrada.texto === "string" && typeof entrada.prompt === "string").slice(0, LIMITE) : [];
  } catch {
    return [];
  }
}

export function guardarEnHistorial(entrada) {
  try {
    const actual = obtenerHistorial();
    const nueva = {
      id: Date.now(),
      texto: entrada.texto || "",
      prompt: entrada.prompt || "",
      estilo: entrada.estilo || "preciso",
      fecha: new Date().toISOString()
    };
    localStorage.setItem(CLAVE, JSON.stringify([nueva, ...actual].slice(0, LIMITE)));
    return nueva;
  } catch {
    return null;
  }
}

export function borrarHistorial() {
  try {
    localStorage.removeItem(CLAVE);
    return true;
  } catch {
    return false;
  }
}
