# Memoria del proyecto

Archivo de memoria persistente de OpenCode. Actualízalo tras cada avance importante.
Regla: NO guardar aquí contraseñas, tokens ni ningún secreto.

## 1. Objetivo y alcance

**Sin Rodeos** es una aplicación local que convierte un texto en bruto escrito por el usuario (en español, con errores, desordenado o mal explicado) en un prompt claro y profesional **sin cambiar nada de lo pedido**: conserva todo el contenido, corrige solo la forma y lo estructura para que una IA lo entienda a la primera.

Usuario: qirris. Idioma de producto, interfaz, documentación y commits: **español**. Repositorio público: <https://github.com/qirris/SinRodeos>.

## 2. Estado actual

- 2026-11-19: aplicación terminada y funcionando en local.
- 2026-11-19: pruebas automáticas en verde (7/7) y detector de diseño sin hallazgos.
- 2026-11-19: repositorio creado y publicado en GitHub con tres commits iniciales.
- 2026-11-19: pendiente de que el usuario revise visualmente la interfaz; el agente generó capturas pero no pudo verlas (este modelo no admite entrada de imágenes).

## 3. Tecnologías y arquitectura

- Interfaz: HTML + CSS + JavaScript (ES modules), sin frameworks ni dependencias.
- Servidor local: `servidor.js` con módulos nativos de Node (`http`, `fs`, `path`) para servir archivos y hacer de intermediario hacia Ollama (`127.0.0.1:11434`).
- IA opcional: Ollama local con `qwen3:8b`. Modo sin IA siempre disponible.
- Pruebas: `node --test` (módulo nativo de Node).

| Archivo | Función |
| --- | --- |
| `index.html` | Interfaz de la aplicación |
| `estilos.css` | Sistema visual (azul tinta sobre fondo frío, un único momento de movimiento) |
| `app.js` | Cableado de interfaz, eventos, accesibilidad y estados |
| `logica/mejorador.js` | Reglas del modo estricto: dividir, clasificar, construir y verificar conservación |
| `logica/ollama.js` | Descubrimiento de modelos y generación con Ollama, con alternativa directa directo |
| `logica/historial.js` | Historial local en `localStorage` |
| `servidor.js` | Servidor estático + intermediario de Ollama |
| `pruebas/mejorador.test.js` | Pruebas unitarias de la lógica pura |
| `README.md` | Documentación pública en español |
| `PRODUCT.md` | Definición de producto |

## 4. Instrucciones y restricciones

- **No cambiar nada de lo pedido**: no añadir, quitar ni reinterpretar requisitos del usuario; solo mejorar redacción y estructura.
- Todo en español, incluidos mensajes de interfaz, errores, documentación, metadatos de GitHub y commits.
- Declarar de forma visible que el proyecto se desarrolló con asistencia de IA.
- Voz pública: joven, cercana, directa y honesta, sin lenguaje de empresa. El contexto personal del usuario es solo referencia de tono, nunca dato publicado.
- Sin secretos en archivos `.md` ni en el repositorio.
- El comportamiento real del código manda sobre esta memoria.
- Detalle en `instrucciones/INSTRUCCIONES_GENERALES.md`.

## 5. Funcionalidades implementadas

- Entrada de texto libre con contador de caracteres, ejemplo cargable y botón de limpieza.
- Modo estricto sin IA: separa ideas, las clasifica en Contexto / Restricciones / Entrega esperada / Objetivo y genera un prompt estructurado.
- Verificación real de conservación: comprueba que cada idea del texto original aparece en el prompt generado y muestra `N/N ideas conservadas`.
- Modo con IA local: detecta modelos de Ollama, usa `qwen3:8b` por defecto y aplica un prompt de sistema que prohíbe añadir, quitar o cambiar contenido.
- Aviso claro cuando Ollama está apagado; la app sigue funcionando en modo estricto.
- Opción para incluir o no las reglas de precisión.
- Copia al portapapeles con alternativa para navegadores sin permiso.
- Historial de los últimos 10 prompts en `localStorage`, con restauración y borrado.
- Atajo `Ctrl/Cmd + Enter`, navegación por teclado, `aria-live` y respeto a `prefers-reduced-motion`.
- README en español con el origen del proyecto contado en primera persona y la declaración de asistencia de IA; pie de la interfaz con la misma declaración.

## 6. Cambios realizados

