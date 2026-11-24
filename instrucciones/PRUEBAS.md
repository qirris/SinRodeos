# Pruebas

## Automáticas

```powershell
npm test
```

Usa el test runner nativo de Node (`node --test`). Cubre:

- `logica/mejorador.js`: normalización, división en ideas, palabras significativas y detección aproximada de ideas perdidas.
- `logica/gemini.js`: limpieza conservadora de envoltorios e introducciones; preservación de títulos y código válidos.
- `logica/instrucciones.js`: presencia de las reglas de conservación, idioma y formato.
- Cancelación, duplicados y descarte de respuestas antiguas, incluso si una respuesta ignora la señal de cancelación.
- Eventos de interfaz con un DOM mínimo: ejemplo, copiar y alternativa manual, historial, errores y listas Markdown con numeración y anidación.
- Servidor HTTP real con configuración y generación ficticias: lista de archivos públicos, Host/origen, JSON, límite en bytes, ausencia de clave, tiempo máximo y respuestas parciales o bloqueadas.

Estado verificado el 2026-11-24: 31/31 en verde, con Node.js v24.21.0. Las pruebas no usan claves reales ni consultan Gemini. Esta ejecución acompaña una entrega documental; no se ha cambiado el código de la aplicación.

## Detector de diseño

```powershell
& 'C:\Users\zakaria\.agents\skills\impeccable\scripts\impeccable.cmd' detect --json index.html estilos.css app.js
```

Última comprobación de código: `[]`. Es un detector mecánico, no sustituye una comprobación visual ni demuestra que no existan defectos de diseño.

## Manuales

1. `npm start` y abrir `http://localhost:8000`; o abrir el acceso directo **Sin Rodeos** del menú Inicio.
2. Si falta la clave, debe aparecer el aviso con instrucciones para editar `.env`. Pegar la clave y volver a pulsar el botón sin reiniciar.
3. Escribir un texto desordenado y comprobar el prompt, Vista previa / Texto y los avisos de revisión orientativa, sin interpretar estos como garantía de conservación.
4. Probar el selector de ejemplos, **Limpiar**, **Cancelar**, **Copiar prompt**, el historial y el atajo `Ctrl + Enter`.
5. Probar en ventana estrecha (móvil) y con teclado (Tab / Enter).
6. Probar el endpoint real: `POST /api/mejorar` con `{"texto":"..."}` debe devolver 200 y un prompt; sin clave debe devolver el aviso en español.
7. Comprobar que `.env` no se sube: `git check-ignore -v .env` y revisar `git status --short`.

Toda prueba ejecutada se registra en `memoria.md` con fecha y resultado real.

## Comparación real de prompts

`npm run comparar -- --real` realiza hasta 24 llamadas con doce entradas ficticias, mismo modelo configurado y límite de salida para ambas variantes. Requiere clave en `.env` y consume cuota. El informe se guarda en `.impeccable/review/comparacion-prompts.json`, fuera de git. No imprime la clave ni asigna una puntuación semántica automática.

El 2026-11-22 se completaron 11/12 pares; el último falló por disponibilidad del proveedor. Pendiente revisar cualitativamente el informe y completar el caso restante. No afirmar una mejora medida sin esa revisión.

## Límites de la verificación

Presentación documental del 2026-11-24: se comprobaron 45 enlaces/rutas y anclas de README, caso de estudio y procedencia de imágenes; textos alternativos; coincidencia literal del ejemplo con el registro real; dimensiones y lectura de PNG. El recorte coincide con los píxeles originales a partir de la fila 50. Imágenes inspeccionadas como archivos, sin abrir ventanas. Esto verifica los recursos documentales, no la interfaz en ejecución.

La revisión independiente de código detectó y confirmó la corrección de la numeración/anidación de listas. La comprobación visual en escritorio y móvil sigue pendiente: el navegador integrado no alcanzó localhost y Computer Use se detuvo por no poder verificar la URL de Chrome. El usuario pidió que no se manejaran sus ventanas; no reintentar sin petición expresa.
