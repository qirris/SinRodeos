# Producto

<!-- impeccable:product-schema 1 -->

## Plataforma

web

## Tecnología

Delegado por el usuario: se eligió HTML + CSS + JavaScript puro sin dependencias, con un servidor Node de módulos nativos para servir la app y conectar con Ollama local. Motivo: funcionar en su ordenador sin instalaciones complejas y publicarse en GitHub como proyecto limpio.

## Usuarios

qirris, 19 años, estudiante de 2º de DA. Usa la IA para hacer proyectos y necesita que entienda exactamente lo que quiso decir cuando escribe deprisa, con faltas o sin saber explicarlo bien. Situación real: peticiones que la IA ignora, cambia o explica mal, y que acaban reescribiéndose varias veces.

## Propósito del producto

Convertir una petición en bruto en un prompt preciso, estructurado y profesional, conservando literalmente todo lo pedido. El éxito es que la IA receptora cumpla la petición sin que el usuario tenga que reescribirla ni discutir con ella.

## Posicionamiento

La única mejora permitida es de forma, nunca de fondo: la herramienta está diseñada para **no inventar, no omitir y no cambiar nada** de la intención original, y lo hace en local, sin enviar el texto a servidores de terceros.

## Contexto de uso

Se ejecuta en el ordenador del usuario desde el navegador. Puede funcionar sin conexión y sin IA (estructuración determinista) o con Ollama local (`qwen3:8b`) para una redacción más natural. El resultado se copia al portapapeles para pegarlo en cualquier IA. El repositorio público en GitHub sirve además como escaparate de trabajo para empresas.

## Funcionalidades y restricciones

- Entrada: texto libre en español, con errores ortográficos y estructura informal.
- Salida: prompt reescrito y estructurado, en español, listo para copiar.
- Regla dura: conservar todo el contenido original; corregir solo ortografía, puntuación y claridad.
- Ollama es opcional: si no está disponible, debe funcionar el modo sin IA.
- Sin dependencias externas ni llamadas a servicios de pago.
- Idioma de todo el producto, la documentación y los commits: español.
- Debe indicarse de forma visible que el proyecto se desarrolló con asistencia de IA.

## Compromisos de marca

Nombre: **Sin Rodeos**. Voz: directa, clara, sin rodeos y sin promesas infladas; cercana a una persona de 19 años que está aprendiendo y construyendo en público. El repositorio debe verse cuidado y profesional en GitHub, y debe ser honesto sobre la asistencia de IA recibida.

## Evidencia disponible

- Entorno real verificado el 2026-11-19: git, gh (qirris), node, npm, python y Ollama con `qwen3:8b`.
- No hay capturas, testimonios ni métricas: no inventarlos.

## Principios del producto

1. Conservación literal del contenido por encima de la elegancia.
2. Claridad estructural: que una IA entienda a la primera.
3. Español en cada palabra visible y en cada decisión del producto.
4. Privacidad: el texto del usuario no sale de su ordenador.
5. Funciona siempre, con o sin IA local.
6. Transparencia: decir abiertamente que hubo asistencia de IA.

## Accesibilidad e inclusión

Interfaz usable con teclado, etiquetas claras, contraste suficiente y mensajes de error que expliquen qué pasó y cómo continuar.
