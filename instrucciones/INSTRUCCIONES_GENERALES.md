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
- Sin secretos en archivos del proyecto.
- Preferir soluciones sin dependencias y que funcionen en local.
- **Todo el repo en español**: interfaz, documentación, nombres, descripciones y metadatos de GitHub, comentarios y mensajes de commits. Las palabras técnicas aceptadas en español (prompt, README, commit) están bien; el resto se traduce.
- **Declarar siempre la asistencia de IA**: el README y la interfaz deben decir de forma visible que el proyecto se desarrolló con asistencia de IA, sin ocultarla ni exagerarla.
- **Voz pública**: escribir como una persona de 19 años de 2º de DA que construye proyectos y los sube a GitHub para que se vea lo que hace: directa, honesta, sin lenguaje de empresa ni humo.

## Convención de archivos

- `memoria.md`: estado vivo, 11 secciones.
- `AGENTS.md`: punto de entrada breve.
- `instrucciones/`: reglas permanentes por tema.
- No duplicar el sistema de memoria ni tocar el de otros proyectos.
