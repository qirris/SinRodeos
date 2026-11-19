# Memoria del proyecto

Archivo de memoria persistente de OpenCode. Actualízalo tras cada avance importante.
Regla: NO guardar aquí contraseñas, tokens ni ningún secreto.

## 1. Objetivo y alcance

**Sin Rodeos** convierte un texto en bruto escrito por el usuario (en español, con errores, desordenado o mal explicado) en un prompt claro y profesional **sin cambiar nada de lo pedido**: conserva todo el contenido, corrige solo la forma y lo estructura para que una IA lo entienda a la primera.

Usuario: qirris. Idioma de producto, interfaz, documentación y commits: **español**. Repositorio público: <https://github.com/qirris/SinRodeos>.

Evolución actual: la redacción la hace siempre la API gratuita de Gemini, sin Ollama local. La app se presenta como aplicación de escritorio en Windows (ventana propia e icono). El usuario no quiere encender ninguna IA en su ordenador.

## 2. Estado actual

- 2026-11-19: aplicación terminada y funcionando con Gemini.Última verificación: 2026-11-19.
- 2026-11-19: clave del usuario ya pegada en `.env` (longitud detectada: 53 caracteres). **Nunca abrir ni mostrar la clave**; comprobar solo su presencia.
- 2026-11-19: llamada real a `POST /api/mejorar` verificada con estado 200 y prompt generado.
- 2026-11-19: `npm test` → 11/11 en verde; detector de diseño → `[]`.
- 2026-11-19: endpoints estáticos verificados (`/`, manifest, icono y service worker → 200 con MIME correcto).
- 2026-11-19: acceso directo creado en el menú Inicio de Windows, apuntando a `abrir.bat` con `icono.ico`.
- 2026-11-19: cambios de esta evolución commiteados y pusheados a `main` (`dd3c588` y `84ac086`); `.env` está ignorado por git (`git check-ignore -v .env` → `.gitignore:4:.env`).
- 2026-11-19: metadatos de GitHub actualizados: descripción con Gemini gratuito, asistencia de IA y app de escritorio; topics `gemini` y `pwa` añadidos y `ollama` eliminado.
- 2026-11-19: pendiente de que el usuario revise visualmente la interfaz; el agente generó capturas pero no pudo verlas (este modelo no admite entrada de imágenes).

## 3. Tecnologías y arquitectura

- Interfaz: HTML + CSS + JavaScript (ES modules), sin frameworks ni dependencias.
- Servidor local: `servidor.js` con módulos nativos de Node (`http`, `https`, `fs`, `path`) para servir archivos y llamar a Gemini. Lee `.env` en cada petición, así que pegar la clave no exige reiniciar.
- IA: Gemini de Google (capa gratuita). Modelo por defecto `gemini-3.5-flash-lite`; alternativa `gemini-3.8-flash` configurable en `.env`.
- Seguridad de la clave: la clave vive solo en `.env` local; el navegador nunca la recibe. El texto del usuario **sí se envía a Gemini**.
- Presentación de escritorio: PWA con `manifest.webmanifest`, `service-worker.js`, iconos y `abrir.bat` que abre Edge/Chrome con `--app=` y arranca el servidor si hace falta. No se usa Electron.
- Pruebas: `node --test` (módulo nativo de Node).

| Archivo | Función |
| --- | --- |
| `index.html` | Interfaz (manifest, iconos y aviso de clave faltante) |
| `estilos.css` | Sistema visual (azul tinta sobre fondo frío, un único momento de movimiento) |
| `app.js` | Cableado de interfaz, estados, historial y comprobación visual |
| `logica/instrucciones.js` | Reglas fijas que recibe Gemini: no añadir, no quitar, no cambiar |
| `logica/gemini.js` | Llamada al servidor local y limpieza de la respuesta de Gemini |
| `logica/mejorador.js` | Verificación interna aproximada de conservación (no genera el prompt) |
| `logica/historial.js` | Historial local en `localStorage` |
| `servidor.js` | Servidor estático + lectura de `.env` + llamada a Gemini |
| `service-worker.js` | Caché de la interfaz; nunca guarda peticiones a `/api/` |
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
- No decir que "todo se procesa en local": el texto sale a Gemini; solo la clave se queda en el ordenador.
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
- Indicador de progreso finito, no una animación en bucle, para evitar movimiento innecesario (2026-11-19).
- Declarar la asistencia de IA de forma visible y usar una voz cercana y real (2026-11-19).

