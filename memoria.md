# Memoria del proyecto

Archivo de memoria persistente de OpenCode. Actualízalo tras cada avance importante.
Regla: NO guardar aquí contraseñas, tokens ni ningún secreto.

## 1. Objetivo y alcance

**Sin Rodeos** convierte un texto en bruto escrito por el usuario (en español, con errores, desordenado o mal explicado) en un prompt claro y profesional **sin cambiar nada de lo pedido**: conserva todo el contenido, corrige solo la forma y lo estructura para que una IA lo entienda a la primera.

Usuario: qirris. Idioma de producto, interfaz, documentación y commits: **español**. Repositorio público: <https://github.com/qirris/SinRodeos>.

Evolución actual: la redacción la hace siempre la API gratuita de Gemini, sin Ollama local. La app se presenta como aplicación de escritorio en Windows (ventana propia e icono). El usuario no quiere encender ninguna IA en su ordenador.

## 2. Estado actual

- 2026-11-24: presentación pública aprobada para empresas publicada en `main`, commit `c2b90e6da5314fb1e3d5a72bde2ae97aedd4d5b0`. README visual y caso de estudio en `docs/PROYECTO.md`, con motivación confirmada, papel del autor y código generado mayoritariamente con IA. Diferenciados OmniRoute/Codex/ImageGen durante el desarrollo y Gemini durante el uso. Captura real recortada solo por el marco de Windows; comparativa de un caso ficticio con respuesta real, también legible en móvil. 31/31 pruebas reejecutadas. Referencia remota, documentos e imágenes comprobados mediante GitHub. Instalación habitual actualizada por avance directo y limpia; configuración privada con los mismos metadatos, sin leer el contenido. Sin cambios de funcionamiento, API, servidor en ejecución ni ventanas.

- 2026-11-22, incidencia del icono de título: la captura del usuario muestra el logo interior actualizado y un icono oscuro en la esquina superior de Windows. Añadida variante transparente del símbolo, favicon de 16/32 px y nombres v4; manifest y lanzador renuevan sus referencias sin cambiar de origen. Archivos y 31/31 pruebas verificados; queda confirmar el icono real tras reabrir la app. No se manejan ventanas ni se reinicia el Explorador.

- 2026-11-22, continuación: instalación habitual actualizada desde GitHub a la versión 1.2.0 con `git pull --ff-only`, tras comprobar que estaba limpia. `.env` conserva tamaño y fecha de modificación. Servidor anterior de Sin Rodeos identificado en el puerto 8000 y reiniciado sin ventanas; nuevo proceso `11896`, enlace exclusivo a `127.0.0.1`. Página e icono responden 200, `.env` responde 404 y una generación real ficticia responde 200. Accesos directos y ventanas del usuario no se han modificado.

- 2026-11-22, publicación verificada: versión 1.2.0 y nuevo logo subidos a `main`, commit `a7127ba19d1e5086364648799c3ec17cd23fa5bc`. `git ls-remote` coincide con el commit local y la lectura mediante GitHub confirma la cabecera actualizada y la procedencia del logo. La clave y el informe privado no están incluidos. La instalación anterior y su acceso directo permanecen sin modificar.

- 2026-11-22, cierre para publicación: versión 1.2.0 preparada para `main` con las mejoras y el nuevo logo. Pruebas reejecutadas: 31/31. README e instrucciones actualizados con los límites reales; clave e informes de revisión ignorados por git. La publicación se registrará después de comprobar el remoto.

- 2026-11-22, petición posterior: el usuario pidió cambiar el dibujo del logo. Creado un nuevo símbolo S/flecha azul sobre azul tinta con ImageGen y guardado en `logo.png`; integrado en cabecera, favicon, PNG de 192/512 px e ICO de 32/48/64/256 px. Transparencia comprobada en las esquinas. Original `logo.webp` conservado. Cambios en la copia local, sin publicación ni modificación de accesos directos de Windows.

