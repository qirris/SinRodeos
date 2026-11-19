# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegado por el usuario: se eligió HTML + CSS + JavaScript puro sin dependencias, con un servidor Node de módulos nativos para servir la app y conectar con Ollama local. Motivo: funcionar en su ordenador sin instalaciones complejas y publicarse en GitHub como proyecto limpio.

## Users

 qirris, usuario de IA que escribe peticiones en español de forma rápida y desordenada y necesita que la herramienta entienda exactamente lo que quiso decir. Situación: trabajando en proyectos con asistentes de IA que a veces ignoran, cambian o explican mal lo solicitado.

## Product Purpose

Convertir una petición en bruto en un prompt preciso, estructurado y profesional, conservando literalmente todo lo pedido. El éxito es que la IA receptora cumpla la petición sin que el usuario tenga que reescribirla ni discutir con ella.

## Positioning

La única mejora permitida es de forma, nunca de fondo: la herramienta está diseñada para **no inventar, no omitir y no cambiar nada** de la intención original, y lo hace en local, sin enviar el texto a servidores de terceros.

## Operating Context

Se ejecuta en el ordenador del usuario desde el navegador. Puede funcionar sin conexión y sin IA (estructuración determinista) o con Ollama local (`qwen3:8b`) para una redacción más natural. El resultado se copia al portapapeles para pegarlo en cualquier IA. El repositorio público en GitHub sirve además como escaparate de trabajo.

## Capabilities and Constraints

- Entrada: texto libre en español, con errores ortográficos y estructura informal.
- Salida: prompt reescrito y estructurado, en español, listo para copiar.
- Regla dura: conservar todo el contenido original; corregir solo ortografía, puntuación y claridad.
- Ollama es opcional: si no está disponible, debe funcionar el modo sin IA.
- Sin dependencias externas ni llamadas a servicios de pago.
- Idioma de todo el producto: español.

## Brand Commitments

Nombre: **Sin Rodeos**. Voz: directa, clara, sin rodeos y sin promesas infladas. Usuario quiere que el repositorio se vea cuidado y profesional en GitHub.

## Evidence on Hand

- Entorno real verificado el 2026-11-19: git, gh (qirris), node, npm, python y Ollama con `qwen3:8b`.
- No hay capturas, testimonios ni métricas: no inventarlos.

## Product Principles

1. Conservación literal del contenido por encima de la elegancia.
2. Claridad estructural: que una IA entienda a la primera.
3. Español en cada palabras visible y en cada decisiones del producto.
4. Privacidad: el texto del usuario no sale de su ordenador.
5. Funciona siempre, con o sin IA local.

## Accessibility & Inclusion

Interfaz usable con teclado, etiquetas claras, contraste suficiente y mensajes de error que expliquen qué pasó y cómo continuar.
