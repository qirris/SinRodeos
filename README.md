# Sin Rodeos

> Escribe como te salga. Llévate un prompt claro para seguir con tu proyecto.

Convierte una petición desordenada o escrita deprisa en un prompt en español, con especial atención a proyectos y código. La intención es mejorar la forma conservando todos tus requisitos: cifras, negaciones, rutas, nombres y código. Si falta un dato imprescindible, aparece como `[Aclarar: …]`.

![Logo de Sin Rodeos](icono-192.png)

## Qué puedes hacer

- Elegir entre **Preciso** (estructura adaptada), **Directo** (breve sin recortar requisitos), **Analítico** (trabajo organizado en pasos) y **Creativo** (redacción expresiva sin sugerencias añadidas).
- Leer el resultado con formato o ver el Markdown original. Al copiar se conserva el texto original del prompt.
- Cancelar una generación, usar `Ctrl/⌘ + Enter` y recuperar los últimos diez prompts del historial local.
- Consultar avisos sobre posibles omisiones o cambios. Esta revisión es aproximada: compara siempre el resultado con tu petición; no es una garantía semántica.

## Instalación

Necesitas Node.js 18 o posterior, conexión a internet y una clave de Gemini.

1. Clona o descarga este repositorio.
2. Copia `.env.example` como `.env` en la carpeta del proyecto.
3. Configura `GEMINI_API_KEY` en ese archivo, sin compartirla ni subirla a GitHub.
4. Ejecuta `npm start` y abre `http://127.0.0.1:8000`. En Windows también puedes usar `abrir.bat` para abrir una ventana de app.

No hay dependencias que instalar. El servidor lee la configuración en cada petición; cambiar la clave no requiere reiniciarlo. Para nuevas configuraciones se propone `gemini-3.8-flash`; se respeta el valor existente de `GEMINI_MODELO`.

Para actualizar una copia existente, guarda tu trabajo, ejecuta `git pull --ff-only` en esa copia y reinicia su servidor. Descargar otra carpeta o actualizar GitHub no cambia automáticamente una instalación anterior ni su acceso directo.

## Privacidad y límites

El texto se envía a Gemini (Google) para redactarlo. La clave se guarda en `.env` y solo el servidor local la usa para autenticarse ante Google; nunca se entrega al navegador. La capa gratuita tiene límites y el proveedor puede usar el contenido para mejorar sus productos: evita datos sensibles y revisa sus condiciones.

El historial permanece en `localStorage` de este navegador y se puede borrar desde la app. No hay analíticas externas ni modo sin conexión. El servidor escucha solo en el equipo local y sirve únicamente una lista de archivos públicos; no expone `.env`, `.git` ni documentación interna.

## Verificación y desarrollo

```powershell
npm test
```

Hay 31 pruebas automáticas que cubren lógica, servidor y eventos de interfaz con un DOM de prueba: negaciones y cifras, respuestas antiguas, cancelación, copia, historial y archivos internos. No sustituyen una comprobación visual en un navegador real.

Para comparar las instrucciones antiguas y las nuevas con doce peticiones ficticias:

```powershell
npm run comparar -- --real
```

Este comando usa la configuración privada de `.env`, realiza hasta 24 llamadas reales y guarda el informe en `.impeccable/review/`, ignorado por git. Consume la cuota del proveedor; usa el mismo modelo para ambas variantes. La comparación requiere revisión manual, no calcula una puntuación semántica.

Verificación del 2026-11-22: **31/31 pruebas superadas**. Se completaron **11/12 pares** de comparación real; el último falló por disponibilidad del proveedor. La revisión visual de escritorio y móvil queda pendiente. No se publican capturas ni métricas de mejora inventadas.

El logo actual es `logo.png`; el anterior se conserva como `logo.webp`. `npm run iconos` regenera PNG, ICO y SVG usando System.Drawing de Windows, sin abrir ventanas ni usar un navegador. Los prompts y la procedencia del logo están en `logo.png.json`.

La barra de título usa una variante transparente del símbolo (`logo-ventana.png`), con favicon específico de 16/32 px y nombres versionados. El lanzador abre `?v=4` para renovar la identidad de la ventana conservando el mismo origen y el historial. Tras actualizar, cierra y vuelve a abrir la app si aún ves el icono anterior; no es necesario borrar el historial ni reiniciar el Explorador.

## Asistencia de IA

Proyecto desarrollado con asistencia de IA, incluido el nuevo logo. Las decisiones, los cambios y sus límites se documentan en el repositorio.
