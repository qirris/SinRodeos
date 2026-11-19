# Tareas pendientes

## Completadas

- [x] Implementar `index.html`, `estilos.css` y `app.js`.
- [x] Crear sistema de memoria, `PRODUCT.md`, `README.md` e instrucciones por tema.
- [x] Inicializar git y publicar en GitHub (último commit conocido antes de la evolución: `ea67812`).
- [x] Declarar la asistencia de IA en README, interfaz y documentación; sin datos personales publicados.
- [x]Traducir al español los últimos textos técnicos del repo.
- [x] Crear `.env` y `.env.example`; añadir reglas a `.gitignore` para no subir la clave.
- [x] Reescribir el servidor para Gemini: lectura de `.env`, endpoint `/api/mejorar` y errores en español.
- [x] Crear `logica/instrucciones.js` y `logica/gemini.js`; eliminar `logica/ollama.js`.
- [x] Reescribir interfaz y lógica para modo único IA, avisos de configuración y verificación interna.
- [x] Añadir PWA, iconos generados sin dependencias y `abrir.bat`.
- [x] Crear acceso directo **Sin Rodeos** en el menú Inicio de Windows.
- [x] Reescribir pruebas: 11/11 en verde; detector de diseño → `[]`.
- [x] Verificar endpoints y llamada real a Gemini: `POST /api/mejorar` → 200 con prompt generado.
- [x] Actualizar `package.json` a v1.1.0, `README.md` y `PRODUCT.md`.
- [x] Actualizar `memoria.md`, `AGENTS.md` y las instrucciones internas al estado Gemini-only.

## Pendientes

- [x] Revisar metadatos de GitHub (descripción y topics): quitar `gemini`, `pwa`, añadir `productividad`.
- [x] Ejecutar el plan de pulido: logo, neutralización de textos, metadatos y verificación.
- [x] Commit en español y `git push`.
- [x] Integrar cuatro estilos de prompt y selector en la interfaz.
- [x] Regenerar todos los iconos desde `logo.webp` y renovar la caché del service worker.
- [x] Neutralizar los textos de marca que quedaban en `index.html`, `PRODUCT.md` y `package.json`.
- [x] Verificar endpoint con estilo, MIME de iconos, color del logo y 13/13 pruebas.
- [ ] Confirmar con el usuario que la app abre correctamente desde el menú Inicio y que el icono es el suyo.

## Bajo petición del usuario

- [ ] Ajustes de estilo o textos tras la revisión visual.
- [ ] Arranque automático con Windows (no hacerlo sin permiso).

## No repetir

- No pedir al usuario que elija stack de nuevo: ya delegó la decisión.
- No reintroducir Ollama ni modo sin IA: quedaron supérsedidos.
- No añadir dependencias externas sin autorización explícita.
- No abrir ni mostrar la clave de `.env`; no guardar secretos en archivos `.md`.
- No publicar capturas, métricas ni testimonios inventados.
- No reiniciar el sistema de memoria: solo mantenerlo.
