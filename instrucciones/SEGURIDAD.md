# Seguridad

- No guardar secretos, tokens ni credenciales en el repositorio ni en la memoria del proyecto.
- El texto del usuario se procesa en local. Ollama se conecta solo a `127.0.0.1:11434`.
- El proxy de `servidor.js` solo acepta rutas bajo `/api/ollama/` y las reenvía a Ollama en local; no expone otros puertos ni servicios.
- El contenido del usuario se inserta en el DOM con `textContent`, nunca con `innerHTML`.
- El historial se guarda únicamente en `localStorage` del navegador del usuario; se puede borrar desde la interfaz.
- No se recopilan datos ni se usan analíticas externas.
