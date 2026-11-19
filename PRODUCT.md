# Producto

<!-- impeccable:product-schema 1 -->

## Plataforma

web, presentada como aplicación de escritorio (ventana propia e icono en el menú Inicio).

## Tecnología

HTML + CSS + JavaScript puro sin dependencias, con un servidor Node de módulos nativos. La redacción la hace una IA externa; la clave se guarda en un `.env` local y el servidor es el único que la usa.

## Usuarios

qirris. Usa la IA para hacer proyectos y necesita que entienda exactamente lo que quiso decir cuando escribe deprisa, con faltas o sin saber explicarlo bien. Situación real: peticiones que la IA ignora, cambia o explica mal, y que acaban reescribiéndose varias veces.

## Propósito del producto

Convertir una petición en bruto en un prompt preciso, bien presentado y profesional, conservando literalmente todo lo pedido. El éxito es que la IA receptora cumpla la petición sin que el usuario tenga que reescribirla ni discutir con ella.

## Posicionamiento

La única mejora permitida es de forma, nunca de fondo: **no inventar, no omitir y no cambiar nada** de la intención original. A diferencia de la primera versión, la redacción la hace siempre un servicio de IA para que el resultado se vea bien; la conservación se vigila por dentro con una comprobación aproximada que avisa, pero no sustituye ni bloquea.

## Contexto de uso

Se abre como una app de escritorio en Windows (acceso directo en el menú Inicio, `abrir.bat` o PWA instalable) y también en el navegador en `http://localhost:8000`. Requiere Node.js, una clave gratuita de IA guardada en `.env` y conexión a internet. El resultado se copia al portapapeles para pegarlo en cualquier IA. El repositorio público sirve además como escaparate de trabajo.

## Funcionalidades y restricciones

- Entrada: texto libre en español, con errores ortográficos y estructura informal.
- Salida: prompt reescrito por la IA en Markdown, en español y listo para copiar.
- Regla dura: conservar todo el contenido original; mejorar solo la forma y la precisión de la redacción.
- Selector de estilo: **Preciso** (estructura profesional), **Directo** (máximo seis líneas), **Analítico** (razonamiento previo) y **Creativo** (brief abierto con sugerencias marcadas). No hay selector de modelo.
- La comprobación de conservación es aproximada y se muestra como aviso suave, nunca como error bloqueante.
- La clave API vive en `.env`, ignorado por git; nunca se envía al navegador ni se guarda en la memoria del proyecto.
- Sin dependencias externas en la aplicación.
- Idioma de todo el producto, la documentación y los commits: español.
- Debe indicarse de forma visible que el proyecto se desarrolló con asistencia de IA.

## Compromisos de marca

Nombre: **Sin Rodeos**. Voz: directa, clara, joven, cercana, sin rodeos y sin promesas infladas; alguien que está aprendiendo y construyendo en público. El repositorio debe verse cuidado y profesional en GitHub, y debe ser honesto sobre la asistencia de IA y sobre el hecho de que el texto sale a internet.

## Evidencia disponible

- Entorno real verificado el 2026-11-19: git, gh (qirris), node y npm.
- Llamada real al servicio de IA verificada el 2026-11-19 con el modelo `gemini-3.5-flash-lite`: estado 200 y prompt generado correctamente.
- No hay capturas, testimonios ni métricas: no inventarlos.

## Principios del producto

1. Conservación literal del contenido por encima de la elegancia.
2. Claridad estructural: que una IA entienda a la primera, con buena presentación.
3. Español en cada palabra visible y en cada decisión del producto.
4. La clave no sale del ordenador; el texto sí va al servicio de IA, y eso se dice abiertamente.
5. Funciona siempre que haya conexión y clave, sin arrancar IA local.
6. Transparencia: decir abiertamente que hubo asistencia de IA.

## Accesibilidad e inclusión

Interfaz usable con teclado, etiquetas claras, contraste suficiente y mensajes de error que expliquen qué pasó y cómo continuar.