- 2026-11-22: implementación local del plan aprobado en la rama `codex/mejorar-prompts-e-interfaz`, todavía sin commit ni publicación. Nueva pantalla oscura, instrucciones revisadas, cancelación y restricciones del servidor. `npm test`: 31/31. Comparación real: 11/12 pares completados; el último falló por disponibilidad del proveedor. No se ha afirmado una mejora semántica medida.
- 2026-11-22: el usuario objetó al intento de controlar Chrome; se detuvo Computer Use y el trabajo. No volver a controlar ventanas sin petición expresa. Después pidió corregir el logo: se ajustó únicamente su presentación en los archivos locales.
- 2026-11-22: logo de cabecera con encuadre centrado, márgenes reducidos y proporciones originales (1024 × 765). El archivo original se conserva. Comprobación visual pendiente por el bloqueo del navegador integrado y de Computer Use.

- 2026-11-19: aplicación terminada y funcionando con IA en la nube. Última verificación: 2026-11-19.
- 2026-11-19: clave del usuario ya pegada en `.env` (longitud detectada: 53 caracteres). **Nunca abrir ni mostrar la clave**; comprobar solo su presencia.
- 2026-11-19: llamada real a `POST /api/mejorar` verificada con estado 200 y prompt generado.
- 2026-11-19: `npm test` → 13/13 en verde; detector de diseño → `[]`.
- 2026-11-19: cuatro estilos de prompt disponibles (Preciso, Directo, Analítico y Creativo) con selector en la interfaz.
- 2026-11-19: iconos regenerados desde `logo.webp` con Edge headless (color claro verificado: mismo promedio RGB que el logo original).
- 2026-11-19: endpoints estáticos verificados (`/`, manifest, icono y service worker → 200 con MIME correcto).
- 2026-11-19: acceso directo creado en el menú Inicio de Windows, apuntando a `abrir.bat` con `icono.ico`.
- 2026-11-19: cambios de esta evolución commiteados y pusheados a `main` (`dd3c588` y `84ac086`); `.env` está ignorado por git (`git check-ignore -v .env` → `.gitignore:4:.env`).
- 2026-11-19: metadatos de GitHub actualizados: descripción sin marca de proveedor y topics `espanol`, `prompt`, `inteligencia-artificial`, `proyecto-personal` y `productividad`.
- 2026-11-19: pendiente de que el usuario revise visualmente la interfaz; el agente generó capturas pero no pudo verlas (este modelo no admite entrada de imágenes).
- 2026-11-20: el usuario comunicó que "no le carga la nueva" y que a veces aparece el logo negro. El servidor local estaba sano (PID `31156`, `node servidor.js`, puerto 8000 con respuestas 200 y MIME correcto); la causa era caché antigua del service worker y del icono de Windows.
- 2026-11-20: corregido el origen: `app.js` desregistra service workers y borra cachés al abrir, `service-worker.js` pasa a `sinrodeos-v3` y se desregistra solo, `abrir.bat` abre con `?v=3`, y el acceso directo usa `icono-app.ico` para renovar la caché de iconos de Windows.
- 2026-11-20: verificación en Edge headless: fondo `rgb(15, 23, 42)`, texto `rgb(248, 250, 252)`, logo con `naturalWidth=1024` y `complete=true`, selector presente, `0` service workers y `[]` cachés. `npm test` → 13/13. Commit `b09220e` pusheado a `main`.
- 2026-11-20: Eliminada la referencia rota `images/interfaz.png` del README (ese archivo nunca se guardó: este modelo no puede ver ni guardar la captura del usuario) y borrada la copia sobrante `132dceff-....webp`.
- 2026-11-21: el servidor local se detuvo al cerrarse la terminal que lo ejecutaba (`exit 1073807364`, `ECONNREFUSED` en el puerto 8000). Se relanzó en segundo plano (PID `7060`) y se confirmó que `/`, `/app.js` y `/estilos.css` responden 200 con la versión corregida.

## 3. Tecnologías y arquitectura

- Interfaz: HTML + CSS + JavaScript (ES modules), sin frameworks ni dependencias.
- Servidor local: `servidor.js` con módulos nativos de Node (`http`, `fs`, `path`, `url`) y `fetch` para servir archivos y llamar a Gemini. Lee `.env` en cada petición, así que pegar la clave no exige reiniciar.
- IA: Gemini de Google. Modelo por defecto actual `gemini-3.8-flash`; se respeta `GEMINI_MODELO` en `.env`. El informe comparativo guardado no registra el modelo concreto de aquella ejecución.
- Seguridad de la clave: la clave vive solo en `.env` local; el navegador nunca la recibe. El texto del usuario **sí se envía a Gemini**.
- Presentación de escritorio: PWA con `manifest.webmanifest`, `service-worker.js`, iconos y `abrir.bat` que abre Edge/Chrome con `--app=` y arranca el servidor si hace falta. No se usa Electron.
- Pruebas: `node --test` (módulo nativo de Node).