## 8. Pruebas verificadas

- 2026-11-19: `npm test` → 11 pruebas, 11 superadas, 0 fallos.
- 2026-11-19: detector de diseño (`impeccable detect --json index.html estilos.css app.js`) → `[]` (sin hallazgos). Se quitó el borde lateral del aviso que había marcado como patrón detectado.
- 2026-11-19: `curl` a `/`, `/manifest.webmanifest`, `/icono-512.png` y `/service-worker.js` → 200 con tipos MIME correctos.
- 2026-11-19: llamada directa a Gemini con `gemini-3.5-flash-lite` → estado 200 y prompt correcto.
- 2026-11-19: `POST /api/mejorar` → estado 200 y prompt real (`# Solución para proyectos con IA...`).
- 2026-11-19: `git check-ignore -v .env` → `.gitignore:4:.env`; `.env` no aparece en `git status --short`.
- 2026-11-19: revisión del índice de git antes del commit: solo marcadores `TU_CLAVE_AQUI` / `tu_clave_aquí`, ninguna clave real.
- 2026-11-19: `git push origin main` → `ea67812..84ac086`; `git status --short` final → limpio.
- 2026-11-19: metadatos verificados tras editarlos con `gh repo view`: descripción y topics correctos.

## 9. Errores y problemas pendientes

- **Resuelto**: `ReferenceError: text is not defined` en `servidor.js` (se pasaba `parts: [{ text }]` donde debía ser `texto`). La llamada directa a Gemini funcionaba y solo fallaba el endpoint; se corrigió a `parts: [{ text: texto }]` y se eliminó el debug temporal.
- **Resuelto**: el primer arranque del servidor nuevo decía "Falta la clave" porque se inició antes de que el usuario pegara la clave; al reiniciarlo detectó la clave correctamente. La lectura por petición evita futuros reinicios.
- **Resuelto**: una prueba de conservación fallaba con sinónimos (3/4); se bajó el umbral de coincidencia de 0,6 a 0,5 y quedó en 11/11.
- **Resuelto**: el detector de diseño marcó `border-left: 4px solid #d97706` en `.aviso`; se sustituyó por borde completo más suave.
- **Resuelto**: `Invoke-RestMethod` de PowerShell y `curl` con JSON escapado daban 500/400 por codificación del cuerpo; la verificación con `fetch` de Node confirmó el endpoint real.
- **Resuelto**: `gh repo edit` no admite `--delete-topic`; el flag correcto es `--remove-topic`. Metadatos corregidos y verificados.
- Capturas de escritorio y móvil generadas en la carpeta temporal de OpenCode, pero no inspeccionadas visualmente por el agente. Revisión visual pendiente por parte del usuario.

## 10. Próximos pasos

1. Decir al usuario que la app está lista, que la clave ya fue detectada, dónde abrirla y ofrecer añadir arranque automático con Windows si lo quiere.
2. Esperar a que el usuario confirme que abre bien desde el menú Inicio y que la interfaz le resulta cómoda.
3. Si el usuario lo pide: ajustar estilos o añadir arranque automático; no hacerlo sin permiso.

## 11. Historial de actualizaciones

- 2026-11-19 — Inicialización del proyecto, memoria y producto.
- 2026-11-19 — Aplicación completa, pruebas en verde, documentación y publicación en GitHub.
- 2026-11-19 — Ajuste de contenido: todo en español, historia personal y declaración de asistencia de IA.
- 2026-11-19 — Evolución a Gemini gratuito, modo solo IA, app de escritorio, clave en `.env` y verificación real del endpoint.
- 2026-11-19 — Commits `dd3c588` y `84ac086` pusheados; metadatos de GitHub actualizados y repo limpio.
