# Arquitectura

## Visión general

Aplicación web estática sin build. El navegador carga `index.html`, `estilos.css` y módulos JS. La lógica de mejora es pura y está separada de la interfaz para poder probarla con `node --test`.

## Flujo de datos

1. El usuario escribe su texto en bruto en el área de entrada.
2. `app.js` recoge el texto y las opciones (modo IA / sin IA, corregir redacción, añadir reglas de calidad).
3. Modo sin IA: `logica/mejorador.js` limpia, detecta bloques y genera el prompt con reglas deterministas.
4. Modo IA: `logica/ollama.js` llama al proxy local `/api/ollama/api/generate`; si no responde, intenta `http://127.0.0.1:11434` directamente; si falla, avisa y sugiere el modo sin IA.
5. El resultado se muestra en el área de salida, se guarda en el historial local y se puede copiar.

## Módulos

| Módulo | Responsabilidad |
| --- | --- |
| `logica/mejorador.js` | Normalización, detección de secciones, ensamblaje del prompt y reglas de conservación |
| `logica/ollama.js` | Descubrimiento de modelos y generación con Ollama, con fallback |
| `logica/historial.js` | Guardar, listar y borrar entradas en `localStorage` |
| `app.js` | Estado de la interfaz, eventos, accesibilidad y mensajes |
| `servidor.js` | Servidor estático y proxy inverso de Ollama usando solo módulos nativos |

## Decisiones de interfaz

Una sola pantalla: entrada a la izquierda, salida a la derecha en escritorio; apiladas en móvil. Sin navegación innecesaria. El botón principal de mejora y el de copia son las acciones centrales.