| Archivo | Función |
| --- | --- |
| `index.html` | Interfaz (manifest, iconos y aviso de clave faltante) |
| `estilos.css` | Sistema visual (azul tinta sobre fondo frío, un único momento de movimiento) |
| `app.js` | Cableado de interfaz, estados, historial y limpieza de cachés al abrir |
| `logica/instrucciones.js` | Reglas fijas que recibe Gemini: no añadir, no quitar, no cambiar |
| `logica/gemini.js` | Llamada al servidor local y limpieza de la respuesta de Gemini |
| `logica/mejorador.js` | Verificación interna aproximada de conservación (no genera el prompt) |
| `logica/historial.js` | Historial local en `localStorage` |
| `servidor.js` | Servidor estático + lectura de `.env` + llamada a Gemini |
| `service-worker.js` | Limpiador temporal: borra cachés antiguas y se desregistra al activarse |
| `manifest.webmanifest` | App instalable en ventana propia |
| `abrir.bat` | Abre la ventana de app y arranca el servidor si no está en marcha |
| `scripts/generar-iconos.js` | Genera iconos SVG/PNG/ICO sin dependencias |
| `pruebas/mejorador.test.js` | Pruebas de conservación |
| `pruebas/respuesta.test.js` | Pruebas de limpieza y reglas de sistema |
| `README.md` | Documentación pública en español |
| `PRODUCT.md` | Definición del producto |

## 4. Instrucciones y restricciones

- **No cambiar nada de lo pedido**: no añadir, quitar ni reinterpretar requisitos del usuario; solo mejorar redacción y estructura.
- Todo en español, incluidos mensajes de interfaz, errores, documentación, metadatos de GitHub y commits.
- Declarar de forma visible que el proyecto se desarrolló con asistencia de IA.
- Voz pública: joven, cercana, directa y honesta, sin lenguaje de empresa. El contexto personal del usuario es solo referencia de tono, nunca dato publicado.
- Sin secretos en archivos `.md` ni en el repositorio. `.env` ignorado por git; `.env.example` es la plantilla sin clave.
- No decir que "todo se procesa en local": el texto sale a Gemini; el servidor usa la clave para autenticarse ante Google y nunca la entrega al navegador.
- Capa gratuita con límites: advertir que Google puede usar el contenido para mejorar productos; no pegar información sensible.
- El comportamiento real del código manda sobre esta memoria.
- Detalle en `instrucciones/INSTRUCCIONES_GENERALES.md`.

## 5. Funcionalidades implementadas

- Entrada de texto libre con contador de caracteres, ejemplo cargable y botón de limpieza.
- Salida siempre generada por Gemini, con presentación en Markdown, en español y sin envoltorios de código ni introducciones no pedidas.
- Reglas de sistema que prohíben añadir, quitar o cambiar contenido y conservan ambigüedades con una nota entre corchetes.
- Verificación interna aproximada de conservación: muestra `N/M ideas conservadas` como aviso suave, nunca bloquea ni sustituye el prompt de Gemini.
- Aviso visible en la interfaz cuando falta la clave, con instrucciones para editar `.env`; se vuelve a comprobar en cada petición sin reiniciar.
- Errores de la API traducidos a español y accionables (clave inválida, sin acceso, modelo no disponible, límite gratuito, problemas de red).
- Copia al portapapeles con alternativa para navegadores sin permiso.
- Historial de los últimos 10 prompts en `localStorage`, con restauración y borrado.
- Atajo `Ctrl/Cmd + Enter`, navegación por teclado, `aria-live` y respeto a `prefers-reduced-motion`.
- Ventana propia con icono en Windows mediante PWA + acceso directo en el menú Inicio.
- README y pie de interfaz con privacidad real y declaración de asistencia de IA.

