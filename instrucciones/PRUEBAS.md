# Pruebas

## Automáticas

```powershell
npm test
```

Usa el test runner nativo de Node (`node --test`). Cubre `logica/mejorador.js`: conservación del contenido, limpieza de espacios, detección de secciones y generación del prompt.

## Manuales en navegador

1. `npm start` y abrir `http://localhost:8000`.
2. Escribir un texto desordenado y comprobar que la salida conserva todas las ideas.
3. Probar botón de copia y al menos un atajo de teclado.
4. Probar con Ollama apagado: debe avisar y seguir funcionando el modo sin IA.
5. Probar en ventana estrecha (móvil) y con teclado (Tab / Enter).

Toda prueba ejecutada se registra en `memoria.md` con fecha y resultado real.
