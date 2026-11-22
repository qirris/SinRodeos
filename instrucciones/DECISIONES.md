# Decisiones

| Fecha | Decisión | Motivo |
| --- | --- | --- |
| 2026-11-19 | Nombre del producto: Sin Rodeos | Representa la promesa: ir al grano y no cambiar lo pedido |
| 2026-11-19 | HTML/CSS/JS puro, sin frameworks | Funciona en el ordenador del usuario sin instalar dependencias y es fácil de publicar en GitHub |
| ~~2026-11-19~~ | ~~Servidor Node como intermediario de Ollama~~ | **Supérsedida el 2026-11-19**: ya no hay IA local; el servidor se mantiene, pero para ocultar la clave de Gemini |
| ~~2026-11-19~~ | ~~Modo sin IA obligatorio, modo IA opcional~~ | **Supérsedida el 2026-11-19**: el usuario quiere "solo IA" y que funcione siempre sin encender nada |
| 2026-11-19 | Servidor Node con módulos nativos que lee `.env` y llama a Gemini | Oculta la clave al navegador y mantiene cero dependencias |
| ~~2026-11-19~~ | ~~Gemini gratuito con `gemini-3.5-flash-lite` por defecto~~ | Supérsedida el 2026-11-22: nuevas configuraciones usan `gemini-3.8-flash`; se respeta el modelo existente |
| 2026-11-19 | Clave en `.env` ignorado por git, leída en cada petición | No se sube al repo y pegarla no exige reiniciar el servidor |
| 2026-11-19 | Regla de conservación estricta en las instrucciones de sistema | El usuario pidió explícitamente que no se cambiara nada de lo solicitado |
| 2026-11-19 | La verificación interna es aproximada y solo avisa | Nunca sustituye ni bloquea el prompt redactado por Gemini |
| 2026-11-19 | App de escritorio con PWA, iconos y acceso directo, sin Electron | Aspecto de aplicación nativa sin añadir dependencias |
| 2026-11-19 | Sin arranque automático con Windows, solo acceso directo | No invadir el inicio del equipo sin permiso expreso |
| 2026-11-19 | Indicador de progreso finito, sin bucle | Evita movimiento innecesario y pasa el detector de diseño |
| 2026-11-19 | Declarar la asistencia de IA en README e interfaz | El usuario quiere transparencia y que se vea una persona proactiva y honesta |
| 2026-11-19 | Voz pública joven y cercana, sin publicar datos personales | El usuario dio su contexto para marcar el tono, no para que apareciera como dato en el repo |
| 2026-11-19 | Traducir al español los encabezados de `PRODUCT.md` y los términos "proxy"/"fallback" | El usuario quiere el repositorio completamente en español |

Las decisiones no se borran: si una queda obsoleta se tacha y se indica la fecha y el motivo.

| Fecha | Decisión | Motivo |
| --- | --- | --- |
| 2026-11-22 | Conservar logo y oscuro, pulir la pantalla existente | Preferencia confirmada por el usuario |
| 2026-11-22 | Priorizar proyectos/código y generar directamente con [Aclarar] | Preferencia confirmada; sin cuestionario previo |
| 2026-11-22 | Estilos subordinados a fidelidad; sin límite de seis líneas ni sugerencias añadidas | Resolver contradicciones con la regla de no añadir/omitir |
| 2026-11-22 | Revisión orientativa, sin garantía porcentual | Las coincidencias de palabras no prueban conservación semántica |
| 2026-11-22 | Vista previa segura, texto Markdown intacto al copiar | Legibilidad sin dependencias ni ejecución de HTML |
| 2026-11-22 | Modelo por defecto `gemini-3.8-flash`, sin sobrescribir .env existente | Plan aprobado y compatibilidad de configuración |
| 2026-11-22 | Supérsedida la conservación del logo original: nueva S/flecha con fuente `logo.png` y variantes PNG/ICO | El usuario pidió explícitamente cambiar el logo y hacerlo más bonito |
| 2026-11-22 | Conversión de iconos con System.Drawing de Windows, sin navegador ni ventanas | Mantener el flujo de archivos y respetar que no se controle la pantalla |