## 6. Cambios realizados

- 2026-11-24: README reorganizado alrededor de problema, ejemplo, aportación e IA, funcionamiento, evidencias y puesta en marcha. Añadidos caso de estudio, procedencia de imágenes y extracto público de un único caso ficticio, cotejado con el registro real. `scripts/generar-imagenes-docs.ps1` recorta la captura y compone las dos variantes del ejemplo con System.Drawing, sin navegador ni IA generativa. Logo actual reutilizado con su atribución. Reglas de contexto actualizadas para el relato expresamente autorizado; no se publica otro contexto personal.

- 2026-11-22: variante `logo-ventana.png` generada con ImageGen; procedencia en `logo-ventana.png.json`. Generador extendido para `favicon-16-v4.png`, `favicon-32-v4.png` e `icono-ventana-v4.ico`. Referencias PNG con tamaños explícitos y alias `/favicon.ico`. `abrir.bat` cambia a `?v=4`; el mismo origen conserva historial y permisos. No se altera el logo dentro de la app.

- 2026-11-22: actualizada la instalación habitual, no solo la copia de trabajo. Se conservó la configuración privada y se reinició exclusivamente el servidor de Sin Rodeos identificado, con ejecución oculta y sin abrir navegador.

- 2026-11-22: publicados 43 archivos de implementación, recursos y documentación en `main`, sin forzar el remoto. Añadidos `DESIGN.md` y `.impeccable/design.json` a partir del código real, con evidencia estática y sin declarar aprobación visual.

- 2026-11-22: cierre de documentación para publicación: instalación y actualización de copias existentes, privacidad real, estilos actuales, pruebas y pendientes. Se mantiene la instrucción de no manejar ventanas sin petición expresa.

- 2026-11-22: reemplazado el logo a petición expresa. `scripts/generar-iconos.js` usa ahora `scripts/convertir-iconos.ps1` y System.Drawing de Windows para convertir `logo.png` sin abrir ventanas ni usar navegador. `logo.png.json` recoge procedencia y prompts. La cabecera usa la variante ligera de 192 px sin recorte ni deformación.

- 2026-11-22: corregida la deformación del logo de cabecera: un contenedor de 44 × 44 recorta el margen blanco, mientras la imagen conserva su relación de aspecto. Cambio local, sin tocar accesos directos ni ventanas.

- 2026-11-19: creado el sistema de memoria, `PRODUCT.md` y las instrucciones por tema.
- 2026-11-19: creada la primera versión de la aplicación (interfaz, lógica, servidor e intermediarios) con Ollama y modo sin IA.
- 2026-11-19: corregidas tres pruebas fallidas iniciales y tres hallazgos del detector de diseño.
- 2026-11-19: creado `README.md`, inicializado git y publicado en GitHub (commits `b102ef9`, `b9c5e3b`, `05f0e32`).
- 2026-11-19: reescrito el origen en el README con tono joven y cercano; añadida la sección "Asistencia de IA" y la nota en el pie de la interfaz.
- 2026-11-19: corregido el README a petición del usuario: su contexto personal era indicación de tono, no dato para publicar (commit `ea67812`).
- 2026-11-19: traducidos al español los encabezados de `PRODUCT.md` y los términos "proxy" y "fallback".
- 2026-11-19: **supérsedida** la arquitectura Ollama/local: el usuario pidió una API gratuita que funcione siempre sin encender IA local.
- 2026-11-19: creados `.env`, `.env.example` y reglas en `.gitignore` para no subir la clave.
- 2026-11-19: reescritos `servidor.js`, `logica/mejorador.js`, `logica/historial.js`, `index.html`, `app.js` y `estilos.css` para Gemini-only y avisos de configuración.
- 2026-11-19: creados `logica/instrucciones.js` y `logica/gemini.js`; eliminado `logica/ollama.js`.
- 2026-11-19: añadidos PWA, iconos generados sin dependencias, `abrir.bat` y acceso directo en el menú Inicio.
- 2026-11-19: reescritas las pruebas y actualizados `package.json` (v1.1.0), `README.md` y `PRODUCT.md`.
- 2026-11-19: integrado `logo.webp` como identidad en cabecera, favicon, PWA, iconos y acceso directo; eliminados los textos de marca de proveedor que quedaban en `index.html`, `PRODUCT.md` y `package.json`.
- 2026-11-19: añadidos cuatro estilos de prompt (Preciso, Directo, Analítico, Creativo) propagados por interfaz, servidor, instrucciones, historial y pruebas.
- 2026-11-19: reescrito `scripts/generar-iconos.js` para convertir `logo.webp` con Edge/Chrome headless sin dependencias; renovada la caché del service worker.
- 2026-11-20: desactivada la caché de la interfaz: `app.js` limpia registros y cachés al cargar, `service-worker.js` se convierte en limpiador v3 que se desregistra, `abrir.bat` abre con `?v=3` y el acceso directo usa `icono-app.ico`.
- 2026-11-20: quitada la referencia rota a `images/interfaz.png` en `README.md` y eliminada la copia duplicada `132dceff-c73e-4393-84f0-1723dfb84333.webp`.

