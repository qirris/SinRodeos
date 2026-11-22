# Instrucciones generales

## Al empezar una sesión

1. Leer `memoria.md` y este archivo.
2. Leer el documento de `instrucciones/` relacionado con la tarea.
3. Contrastar con el código real antes de suponer nada.
4. Si el usuario da una instrucción permanente nueva, guardarla en el archivo correspondiente de `instrucciones/` en el momento.

## Al terminar una sesión

1. Ejecutar las pruebas que apliquen (`npm test`) y cualquier comprobación manual necesaria.
2. Actualizar `memoria.md`: secciones 2 (estado), 6 (cambios), 8 (pruebas), 9 (errores), 10 (próximos pasos) y 11 (historial).
3. Actualizar `instrucciones/TAREAS_PENDIENTES.md`.
4. No dar por terminado nada sin verificación.

## Reglas permanentes del usuario

- Todo en español: interfaz, documentación, mensajes, commits y respuestas.
- El propósito del producto es mejorar la forma sin tocar el fondo: **no añadir, no quitar, no cambiar** lo que el usuario pidió.
- El repositorio debe estar en el GitHub de `qirris`, con commits significativos y un README cuidado.
- Sin secretos en archivos del proyecto: la clave va en `.env`, ignorado por git; no abrirla ni mostrarla.
- Preferir soluciones sin dependencias. Se mantiene el servidor local solo porque oculta la clave API.
- La IA debe funcionar siempre sin que el usuario encienda nada en su ordenador: se usa Gemini gratuito, no Ollama.
- Interfaz con aspecto de aplicación de escritorio: ventana propia e icono, sin Electron.
- **Todo el repo en español**: interfaz, documentación, nombres, descripciones y metadatos de GitHub, comentarios y mensajes de commits. Las palabras técnicas aceptadas en español (prompt, README, commit) están bien; el resto se traduce.
- **Declarar siempre la asistencia de IA**: el README y la interfaz deben decir de forma visible que el proyecto se desarrolló con asistencia de IA, sin ocultarla ni exagerarla.
- **Voz pública**: joven, cercana, directa y honesta, sin lenguaje de empresa ni humo. El contexto personal del usuario sirve solo como referencia para el tono: **no se publica como dato**.
- Ser honesto con la privacidad: el texto se envía a Gemini; solo el servidor usa la clave para autenticarse ante Google y nunca la entrega al navegador; la capa gratuita tiene límites.
- No controlar ventanas ni usar Computer Use sin petición expresa: el usuario objetó a la interrupción de Chrome el 2026-11-22. Trabajar desde archivos y terminal.
- Cerrar los cambios autorizados con commit y publicación en `main`, como en el flujo habitual del proyecto; verificar GitHub antes de afirmar que están publicados. No dejarlos solo en otra copia local.

## Convención de archivos

- `memoria.md`: estado vivo, 11 secciones.
- `AGENTS.md`: punto de entrada breve.
- `instrucciones/`: reglas permanentes por tema.
- No duplicar el sistema de memoria ni tocar el de otros proyectos.
