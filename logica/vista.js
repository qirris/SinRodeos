// Markdown limitado: solo creamos nodos y texto, nunca ejecutamos HTML generado.
function insertarEnLinea(nodo, texto, documento) {
  for (const parte of texto.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)) {
    const etiqueta = parte.startsWith("`") && parte.endsWith("`") ? "code" : parte.startsWith("**") && parte.endsWith("**") ? "strong" : null;
    if (!etiqueta) { nodo.append(documento.createTextNode(parte)); continue; }
    const hijo = documento.createElement(etiqueta);
    hijo.textContent = parte.slice(etiqueta === "code" ? 1 : 2, etiqueta === "code" ? -1 : -2);
    nodo.append(hijo);
  }
}

export function renderizarMarkdown(contenedor, texto) {
  const documento = contenedor.ownerDocument;
  const fragmento = documento.createDocumentFragment();
  const listas = [];
  let codigo = null;
  for (const linea of texto.split(/\r?\n/)) {
    if (/^\s*```/.test(linea)) {
      if (codigo) codigo = null;
      else {
        const bloque = documento.createElement("pre");
        codigo = documento.createElement("code");
        bloque.append(codigo);
        fragmento.append(bloque);
      }
      listas.length = 0;
      continue;
    }
    if (codigo) { codigo.textContent += `${linea}\n`; continue; }
    if (!linea.trim()) continue;
    const titulo = linea.match(/^(#{1,6})\s+(.+)$/);
    const elementoLista = linea.match(/^(\s*)(?:([-*+])|(\d+)[.)])\s+(.+)$/);
    if (elementoLista) {
      const tipo = elementoLista[2] ? "ul" : "ol";
      const sangria = elementoLista[1].replace(/\t/g, "    ").length;
      while (listas.length && (sangria < listas.at(-1).sangria || sangria === listas.at(-1).sangria && tipo !== listas.at(-1).tipo)) listas.pop();
      if (!listas.length || sangria > listas.at(-1).sangria) {
        const lista = documento.createElement(tipo);
        if (tipo === "ol") lista.start = Number(elementoLista[3]);
        (listas.at(-1)?.ultimo || fragmento).append(lista);
        listas.push({ lista, tipo, sangria, ultimo: null });
      }
      const item = documento.createElement("li");
      if (tipo === "ol") item.value = Number(elementoLista[3]);
      insertarEnLinea(item, elementoLista[4], documento);
      listas.at(-1).lista.append(item);
      listas.at(-1).ultimo = item;
    } else {
      listas.length = 0;
      const nodo = documento.createElement(titulo ? "h3" : "p");
      insertarEnLinea(nodo, titulo ? titulo[2] : linea, documento);
      fragmento.append(nodo);
    }
  }
  contenedor.replaceChildren(fragmento);
}