## 7. Decisiones tomadas

- Stack sin dependencias para que la app funcione sin instalaciones complejas (2026-11-19).
- ~~IA local con Ollama como mejora opcional, nunca obligatoria (2026-11-19).~~ **Supérsedida el 2026-11-19**: el usuario no quiere arrancar IA local; se usa Gemini gratuito en la nube.
- ~~Modo sin IA siempre disponible (2026-11-19).~~ **Supérsedida el 2026-11-19**: modo único IA; la lógica estricta queda como verificación interna aproximada, nunca como prompt visible.
- Gemini gratuito como proveedor: el usuario pidió "alguna api gratis" y que esté siempre funcionando (2026-11-19).
- Clave en `.env` ignorado por git; el servidor la lee y el navegador nunca la recibe (2026-11-19).
- Formato de escritorio mediante PWA/acceso directo, sin Electron, para no añadir dependencias (2026-11-19).
- Se mantiene el servidor local porque es necesario para ocultar la clave API (2026-11-19).
- No configurar arranque automático con Windows: solo acceso directo en el menú Inicio, salvo petición expresa (2026-11-19).
- Nombre de producto: **Sin Rodeos** (2026-11-19).
- Cuatro estilos de prompt — Preciso, Directo, Analítico y Creativo — como única personalización visible; el modelo sigue fijo (2026-11-19).
- `logo.webp` es la única fuente de iconos; se convierte a PNG/ICO con el navegador del sistema para no añadir dependencias (2026-11-19).
- Indicador de progreso finito, no una animación en bucle, para evitar movimiento innecesario (2026-11-19).
- Declarar la asistencia de IA de forma visible y usar una voz cercana y real (2026-11-19).
- La interfaz no se guarda en caché: se sirve siempre desde el servidor local para que los cambios aparezcan al reabrir; la limpieza al abrir se mantiene para evitar recaídas (2026-11-20).
- Para renovar el icono de Windows se usa un nombre de archivo nuevo (`icono-app.ico`) porque Explorer cachea los iconos por ruta (2026-11-20).

## 8. Pruebas verificadas

- 2026-11-24, publicación y sincronización: `git ls-remote` confirmó `main` en `c2b90e6da5314fb1e3d5a72bde2ae97aedd4d5b0`. Lectura mediante GitHub de README y caso de estudio con blobs `21080ce1c38b4a0343003819f2da3cda94ae2848` y `452535b5ed2e589151bed9ba68e457c5979f4a4f`, iguales a los del commit local. Los cinco recursos de `docs/imagenes/` coinciden por SHA con GitHub. Instalación habitual actualizada con `git pull --ff-only origin main`, mismo commit y árbol limpio. Metadatos de configuración privada conservados sin leerla. Índice revisado: 14 archivos de documentación, recursos y generador; ninguna modificación de la aplicación ni credenciales detectables; PNG sin metadatos textuales.

- 2026-11-24: `npm test` → 31/31, 0 fallos, Node.js v24.21.0. Extracto de login cotejado literalmente con entrada y salida del registro del 2026-11-22 (11 pares completos). Archivos PNG generados e inspeccionados: interfaz 1445 × 642, comparativa 1280 × 864 y versión apilada 720 × 1260. Recorte exacto contrastado por hash con una nueva extracción de los píxeles originales tras los primeros 50 px. Validados 45 enlaces/rutas y anclas en los tres documentos públicos, textos alternativos, ejemplo literal y ausencia de rutas privadas o patrones de credenciales. Enlace de OmniRoute consultado mediante GitHub. No se ha hecho una revisión visual de la app en ejecución ni nuevas llamadas al proveedor.

