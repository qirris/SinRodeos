# Arquitectura

## Visión general

Aplicación web sin build ni dependencias. El navegador carga `index.html`, `estilos.css` y módulos JS. La redacción la hace Gemini; la lógica pura separada de la interfaz se reserva para la verificación interna y poder probarla con `node --test`.

El servidor local sigue siendo necesario: es el único que lee la clave de `.env` y habla con Gemini, de modo que el navegador nunca la recibe.

## Flujo de datos

1. El usuario escribe su texto en bruto en el área de entrada.
2. `app.js` recoge el texto y llama a `logica/gemini.js`.
3. `logica/gemini.js` envía `POST /api/mejorar` al servidor local; el navegador no ve la clave.
4. `servidor.js` lee `.env` en cada petición y llama a la API de Gemini con las reglas de `logica/instrucciones.js`.
5. `logica/gemini.js` limpia la respuesta (quita envoltorios de código e introducciones no pedidas).
6. `logica/mejorador.js` compara las ideas originales con el resultado como comprobación aproximada: avisa si falta algo, pero nunca sustituye ni bloquea el prompt de Gemini.
7. El resultado se muestra, se guarda en el historial local y se puede copiar.

## Módulos

| Módulo | Responsabilidad |
| --- | --- |
| `logica/instrucciones.js` | Reglas fijas enviadas a Gemini (no añadir, no quitar, no cambiar, español, Markdown) |
| `logica/gemini.js` | Llamada al servidor local y limpieza de la respuesta |
| `logica/mejorador.js` | Verificación interna aproximada de conservación; no genera prompts |
| `logica/historial.js` | Guardar, listar y borrar entradas en `localStorage` |
| `app.js` | Estado de la interfaz, eventos, accesibilidad y mensajes |
| `servidor.js` | Servidor estático + lectura de `.env` + llamada a Gemini con módulos nativos |
| `service-worker.js` | Limpiador heredado; no se registra un nuevo service worker ni se ofrece funcionamiento sin conexión |
| `logica/solicitud.js` | Una generación vigente, cancelación y descarte de respuestas antiguas |
| `logica/vista.js` | Markdown limitado mediante nodos DOM seguros, sin interpretar HTML |
| `manifest.webmanifest` | Definición de app instalable en ventana propia |
| `scripts/generar-iconos.js` | Genera iconos SVG/PNG/ICO sin librerías |

## Presentación de escritorio

`abrir.bat` detecta si el servidor está en marcha, lo arranca minimizado si no, y abre Edge/Chrome en ventana propia. El manifest conserva la presentación de app; no hay modo sin conexión. El servidor escucha solo en `127.0.0.1`, valida Host y origen y sirve una lista explícita de archivos públicos.

## Decisiones de interfaz

Una sola pantalla: entrada y acciones a la izquierda, resultado con Vista previa / Texto a la derecha; apiladas en móvil con la generación antes del resultado. Siempre se usa IA. La revisión orientativa enumera posibles problemas; no presenta un porcentaje como garantía. Historial plegable con diez entradas.

## Contrato y pruebas

`POST /api/mejorar`: entrada `{texto, estilo}`; salida `{prompt}`; errores `{codigo, error}` en español. El servidor lee .env por petición, respeta GEMINI_MODELO y usa `gemini-3.8-flash` si no hay valor configurado. Cancela la llamada remota al desconectar el cliente o tras 60 segundos. Rechaza respuestas vacías, bloqueadas o truncadas. No se reintenta automáticamente.

`crearServidor` permite inyectar configuración y generación en pruebas; la importación no abre puertos. `scripts/servidor-vista.js` es una herramienta de revisión aislada, con respuestas marcadas como simuladas; no forma parte del arranque normal.
