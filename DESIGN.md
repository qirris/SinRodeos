---
name: Sin Rodeos
description: Interfaz oscura para dar forma a una petición y revisar el prompt.
colors:
  fondo: "#0f172a"
  superficie: "#182337"
  lienzo: "#121c2e"
  tinta: "#f1f5fc"
  secundario: "#a9b8d0"
  borde: "#35445d"
  acento: "#2563eb"
  enlace: "#93c5fd"
  error: "#fca5a5"
  exito: "#86efac"
  aviso: "#fcd68a"
typography:
  display:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "16px"
    lineHeight: 1.5
  lectura:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "14px"
    lineHeight: 1.75
  accion:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: '"Segoe UI", system-ui, sans-serif'
    fontSize: "12px"
    lineHeight: 1.5
rounded:
  controles: "8px"
  paneles: "14px"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "32": "32px"
  "40": "40px"
components:
  boton-primario:
    backgroundColor: "{colors.acento}"
    textColor: "white"
    typography: "{typography.accion}"
    rounded: "{rounded.controles}"
    padding: "10px 20px"
  boton-secundario:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.controles}"
    padding: "10px 14px"
  boton-texto:
    backgroundColor: "transparent"
    textColor: "{colors.secundario}"
    rounded: "{rounded.controles}"
    padding: "8px 10px"
  campo-texto:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.controles}"
    padding: "16px"
  selector:
    backgroundColor: "{colors.lienzo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.controles}"
    padding: "8px 12px"
  panel:
    backgroundColor: "{colors.superficie}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.paneles}"
    padding: "24px"
  vista-activa:
    backgroundColor: "#2a3c58"
    textColor: "{colors.tinta}"
    typography: "{typography.label}"
    rounded: "{rounded.controles}"
    padding: "8px 12px"
---

# Sistema de diseño: Sin Rodeos

## Visión general

La interfaz conserva el fondo azul tinta y emplea superficies oscuras, bordes visibles y un acento azul para la acción principal. La voz es clara, cercana y directa, según PRODUCT.md.

La identidad actual parte de `logo.png`, la S geométrica con flecha hacia la derecha descrita en PRODUCT.md. La cabecera utiliza `icono-192.png` a 44 × 44 px, con `object-fit: contain`; favicon e iconos PNG/ICO comparten esa fuente.

**Características principales:**

- Texto y controles con jerarquía compacta.
- Profundidad por tonos, espacio y bordes.
- Entrada y resultado presentes en el mismo espacio de trabajo.

Documento extraído de `estilos.css`, `index.html`, PRODUCT.md y la ficha de superficie. La evidencia es estática: no hay capturas ni aprobación visual de esta versión. Se usan encabezados españoles por la instrucción permanente del repositorio; las claves del esquema conservan su forma técnica.

## Colores

El bloque inicial contiene los valores normativos de las variables CSS existentes.

- **Acento:** acción de generar. **Enlace:** enlaces, foco, icono del estado vacío y generación en curso.
- **Fondo:** base de la aplicación. **Superficie:** paneles. **Lienzo:** campos de edición.
- **Tinta:** texto principal. **Secundario:** ayudas, datos y acciones de menor jerarquía. **Borde:** separadores y contornos.
- **Error**, **éxito** y **aviso:** mensajes de estado y revisión; conservan texto que explica su significado.

Los estados al pasar el puntero y la selección de vista usan los valores literales implementados, recogidos en los ejemplos del archivo complementario. No existe una escala tonal definida en el código.

## Tipografía

Segoe UI con alternativas del sistema resuelve títulos, texto y controles. El título principal usa el papel `display`; los encabezados de panel usan `title`. La entrada es de 15 px con interlineado 1,65; el resultado legible usa `lectura`. Ayudas y datos usan 12 px; los contadores tienen cifras tabulares.

Consolas, con alternativa monoespaciada, se reserva para código y salida Markdown. La salida editable de solo lectura usa 13 px; el código integrado usa 0,92 em. El título principal baja a 25 px en móvil.

## Distribución

El contenedor llega a 1280 px, centrado, con márgenes internos de 40 px. La cabecera mide 96 px. El espacio de trabajo usa columnas de proporción 1 : 1,08, separadas por 24 px; los paneles tienen 24 px de relleno.

A 900 px o menos aparece una sola columna y el margen lateral pasa a 24 px. A 480 px o menos pasa a 16 px, la cabecera mide 80 px y los paneles tienen 16 px de relleno. El texto secundario de marca y el atajo se ocultan; la acción principal ocupa el espacio disponible.

La entrada tiene un mínimo de 250 px, o 220 px bajo 900 px. El lienzo de resultado parte de 364 px, o 320 px bajo ese mismo corte. La vista previa limita su altura a 650 px y permite desplazamiento. El historial y la revisión usan desplegables nativos.

## Elevación y profundidad

No hay sombras. La profundidad depende de la diferencia entre fondo, superficie y lienzo, con bordes de 1 px. El estado de generación cambia el borde del panel al color de enlace.

## Formas

Los controles tienen esquinas de 8 px y los paneles de 14 px. El aviso de configuración usa 10 px; el código integrado, 3 px. Los iconos son trazos SVG sin relleno, normalmente de 18 px y grosor 1,7; el del estado vacío es de 48 px y grosor 1,2.

## Componentes

- **Botones:** el primario destaca con azul y texto blanco; copiar y cancelar usan el lienzo con borde. Limpiar y borrar historial son acciones de texto. Botones y selectores tienen un mínimo de 44 px; los desactivados usan opacidad 0,5. Los colores de puntero proceden del CSS existente.
- **Campos:** texto claro, lienzo oscuro, borde completo y redimensionamiento vertical. Los selectores son nativos. El foco visible común es un contorno de 2 px en color de enlace, separado 4 px.
- **Paneles:** encabezado compacto, título y dato o acción. El resultado tiene 16 px de relleno inferior y un estado separado por borde.
- **Vistas:** dos botones agrupados, con selección indicada mediante `aria-pressed` y fondo propio. No se documentan como pestañas ARIA.
- **Salida:** Markdown con títulos azules claros, listas y bloques de código. Al aparecer usa 180 ms, `ease-out`, opacidad de 0,6 a 1 y desplazamiento vertical de 3 px a 0, solo si no se ha solicitado reducir movimiento.
- **Estados:** vacío con icono y explicación; mensaje vivo para el progreso, éxito o error; revisión orientativa en desplegable. El historial usa filas con separadores y texto truncado.

## Qué hacer y qué evitar

### Hacer

- Mantener la identidad de `logo.png` y sus iconos derivados.
- Reutilizar las variables CSS y las variantes existentes.
- Conservar foco visible, etiquetas, estados textuales y movimiento condicionado a la preferencia del usuario.
- Mantener la voz clara, cercana y directa en español.

### Evitar

- Añadir sombras decorativas al sistema plano documentado.
- Sustituir la fuente actual por el recurso anterior `logo.webp`.
- Afirmar validación visual o aprobación del usuario a partir de esta extracción estática.
