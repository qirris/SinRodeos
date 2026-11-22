import { mejorarConGemini } from "./logica/gemini.js";
import { verificarConservacion } from "./logica/mejorador.js";
import { obtenerHistorial, guardarEnHistorial, borrarHistorial } from "./logica/historial.js";
import { crearControlSolicitudes } from "./logica/solicitud.js";
import { renderizarMarkdown } from "./logica/vista.js";

const ids = ["textoEntrada", "textoSalida", "contadorEntrada", "avisoConfiguracion", "selectorEstilo", "descripcionEstilo", "selectorEjemplo", "estado", "panelSalida", "botonMejorar", "etiquetaMejorar", "botonCancelar", "botonCopiar", "botonLimpiar", "botonBorrarHistorial", "listaHistorial", "historialVacio", "contadorHistorial", "salidaVacia", "vistaPrevia", "botonVistaPrevia", "botonVistaTexto", "estiloResultado", "revision", "resumenRevision", "listaRevision"];
const elementos = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
const estilos = {
  preciso: ["Preciso", "Tareas, restricciones y entrega bien ordenadas."],
  directo: ["Directo", "Lo esencial, con todos los requisitos y sin rodeos."],
  analitico: ["Analítico", "El objetivo y los pasos de trabajo en un orden claro."],
  creativo: ["Creativo", "Una redacción más expresiva, fiel a tu encargo."]
};
const ejemplos = {
  fallo: "arregla el login de mi proyecto en React, al entrar con correo y contraseña se queda cargando. no metas librerías ni toques el registro. devuélveme los archivos modificados completos",
  funcion: "necesito una función en JavaScript que reciba una lista de productos con nombre y precio, descarte los que cuesten más de 500 euros y ordene los demás de menor a mayor. no cambies la lista original. quiero el código y un ejemplo de uso",
  interfaz: "mejora la pantalla de ajustes de mi app, mantén el logo y el tema oscuro. quiero que se lea mejor en móvil y que se pueda usar con teclado. no cambies las opciones que ya existen"
};
const solicitudes = crearControlSolicitudes();
let version = 0;
let vistaTexto = false;

function mensaje(texto, tipo = "normal") {
  elementos.estado.textContent = texto;
  elementos.estado.className = `estado${tipo === "normal" ? "" : ` estado--${tipo}`}`;
}

function contador() {
  const longitud = elementos.textoEntrada.value.length;
  elementos.contadorEntrada.textContent = `${longitud.toLocaleString("es")} ${longitud === 1 ? "carácter" : "caracteres"}`;
}

function cargando(valor) {
  elementos.botonMejorar.disabled = valor;
  elementos.botonCancelar.hidden = !valor;
  elementos.etiquetaMejorar.textContent = valor ? "Generando…" : "Generar prompt";
  elementos.panelSalida.setAttribute("aria-busy", String(valor));
  elementos.botonCopiar.disabled = valor || !elementos.textoSalida.value;
}

function presentarVista() {
  const hayPrompt = Boolean(elementos.textoSalida.value);
  elementos.salidaVacia.hidden = hayPrompt;
  elementos.textoSalida.hidden = !hayPrompt || !vistaTexto;
  elementos.vistaPrevia.hidden = !hayPrompt || vistaTexto;
  elementos.botonVistaPrevia.setAttribute("aria-pressed", String(!vistaTexto));
  elementos.botonVistaTexto.setAttribute("aria-pressed", String(vistaTexto));
}

function resultado(prompt, texto = "", estilo = "preciso") {
  elementos.textoSalida.value = prompt;
  elementos.estiloResultado.textContent = prompt ? estilos[estilo]?.[0] || "Preciso" : "";
  renderizarMarkdown(elementos.vistaPrevia, prompt);
  elementos.botonCopiar.disabled = !prompt;
  elementos.revision.hidden = !prompt;
  elementos.revision.open = false;
  elementos.listaRevision.replaceChildren();
  if (prompt) {
    const revision = verificarConservacion(texto, prompt);
    elementos.resumenRevision.textContent = revision.avisos.length ? `Revisión orientativa · ${revision.avisos.length} puntos para comprobar` : "Revisión orientativa · contrasta tu petición";
    for (const aviso of revision.avisos) {
      const item = document.createElement("li");
      item.textContent = aviso;
      elementos.listaRevision.append(item);
    }
  }
  presentarVista();
}

function cancelar(texto = "Generación cancelada.") {
  version++;
  solicitudes.cancelar();
  cargando(false);
  mensaje(texto);
}

function editar() {
  if (solicitudes.activa) cancelar("Texto modificado. Genera de nuevo cuando lo tengas listo.");
  resultado("");
  elementos.avisoConfiguracion.hidden = true;
  contador();
}

function historial() {
  const entradas = obtenerHistorial();
  elementos.listaHistorial.replaceChildren();
  elementos.historialVacio.hidden = entradas.length > 0;
  elementos.contadorHistorial.textContent = String(entradas.length);
  elementos.botonBorrarHistorial.disabled = entradas.length === 0;
  for (const entrada of entradas) {
    const item = document.createElement("li");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "entrada-historial";
    const estilo = Object.hasOwn(estilos, entrada.estilo) ? entrada.estilo : "preciso";
    const etiqueta = document.createElement("span");
    etiqueta.textContent = estilos[estilo][0];
    const resumen = document.createElement("span");
    resumen.textContent = entrada.texto.replace(/\s+/g, " ").trim().slice(0, 160);
    boton.append(etiqueta, resumen);
    boton.addEventListener("click", () => {
      cancelar("Prompt del historial restaurado.");
      elementos.textoEntrada.value = entrada.texto;
      elementos.selectorEstilo.value = estilo;
      elementos.descripcionEstilo.textContent = estilos[estilo][1];
      contador();
      resultado(entrada.prompt, entrada.texto, estilo);
      elementos.textoEntrada.focus();
    });
    item.append(boton);
    elementos.listaHistorial.append(item);
  }
}

