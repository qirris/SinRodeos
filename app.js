// Cableado de la interfaz. La lógica de negocio vive en logica/.

import { mejorarEstricto } from "./logica/mejorador.js";
import { listarModelos, mejorarConOllama, MODELO_PREDETERMINADO } from "./logica/ollama.js";
import { obtenerHistorial, guardarEnHistorial, borrarHistorial } from "./logica/historial.js";

const elementos = {
  textoEntrada: document.getElementById("textoEntrada"),
  textoSalida: document.getElementById("textoSalida"),
  contadorEntrada: document.getElementById("contadorEntrada"),
  indicadorConservacion: document.getElementById("indicadorConservacion"),
  estado: document.getElementById("estado"),
  panelSalida: document.getElementById("panelSalida"),
  modoEstricto: document.getElementById("modoEstricto"),
  modoIA: document.getElementById("modoIA"),
  opcionModelo: document.getElementById("opcionModelo"),
  modeloOllama: document.getElementById("modeloOllama"),
  estadoOllama: document.getElementById("estadoOllama"),
  incluirReglas: document.getElementById("incluirReglas"),
  botonMejorar: document.getElementById("botonMejorar"),
  etiquetaMejorar: document.getElementById("etiquetaMejorar"),
  botonCopiar: document.getElementById("botonCopiar"),
  botonEjemplo: document.getElementById("botonEjemplo"),
  botonLimpiar: document.getElementById("botonLimpiar"),
  botonBorrarHistorial: document.getElementById("botonBorrarHistorial"),
  listaHistorial: document.getElementById("listaHistorial"),
  historialVacio: document.getElementById("historialVacio")
};

const EJEMPLO = `cuando estoy trabajando con la ia en mis proyectos no me hace caso y lo hace mal
quiero que me pases un prompt ya puesto con lo que yo pido
sin cambiar nada de lo que he pedido ni añadir cosas
solo que esté mejor escrito y sea más claro
devuélvemelo en español`;

function actualizarContador() {
  const longitud = elementos.textoEntrada.value.length;
  elementos.contadorEntrada.textContent = `${longitud} ${longitud === 1 ? "carácter" : "caracteres"}`;
}

function mostrarMensaje(texto, tipo = "normal") {
  elementos.estado.textContent = texto;
  elementos.estado.className = `pista${tipo === "normal" ? "" : ` pista--${tipo}`}`;
}

function actualizarIndicador(conservacion) {
  if (!conservacion || conservacion.total === 0) {
    elementos.indicadorConservacion.hidden = true;
    return;
  }

  elementos.indicadorConservacion.hidden = false;
  elementos.indicadorConservacion.textContent =
    `${conservacion.conservadas}/${conservacion.total} ideas conservadas`;
  elementos.indicadorConservacion.className =
    `etiqueta ${conservacion.porcentaje === 100 ? "etiqueta--bien" : "etiqueta--mal"}`;
}

function sincronizarModo() {
  elementos.opcionModelo.hidden = !elementos.modoIA.checked;
}

async function comprobarOllama() {
  try {
    const modelos = await listarModelos();
    const disponibles = modelos.length ? modelos : [MODELO_PREDETERMINADO];

    elementos.modeloOllama.replaceChildren(
      ...disponibles.map(nombre => {
        const opcion = document.createElement("option");
        opcion.value = nombre;
        opcion.textContent = nombre;
        return opcion;
      })
    );

    if (disponibles.includes(MODELO_PREDETERMINADO)) {
      elementos.modeloOllama.value = MODELO_PREDETERMINADO;
    }

    elementos.estadoOllama.textContent = `Ollama en línea · ${modelos.length} modelo(s)`;
    elementos.estadoOllama.className = "estado-ollama disponible";
  } catch (error) {
    elementos.estadoOllama.textContent = "Ollama apagado · usa el modo estricto";
    elementos.estadoOllama.className = "estado-ollama no-disponible";
  }
}

function establecerCargando(cargando) {
  elementos.botonMejorar.disabled = cargando;
  elementos.etiquetaMejorar.textContent = cargando ? "Mejorando…" : "Convertir en prompt";
  elementos.panelSalida.classList.toggle("procesando", cargando);
}