- 2026-11-22, favicon: variantes de 16/32 px inspeccionadas como archivos, transparencia comprobada y sin píxeles negros visibles. ICO con dos tamaños 16 y 32. `npm run iconos` genera los recursos sin ventanas; `npm test` → 31/31, con rutas de favicon incluidas en la prueba de recursos públicos. La comprobación en la barra de título real sigue pendiente del usuario.

- 2026-11-22, instalación habitual: `npm test` → 31/31. Versión de package.json: 1.2.0. Configuración privada ignorada por git y metadatos sin cambios. Servicio en `127.0.0.1:8000`: `/` e `/icono-192.png` → 200; `/.env` → 404. Petición real ficticia de corregir login en React, sin añadir bibliotecas ni cambiar registro y entregando archivos completos → 200; salida conserva esos elementos. Esto no completa ni sustituye la comparación de doce casos ni la revisión visual pendiente.

- 2026-11-22, publicación: revisión de 43 archivos preparados sin rutas privadas ni patrones de credenciales. Push `14e7c1a..a7127ba` completado. GitHub devuelve `index.html` con SHA `94022418800e0fc9ccd95ba7e3bcedab1af65eda`, idéntico al archivo del commit local; incluye el nuevo icono y la vista previa. Referencia remota `main` verificada en `a7127ba19d1e5086364648799c3ec17cd23fa5bc`.

- 2026-11-22, cierre: `npm test` → 31/31, `git diff --check` sin errores. `git check-ignore -v .env .impeccable/review/comparacion-prompts.json` confirma la exclusión de la clave y del informe. `git fetch origin main` no encontró cambios remotos adicionales.

- 2026-11-22: nuevo logo verificado visualmente como archivo; variante de 192 px inspeccionada. `logo.png` 1254 × 1254, variantes 192 × 192 y 512 × 512, alfa de esquina 0 en las tres. Los dos ICO contienen 32, 48, 64 y 256 px. `npm run iconos` completado sin navegador; `npm test` → 31/31 después de integrar los recursos. No se manejaron ventanas.

- 2026-11-22: `npm test` tras ajustar la cabecera → 31 pruebas superadas, 0 fallos. No se ejecutó revisión visual en navegador. La revisión independiente de código detectó un problema de numeración/anidación en Markdown; corregido y su regresión verificada de forma independiente.

- 2026-11-19: `npm test` → 13 pruebas, 13 superadas, 0 fallos (incluye los cuatro estilos).
- 2026-11-19: detector de diseño (`impeccable detect --json index.html estilos.css app.js`) → `[]` (sin hallazgos). Se quitó el borde lateral del aviso que había marcado como patrón detectado.
- 2026-11-19: `curl` a `/`, `/manifest.webmanifest`, `/icono-512.png` y `/service-worker.js` → 200 con tipos MIME correctos.
- 2026-11-19: llamada directa a Gemini con `gemini-3.5-flash-lite` → estado 200 y prompt correcto.
- 2026-11-19: `POST /api/mejorar` con `estilo: "directo"` → estado 200 y prompt real de cinco líneas.
- 2026-11-19: endpoints `/`, `/logo.webp`, `/icono.ico`, `/icono-192.png`, manifest y service worker → 200 con MIME correcto.
- 2026-11-19: color promedio de `logo.webp` y `icono-512.png` idéntico `[248, 247, 254]` → el icono ya no es el cuadrado negro anterior.
- 2026-11-19: `git check-ignore -v .env` → `.gitignore:4:.env`; `.env` no aparece en `git status --short`.
- 2026-11-19: revisión del índice de git antes del commit: solo marcadores `TU_CLAVE_AQUI` / `tu_clave_aquí`, ninguna clave real.
- 2026-11-19: `git push origin main` → `ea67812..84ac086`; `git status --short` final → limpio.
- 2026-11-20: endpoints `/`, `/estilos.css`, `/index.html`, `/logo.webp`, `/icono.ico` y `/service-worker.js` → 200 con MIME correcto; servidor con PID `31156` ejecutando `node servidor.js`.
- 2026-11-20: Edge headless sobre `http://127.0.0.1:8000/?v=3`: fondo `rgb(15, 23, 42)`, texto `rgb(248, 250, 252)`, logo `naturalWidth=1024` y `complete=true`, selector `true`, registros de service worker `0`, cachés `[]`.
- 2026-11-20: `npm test` → 13/13 en verde tras la limpieza de cachés; `git push` → `1bd5b60..b09220e`.
- 2026-11-21: tras reiniciar el servidor en segundo plano, `/` contiene `selectorEstilo`, `/app.js` contiene `getRegistrations` y `/estilos.css` contiene `#0f172a`; los tres devuelven 200.
- 2026-11-19: metadatos verificados tras editarlos con `gh repo view`: descripción y topics correctos.

