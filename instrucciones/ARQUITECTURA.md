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
| `service-worker.js` | Caché de la interfaz; excluye `/api/` para no guardar resultados ni peticiones |
| `manifest.webmanifest` | Definición de app instalable en ventana propia |
| `scripts/generar-iconos.js` | Genera iconos SVG/PNG/ICO sin librerías |

## Presentación de escritorio

`abrir.bat` detecta si el servidor está en marcha, lo arranca minimizado si no, y abre Edge/Chrome con `--app=http://localhost:8000 --window-size=1180,900`. El manifest y el service worker permiten además instalar la app desde el navegador. No se usa Electron para no añadir dependencias.

## Decisiones de interfaz

Una sola pantalla: entrada a la izquierda, salida a la derecha en escritorio; apiladas en móvil. Sin selector de modos: siempre se usa IA. El botón principal de mejora y el de copia son las acciones centrales. La comprobación de conservación se muestra como una etiqueta discreta, no como un error.