- 2026-11-19: creado el sistema de memoria, `PRODUCT.md` y las instrucciones por tema.
- 2026-11-19: creada la aplicación (interfaz, lógica, servidor e intermediarios).
- 2026-11-19: corregidas tres pruebas fallidas: normalización de espacios alrededor de saltos de línea, clasificación de "aplicación" como objetivo y reglas añadidas con texto vacío.
- 2026-11-19: refinado el clasificador para no confundir descripciones de problema con restricciones.
- 2026-11-19: corregidos hallazgos del detector de diseño: contraste del botón principal, texto inferior a 11 px en móvil y animación infinita eliminada.
- 2026-11-19: creado `README.md`, inicializado git y publicado en GitHub (commits `b102ef9`, `b9c5e3b`, `05f0e32`).
- 2026-11-19: reescrito el origen del proyecto en el README con tono joven y cercano; añadida la sección "Asistencia de IA" y la misma nota en el pie de la interfaz.
- 2026-11-19: corregido el README a petición del usuario: su contexto personal era una indicación de tono, no texto para publicar. Se eliminaron los datos personales del README y del resto de archivos del repo.
- 2026-11-19: traducidos al español los encabezados de `PRODUCT.md` y los términos "proxy" y "fallback" en documentación y memoria.

## 7. Decisiones tomadas

- Stack sin dependencias para que la app funcione en el ordenador del usuario sin instalaciones complejas (2026-11-19).
- IA local con Ollama como mejora opcional, nunca como dependencia obligatoria (2026-11-19).
- Nombre de producto: **Sin Rodeos** (2026-11-19).
- El modo estricto verifica la conservación de ideas; el modo IA pide revisión al usuario porque una IA no puede garantizarla por sí sola (2026-11-19).
- El indicador de progreso es finito, no una animación en bucle, para evitar movimiento innecesario (2026-11-19).
- Declarar la asistencia de IA de forma visible y usar una voz cercana y real, porque el usuario quiere que su GitHub muestre a una persona proactiva y honesta (2026-11-19).

## 8. Pruebas verificadas

- 2026-11-19: `npm test` → 7 pruebas, 7 superadas, 0 fallos.
- 2026-11-19: `curl` al servidor local → `/` y `/app.js` devuelven 200 con el tipo MIME correcto.
- 2026-11-19: `curl` a `/api/ollama/api/tags` con Ollama apagado → 502 con mensaje accionable en español.
- 2026-11-19: con `ollama serve` en marcha, `/api/ollama/api/tags` → 200 listando `qwen3:8b`.
- 2026-11-19: generación real vía `/api/ollama/api/generate` → respuesta correcta del modelo.
- 2026-11-19: detector de diseño (`impeccable detect --json index.html estilos.css app.js`) → `[]` (sin hallazgos).
- 2026-11-19: `gh repo create ... --push` → repositorio creado en <https://github.com/qirris/SinRodeos> y rama `main` publicada.

## 9. Errores y problemas pendientes

- Resueltos: los tres fallos iniciales de pruebas y los tres hallazgos del detector (detallados en la sección 6).
- `ollama serve` debe iniciarse manualmente cuando se quiera usar el modo IA; es un comportamiento previsto y se comunica en la interfaz.
- Capturas de escritorio y móvil generadas en la carpeta temporal de OpenCode, pero no inspeccionadas visualmente por el agente (este modelo no admite imágenes). Revisión visual pendiente por parte del usuario.
- La alternativa directa a `http://127.0.0.1:11434` no funciona si la app se sirve por HTTPS (por ejemplo, GitHub Pages): en ese caso solo está disponible el modo estricto.

## 10. Próximos pasos

1. Que el usuario abra <http://localhost:8000> y confirme que la interfaz le resulta cómoda.
2. Si quiere, ajustar colores o textos tras esa revisión visual.
3. Opcional: añadir un ejecutable `.bat` para iniciar la app con doble clic en Windows.
4. Opcional: publicar en GitHub Pages (solo modo estricto por HTTPS).

## 11. Historial de actualizaciones

- 2026-11-19 — Inicialización del proyecto, memoria y producto.
- 2026-11-19 — Aplicación completa, pruebas en verde, documentación y publicación en GitHub.
- 2026-11-19 — Ajuste de contenido: todo en español, historia personal y declaración de asistencia de IA.