## 9. Errores y problemas pendientes

- 2026-11-24: corregidas durante la revisión documental una referencia inicial al nombre inexistente `vista-previa.js` (el archivo real es `logica/vista.js`) y descripciones antiguas del modelo por defecto y módulos del servidor en esta memoria. No se modifica el código. Siguen pendientes la evaluación semántica del conjunto y la revisión visual completa de la app; las nuevas imágenes no las sustituyen.

- **Corrección preparada; confirmación visual pendiente**: icono pequeño oscuro en la barra de título pese al logo de cabecera correcto. Se separan el favicon transparente y el icono con baldosa de la app y se versionan los recursos y la URL de arranque. No afirmar que se ha visto corregido en Windows hasta recibir confirmación del usuario.

- **Supérsedido por rediseño expreso**: el mero reencuadre del logo anterior no satisfizo al usuario. Sustituido el dibujo por un logo S/flecha; se conserva el recurso anterior y la nueva fuente se identifica explícitamente.

- **Corregido en código, pendiente de revisión visual**: `logo.webp` tiene mucho espacio blanco y se forzaba a 40 × 40 pese a no ser cuadrado; el símbolo quedaba pequeño y deformado. Se conserva el dibujo y se corrige su encuadre con CSS.
- **Pendientes de verificación del plan de 2026-11-22**: comprobación visual, revisión de los resultados reales de comparación y completar la comparación número 12. Implementación, documentación y publicación cerradas; no marcar las verificaciones pendientes como terminadas.

- **Resuelto**: `ReferenceError: text is not defined` en `servidor.js` (se pasaba `parts: [{ text }]` donde debía ser `texto`). La llamada directa a Gemini funcionaba y solo fallaba el endpoint; se corrigió a `parts: [{ text: texto }]` y se eliminó el debug temporal.
- **Resuelto**: el primer arranque del servidor nuevo decía "Falta la clave" porque se inició antes de que el usuario pegara la clave; al reiniciarlo detectó la clave correctamente. La lectura por petición evita futuros reinicios.
- **Resuelto**: una prueba de conservación fallaba con sinónimos (3/4); se bajó el umbral de coincidencia de 0,6 a 0,5 y quedó en 11/11.
- **Resuelto**: el detector de diseño marcó `border-left: 4px solid #d97706` en `.aviso`; se sustituyó por borde completo más suave.
- **Resuelto**: `Invoke-RestMethod` de PowerShell y `curl` con JSON escapado daban 500/400 por codificación del cuerpo; la verificación con `fetch` de Node confirmó el endpoint real.
- **Resuelto**: `gh repo edit` no admite `--delete-topic`; el flag correcto es `--remove-topic`. Metadatos corregidos y verificados.
- **Resuelto**: los prompts salían casi literales y poco profesionales; se cambió el sistema a "experto en Ingeniería de Prompts" con reformulación obligatoria y estructura profesional.
- **Resuelto**: el icono visible era el antiguo cuadrado negro generado por código; ahora todos los iconos salen de `logo.webp`.
- **Resuelto**: quedaron menciones al proveedor en textos públicos (`index.html`, `PRODUCT.md`, `package.json`); neutralizadas.
- **Resuelto**: el usuario veía la interfaz antigua o el logo negro al abrir. No era el servidor: era caché del service worker v2 e icono cacheado por Windows. Limpieza al abrir + `?v=3` + `icono-app.ico`; verificado con 0 service workers y 0 cachés en navegador real. Queda confirmación visual del usuario tras reabrir.
- **Resuelto**: `README.md` referenciaba `images/interfaz.png`, un archivo que no existe porque este modelo no puede guardar la captura enviada. Se quitó la referencia en lugar de inventar una imagen.
- **Resuelto**: el servidor dejó de escuchar al cerrarse la terminal que lo lanzó; la app daba `ECONNREFUSED` y parecía "no cargar". Relanzado en segundo plano y verificado. Si vuelve a pasar, basta con abrir `abrir.bat` o ejecutar `npm start`.
- Capturas de escritorio y móvil generadas en la carpeta temporal de OpenCode, pero no inspeccionadas visualmente por el agente. El usuario envió una captura por chat, pero este modelo no admite entrada de imágenes; no se publicó ninguna imagen inventada.

