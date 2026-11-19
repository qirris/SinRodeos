# AGENTS.md — Sin Rodeos

Punto de entrada del proyecto. Aplicación local que convierte texto en bruto en prompts claros en español sin alterar lo pedido.

## Orden de lectura obligatoria

1. `memoria.md` (estado real del proyecto).
2. `instrucciones/INSTRUCCIONES_GENERALES.md`.
3. El documento de `instrucciones/` que corresponda a la tarea (`ARQUITECTURA.md`, `NORMAS_DE_CODIGO.md`, `SEGURIDAD.md`, `PRUEBAS.md`, `DECISIONES.md`, `TAREAS_PENDIENTES.md`).
4. Contrasta siempre con el código real: si la memoria difiere, corrige la memoria.

## Reglas duras

- **No cambiar nada de lo que el usuario pidió**: conservar contenido, añadir solo estructura y corrección de forma.
- Todo en español (interfaz, documentación, mensajes y commits).
- No guardar secretos, tokens ni contraseñas en ningún archivo `.md`.
- No marcar tareas como terminadas sin ejecutar antes las pruebas correspondientes.
- Documentar los errores encontrados y su solución en `memoria.md`.
- Sin dependencias externas en la aplicación: solo módulos nativos del navegador y de Node.

## Estado rápido

En construcción. Última verificación: 2026-11-19 (entorno comprobado, código pendiente).
