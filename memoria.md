# Memoria del proyecto

Archivo de memoria persistente de OpenCode. Actualízalo tras cada avance importante.
Regla: NO guardar aquí contraseñas, tokens ni ningún secreto.

## 1. Objetivo y alcance

**Sin Rodeos** es una aplicación local que convierte un texto en bruto escrito por el usuario (en español, con errores, desordenado o mal explicado) en un prompt claro y profesional **sin cambiar nada de lo pedido**: conserva todo el contenido, corrige solo la forma y lo estructura para que una IA lo entienda a la primera.

Usuario: qirris. Idioma de producto, interfaz, documentación y commits: **español**. El proyecto debe subirse a su GitHub con historial de commits y un README cuidado que sirva como escaparate.

## 2. Estado actual

- 2026-11-19: proyecto recién creado en `C:\Users\zakaria\Documents\NEGOCIOS\SinRodeos`. Directorio inicialmente vacío.
- 2026-11-19: entorno verificado: `git`, `gh` (autenticado como `qirris`, scopes `repo`, `workflow`), `node`, `npm`, `python` y `ollama` (modelo `qwen3:8b` instalado).
- 2026-11-19: sistema de memoria y `PRODUCT.md` creados. Código de la aplicación pendiente.

## 3. Tecnologías y arquitectura

- Interfaz: HTML + CSS + JavaScript (ES modules), sin frameworks ni dependencias.
- Servidor local: `servidor.js` con módulos nativos de Node (`http`, `fs`, `path`) para servir archivos y hacer de proxy hacia Ollama (`127.0.0.1:11434`).
- IA opcional: Ollama local con `qwen3:8b`. Modo sin IA siempre disponible.
- Pruebas: `node --test` (módulo nativo de Node).
- Estructura prevista:

| Archivo | Función |
| --- | --- |
| `index.html` | Interfaz de la aplicación |
| `estilos.css` | Sistema visual |
| `app.js` | Cableado de interfaz, eventos y estados |
| `logica/mejorador.js` | Reglas de conservación y estructuración del prompt |
| `logica/ollama.js` | Comunicación con Ollama / fallback directo |
| `logica/historial.js` | Historial local en `localStorage` |
| `servidor.js` | Servidor estático + proxy de Ollama |
| `pruebas/*.test.js` | Pruebas unitarias de la lógica pura |
| `README.md` | Documentación pública en español |

## 4. Instrucciones y restricciones

- **No cambiar nada de lo pedido**: no añadir, quitar ni reinterpretar requisitos del usuario; solo mejorar redacción y estructura.
- Todo en español, incluidos mensajes de interfaz, errores, documentación y commits.
- Sin secretos en archivos `.md` ni en el repositorio.
- El comportamiento real del código manda sobre esta memoria.
- Detalle en `instrucciones/INSTRUCCIONES_GENERALES.md`.

## 5. Funcionalidades implementadas

- Ninguna todavía (estado inicial).

## 6. Cambios realizados

- 2026-11-19: creado el sistema de memoria (`memoria.md`, `AGENTS.md`, `instrucciones/`).
- 2026-11-19: creado `PRODUCT.md` con el producto confirmado por el usuario.

## 7. Decisiones tomadas

- Stack sin dependencias para que la app funcione en el ordenador del usuario sin instalaciones complejas (fecha: 2026-11-19).
- IA local con Ollama como mejora opcional, nunca como dependencia obligatoria (fecha: 2026-11-19).
- Nombre de producto: **Sin Rodeos** (fecha: 2026-11-19).

## 8. Pruebas verificadas

- 2026-11-19: `Get-Command` confirma git, gh, node, npm, python y ollama instalados.
- 2026-11-19: `gh auth status` confirma sesión activa como `qirris` con permisos `repo`.
- 2026-11-19: `ollama list` muestra `qwen3:8b` (5,2 GB). El comando agotó el tiempo de espera al iniciar el servicio.
- Pruebas de la aplicación: pendientes.

## 9. Errores y problemas pendientes

- `ollama list` inició el servicio y terminó por timeout (30 s); el puerto 11434 no quedó escuchando al comprobarlo. El servidor debe arrancarse manualmente para usar el modo IA.
- CORS entre navegador y Ollama sin verificar: se resuelve con el proxy local de `servidor.js`.

## 10. Próximos pasos

1. Implementar la interfaz y la lógica de mejora de prompts.
2. Añadir pruebas unitarias y verificarlas con `npm test`.
3. Redactar `README.md` en español.
4. Inicializar git, crear commits y publicar el repositorio en GitHub.
5. Actualizar esta memoria con el estado final verificado.

## 11. Historial de actualizaciones

- 2026-11-19 — Inicialización del proyecto, memoria y producto.
