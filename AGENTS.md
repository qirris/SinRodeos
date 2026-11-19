# AGENTS.md — Sin Rodeos

Punto de entrada del proyecto. Aplicación que convierte texto en bruto en prompts claros en español sin alterar lo pedido. La redacción la hace Gemini (API gratuita) y se presenta como app de escritorio en Windows.

## Orden de lectura obligatoria

1. `memoria.md` (estado real del proyecto).
2. `instrucciones/INSTRUCCIONES_GENERALES.md`.
3. El documento de `instrucciones/` que corresponda a la tarea (`ARQUITECTURA.md`, `NORMAS_DE_CODIGO.md`, `SEGURIDAD.md`, `PRUEBAS.md`, `DECISIONES.md`, `TAREAS_PENDIENTES.md`).
4. Contrasta siempre con el código real: si la memoria difiere, corrige la memoria.

## Reglas duras

- **No cambiar nada de lo que el usuario pidió**: conservar contenido, añadir solo estructura y corrección de forma.
- Todo en español (interfaz, documentación, mensajes y commits).
- No guardar secretos, tokens ni contraseñas en ningún archivo `.md`. La clave vive en `.env`, ignorado por git: no abrirla ni mostrarla.
- No decir que el texto se procesa en local: se envía a Gemini. Solo la clave se queda en el ordenador.
- No marcar tareas como terminadas sin ejecutar antes las pruebas correspondientes.
- Documentar los errores encontrados y su solución en `memoria.md`.
- Sin dependencias externas en la aplicación: solo módulos nativos del navegador y de Node.
- No arrancar IA local ni reintroducir Ollama: quedó supérsedido el 2026-11-19.

## Estado rápido

Funcionando con Gemini gratuito, clave detectada en `.env`, 11/11 pruebas en verde y acceso directo en el menú Inicio. Última verificación: 2026-11-19. Pendiente: commit/push y revisión de metadatos de GitHub.
