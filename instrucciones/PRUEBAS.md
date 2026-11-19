# Pruebas

## Automáticas

```powershell
npm test
```

Usa el test runner nativo de Node (`node --test`). Cubre:

- `logica/mejorador.js`: normalización, división en ideas, palabras significativas y detección aproximada de ideas perdidas.
- `logica/gemini.js`: limpieza de envoltorios de código e introducciones no pedidas.
- `logica/instrucciones.js`: presencia de las reglas de conservación, idioma y formato.

Estado verificado: 11/11 en verde.

## Detector de diseño

```powershell
& 'C:\Users\zakaria\.agents\skills\impeccable\scripts\impeccable.cmd' detect --json index.html estilos.css app.js
```

Debe devolver `[]`. El borde lateral del aviso se sustituyó por un borde completo más suave porque el detector lo marcó como patrón reconocible de IA.

## Manuales

1. `npm start` y abrir `http://localhost:8000`; o abrir el acceso directo **Sin Rodeos** del menú Inicio.
2. Si falta la clave, debe aparecer el aviso con instrucciones para editar `.env`. Pegar la clave y volver a pulsar el botón sin reiniciar.
3. Escribir un texto desordenado y comprobar que Gemini devuelve un prompt bien presentado y que la etiqueta de conservación acompaña al resultado.
4. Probar **Probar ejemplo**, **Limpiar**, **Copiar prompt**, el historial y el atajo `Ctrl + Enter`.
5. Probar en ventana estrecha (móvil) y con teclado (Tab / Enter).
6. Probar el endpoint real: `POST /api/mejorar` con `{"texto":"..."}` debe devolver 200 y un prompt; sin clave debe devolver el aviso en español.
7. Comprobar que `.env` no se sube: `git check-ignore -v .env` y revisar `git status --short`.

Toda prueba ejecutada se registra en `memoria.md` con fecha y resultado real.