async function mejorar() {
  if (solicitudes.activa) return;
  const texto = elementos.textoEntrada.value.trim();
  if (!texto) { mensaje("Escribe primero lo que quieres pedir.", "error"); elementos.textoEntrada.focus(); return; }
  const estilo = elementos.selectorEstilo.value;
  const vigente = ++version;
  resultado("");
  cargando(true);
  elementos.avisoConfiguracion.hidden = true;
  mensaje("Ordenando tu petición con IA. Puedes cancelar si lo necesitas.");
  const temporizador = setTimeout(() => {
    if (version === vigente) cancelar("La generación tardó demasiado. Inténtalo de nuevo.");
  }, 70000);
  try {
    const respuesta = await solicitudes.ejecutar(signal => mejorarConGemini(texto, estilo, { signal }));
    if (!respuesta.vigente || version !== vigente) return;
    resultado(respuesta.valor, texto, estilo);
    const guardado = guardarEnHistorial({ texto, prompt: respuesta.valor, estilo });
    historial();
    mensaje(guardado ? "Prompt listo. Revísalo y cópialo cuando quieras." : "Prompt listo. El navegador no permitió guardarlo en el historial.");
  } catch (error) {
    if (version !== vigente) return;
    elementos.avisoConfiguracion.hidden = error.codigo !== "sin_clave";
    mensaje(error.message || "No se pudo generar el prompt. Inténtalo de nuevo.", "error");
  } finally {
    clearTimeout(temporizador);
    if (version === vigente) cargando(false);
  }
}

async function copiar() {
  const texto = elementos.textoSalida.value;
  if (!texto || solicitudes.activa) return;
  try {
    try {
      if (!navigator.clipboard?.writeText) throw new Error();
      await navigator.clipboard.writeText(texto);
    } catch {
      const auxiliar = document.createElement("textarea");
      auxiliar.className = "sr-only";
      auxiliar.value = texto;
      document.body.append(auxiliar);
      auxiliar.select();
      let copiado;
      try { copiado = document.execCommand("copy"); } finally { auxiliar.remove(); elementos.botonCopiar.focus(); }
      if (!copiado) throw new Error();
    }
    if (elementos.textoSalida.value === texto) mensaje("Prompt copiado. Ya puedes pegarlo en tu IA.", "exito");
  } catch {
    vistaTexto = true;
    presentarVista();
    elementos.textoSalida.focus();
    elementos.textoSalida.select();
    mensaje("El navegador no permitió copiar. Pulsa Ctrl o ⌘ + C para copiar el texto seleccionado.", "error");
  }
}

elementos.textoEntrada.addEventListener("input", editar);
elementos.selectorEstilo.addEventListener("change", () => { editar(); elementos.descripcionEstilo.textContent = estilos[elementos.selectorEstilo.value][1]; });
elementos.selectorEjemplo.addEventListener("change", () => {
  if (!ejemplos[elementos.selectorEjemplo.value]) return;
  elementos.textoEntrada.value = ejemplos[elementos.selectorEjemplo.value];
  editar();
  elementos.selectorEjemplo.value = "";
  elementos.textoEntrada.focus();
  mensaje("Ejemplo cargado. Adáptalo a tu proyecto antes de generar.");
});
elementos.botonMejorar.addEventListener("click", mejorar);
elementos.botonCancelar.addEventListener("click", () => cancelar());
elementos.botonCopiar.addEventListener("click", copiar);
elementos.botonLimpiar.addEventListener("click", () => { cancelar("Texto borrado."); elementos.textoEntrada.value = ""; editar(); elementos.textoEntrada.focus(); });
elementos.botonVistaPrevia.addEventListener("click", () => { vistaTexto = false; presentarVista(); });
elementos.botonVistaTexto.addEventListener("click", () => { vistaTexto = true; presentarVista(); });
elementos.botonBorrarHistorial.addEventListener("click", () => { const borrado = borrarHistorial(); historial(); mensaje(borrado ? "Historial borrado de este navegador." : "No se pudo borrar el historial. Revisa los permisos del navegador.", borrado ? "normal" : "error"); });
document.addEventListener("keydown", evento => {
  if (!evento.isComposing && (evento.ctrlKey || evento.metaKey) && evento.key === "Enter") { evento.preventDefault(); mejorar(); }
});

// Retirar únicamente las cachés y el limpiador de versiones anteriores de Sin Rodeos.
window.addEventListener("load", async () => {
  try {
    if ("serviceWorker" in navigator) {
      const registros = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registros.filter(registro => [registro.active, registro.waiting, registro.installing].some(worker => worker && new URL(worker.scriptURL).pathname === "/service-worker.js")).map(registro => registro.unregister()));
    }
    if ("caches" in window) {
      const claves = await caches.keys();
      await Promise.all(claves.filter(clave => clave.startsWith("sinrodeos-")).map(clave => caches.delete(clave)));
    }
  } catch { /* La interfaz sigue disponible aunque el navegador impida limpiar la caché. */ }
});
contador();
historial();
presentarVista();
