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

Versión 1.2.0 publicada en `main`: interfaz oscura, nuevo logo S/flecha, instrucciones revisadas, vista previa segura, cancelación y servidor restringido al equipo local. Última verificación: 2026-11-22, 31/31 pruebas automáticas. Comparación real: 11/12 pares completados; revisión visual pendiente. Fuente del logo: `logo.png`; variantes mediante `npm run iconos` sin ventanas. Ver `memoria.md` para publicación y pendientes reales.

Instalación habitual actualizada el 2026-11-22 con avance directo, configuración privada conservada y servidor reiniciado en segundo plano. Página, icono, protección de archivos internos y una generación real con datos ficticios comprobados. No se manejaron ventanas.
