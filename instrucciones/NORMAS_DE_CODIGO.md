# Normas de código

- JavaScript usando ES modules (`type="module"`), sin transpilación.
- Cero dependencias: solo APIs del navegador y módulos nativos de Node.
- Nombres de funciones y variables en español, claros y descriptivos.
- Comentarios en español, solo cuando expliquen el porqué.
- La lógica de negocio en `logica/` debe ser pura: mismo entrada, misma salida, sin tocar el DOM.
- La interfaz no contiene reglas de negocio: delega en `logica/`.
- mensajes de error en español y accionables (qué pasó y qué hacer).
- No usar `innerHTML` con texto del usuario; usar `textContent` para evitar inyección.
- Formato de archivos: 2 espacios, punto y coma, comillas dobles en JavaScript.