function renderizarHistorial() {
  const entradas = obtenerHistorial();
  elementos.listaHistorial.replaceChildren();
  elementos.historialVacio.hidden = entradas.length > 0;

  for (const entrada of entradas) {
    const item = document.createElement("li");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "entrada-historial";

    const modo = document.createElement("span");
    modo.className = "entrada-historial__modo";
    modo.textContent = entrada.modo === "ia" ? "IA local" : "Estricto";

    const resumen = document.createElement("span");
    resumen.className = "entrada-historial__resumen";
    resumen.textContent = entrada.texto.replace(/\s+/g, " ").trim().slice(0, 110);

    boton.append(modo, resumen);
    boton.addEventListener("click", () => {
      elementos.textoEntrada.value = entrada.texto;
      elementos.textoSalida.value = entrada.prompt;
      actualizarContador();
      actualizarIndicador(null);
      mostrarMensaje("Entrada del historial restaurada.");
      elementos.textoEntrada.focus();
    });

    item.appendChild(boton);
    elementos.listaHistorial.appendChild(item);
  }
}

async function mejorar() {
  const texto = elementos.textoEntrada.value.trim();

  if (!texto) {
    mostrarMensaje("Escribe primero lo que quieres pedir.", "error");
    elementos.textoEntrada.focus();
    return;
  }

  const usaIA = elementos.modoIA.checked;
  establecerCargando(true);
  mostrarMensaje("Mejorando el texto…");

  try {
    let prompt;
    let conservacion = null;

    if (usaIA) {
      prompt = await mejorarConOllama(texto, {
        modelo: elementos.modeloOllama.value,
        incluirReglas: elementos.incluirReglas.checked
      });
    } else {
      const resultado = mejorarEstricto(texto, {
        incluirReglas: elementos.incluirReglas.checked
      });
      prompt = resultado.prompt;
      conservacion = resultado.conservacion;
    }

    elementos.textoSalida.value = prompt;
    actualizarIndicador(conservacion);
    guardarEnHistorial({ texto, prompt, modo: usaIA ? "ia" : "estricto" });
    renderizarHistorial();

    mostrarMensaje(
      usaIA
        ? "Prompt generado con IA local. Revisa que conserve todo."
        : "Prompt listo: todas tus ideas siguen aquí.",
      "exito"
    );
  } catch (error) {
    mostrarMensaje(error.message || "No se pudo generar el prompt.", "error");
  } finally {
    establecerCargando(false);
  }
}

async function copiarPrompt() {
  const texto = elementos.textoSalida.value;

  if (!texto) {
    mostrarMensaje("Primero genera un prompt para copiar.", "error");
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(texto);
    } else {
      const auxiliar = document.createElement("textarea");
      auxiliar.value = texto;
      auxiliar.style.position = "fixed";
      auxiliar.style.opacity = "0";
      document.body.appendChild(auxiliar);
      auxiliar.select();
      document.execCommand("copy");
      auxiliar.remove();
    }
    mostrarMensaje("Prompt copiado al portapapeles.", "exito");
  } catch {
    mostrarMensaje("No se pudo copiar. Selecciona el texto y cópialo a mano.", "error");
  }
}

elementos.textoEntrada.addEventListener("input", actualizarContador);
elementos.botonMejorar.addEventListener("click", mejorar);
elementos.botonCopiar.addEventListener("click", copiarPrompt);
elementos.botonEjemplo.addEventListener("click", () => {
  elementos.textoEntrada.value = EJEMPLO;
  actualizarContador();
  elementos.textoEntrada.focus();
  mostrarMensaje("Ejemplo cargado. Puedes editarlo o convertirlo directamente.");
});
elementos.botonLimpiar.addEventListener("click", () => {
  elementos.textoEntrada.value = "";
  elementos.textoSalida.value = "";
  actualizarContador();
  actualizarIndicador(null);
  elementos.textoEntrada.focus();
  mostrarMensaje("Texto borrado.");
});
elementos.botonBorrarHistorial.addEventListener("click", () => {
  borrarHistorial();
  renderizarHistorial();
  mostrarMensaje("Historial borrado de este navegador.");
});
elementos.modoEstricto.addEventListener("change", sincronizarModo);
elementos.modoIA.addEventListener("change", sincronizarModo);
document.addEventListener("keydown", evento => {
  if ((evento.ctrlKey || evento.metaKey) && evento.key === "Enter") {
    evento.preventDefault();
    mejorar();
  }
});

actualizarContador();
renderizarHistorial();
sincronizarModo();
comprobarOllama();