## 10. Próximos pasos

1. Pendiente: revisión visual real en escritorio y móvil. No usar Computer Use ni controlar ventanas sin petición expresa.
2. Pendiente: revisar cualitativamente el informe de comparación real y completar el par 12. No afirmar mejoras medidas sin evaluación.
3. La instalación habitual ya se actualizó por petición de continuar. En futuras actualizaciones, mantener el avance directo y la configuración privada; reiniciar solo el servidor identificado. No modificar accesos directos ni controlar ventanas sin petición expresa.

## 11. Historial de actualizaciones

- 2026-11-24 — Presentación pública publicada y sincronizada (`c2b90e6`), con historia autorizada, contribución real, usos de IA diferenciados, captura real y muestra de respuesta. 31/31 pruebas, 45 enlaces/rutas y anclas y contenido remoto verificados. Sin manejar ventanas ni reiniciar el servidor.

- 2026-11-22 — Corrección del icono de título: favicon transparente de 16/32 px, referencias y arranque v4, con el logo interior conservado. 31/31 pruebas; sin controlar ventanas.

- 2026-11-22 — Instalación habitual actualizada a 1.2.0; servidor reiniciado sin ventanas, 31/31 pruebas y generación real ficticia verificadas. Configuración privada conservada.

- 2026-11-22 — Versión 1.2.0 y nuevo logo publicados en `main` (`a7127ba`), con commit en español, sin claves ni informes privados. Referencia y contenido de GitHub comprobados; 31/31 pruebas. Se registran por separado las verificaciones visual y comparativa aún pendientes.

- 2026-11-22 — Preparación del commit y publicación autorizada en `main`, con documentación de versión 1.2.0, 31 pruebas y pendientes explícitos. Sin manejo de ventanas.

- 2026-11-22 — Nuevo logo generado e integrado a petición expresa, iconos coherentes y conversión por archivos sin navegador. 31/31 pruebas; pendiente publicar la implementación general y cerrar su revisión visual.

- 2026-11-22 — Implementación local del plan; interrupción del control de pantalla tras objeción del usuario y posterior corrección del encuadre del logo. 31/31 pruebas; sin publicar cambios.

- 2026-11-19 — Inicialización del proyecto, memoria y producto.
- 2026-11-19 — Aplicación completa, pruebas en verde, documentación y publicación en GitHub.
- 2026-11-19 — Ajuste de contenido: todo en español, historia personal y declaración de asistencia de IA.
- 2026-11-19 — Evolución a Gemini gratuito, modo solo IA, app de escritorio, clave en `.env` y verificación real del endpoint.
- 2026-11-19 — Integración de logo propio, eliminación de marcas de proveedor (Gemini/Google) en textos públicos, limpieza de metadatos de GitHub y consolidación del proyecto "puto profesional". 11/11 pruebas superadas. Repo limpio. Estado: estable.
- 2026-11-19 — Cuatro estilos de prompt, iconos regenerados desde `logo.webp`, textos públicos neutralizados y 13/13 pruebas en verde.
- 2026-11-20 — Revisión local a petición del usuario: diagnóstico de caché antigua, limpieza automática al abrir, icono renovado, README sin imagen rota y 13/13 pruebas en verde. Commit `b09220e` pusheado.
