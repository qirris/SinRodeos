# Seguridad

- No guardar secretos, tokens ni credenciales en el repositorio ni en la memoria del proyecto.
- La clave de Gemini vive únicamente en `.env`, ignorado por git. `.env.example` es una plantilla sin valor real. **No abrir ni mostrar `.env`**: comprobar solo si la clave está presente, sin imprimirla.
- `servidor.js` lee `.env` en cada petición y es el único que usa la clave; el navegador nunca la recibe.
- El texto del usuario **se envía a Gemini (Google)** para que lo reescriba. No afirmar que el procesamiento es local. Solo la clave se queda en el ordenador.
- La capa gratuita tiene límites de uso y Google indica que puede usar el contenido para mejorar sus productos: no pegar información sensible y advertirlo en la documentación.
- Errores de la API traducidos a español sin filtrar la clave ni detalles internos.
- El contenido del usuario se inserta en el DOM con `textContent`, nunca con `innerHTML`.
- El historial se guarda únicamente en `localStorage` del navegador del usuario; se puede borrar desde la interfaz.
- El service worker nunca guarda peticiones a `/api/`.
- No se recopilan datos ni se usan analíticas externas.
