# Procedencia de las imágenes

Las imágenes de la presentación explican el producto con recursos verificables. No representan usuarios, resultados o pantallas inventados.

| Recurso | Procedencia y tratamiento |
| --- | --- |
| [Logo](../../icono-192.png) | Variante del logo generado con ImageGen a petición del autor. La fuente es [logo.png](../../logo.png); [logo.png.json](../../logo.png.json) conserva procedencia y prompts. No se ha generado un logo nuevo para esta presentación. |
| [interfaz.png](interfaz.png) | Captura real compartida por el autor en la conversación del proyecto. Se han retirado únicamente los primeros 50 píxeles de altura, correspondientes al marco de Windows. El área de la aplicación se conserva sin retocar ni reescalar. Muestra el estado inicial y solo la parte visible en la captura original. |
| [ejemplo.png](ejemplo.png) | Composición editorial de una petición ficticia y una respuesta real de Gemini, registradas el 22/11/2026. No es una captura de ejecución. |
| [ejemplo-movil.png](ejemplo-movil.png) | Versión apilada de los mismos textos, para facilitar la lectura en pantallas estrechas. No es una captura de la interfaz móvil. |
| [ejemplo.json](ejemplo.json) | Extracto público del caso «Inicio de sesión» del registro real. Contiene entrada y salida literales; no incluye el informe completo, claves ni contenido del historial del usuario. El registro no identifica el modelo concreto. |

La composición presenta los títulos de Markdown como encabezados y las líneas de lista como elementos de texto. La versión literal está en el JSON, el [README](../../README.md#un-ejemplo-de-uso) y el [caso de estudio](../PROYECTO.md#un-ejemplo-concreto).

El diagrama del README se escribe con Mermaid y representa el flujo que implementa el código. No es una captura ni una medición.

## Regeneración sin ventanas

El script [generar-imagenes-docs.ps1](../../scripts/generar-imagenes-docs.ps1) usa System.Drawing de Windows y los textos de `ejemplo.json`. Requiere PowerShell 7 y la captura original proporcionada por el autor para volver a generar `interfaz.png`:

```powershell
pwsh -File scripts/generar-imagenes-docs.ps1 -Captura "RUTA_A_LA_CAPTURA_ORIGINAL.png"
```

Sin `-Captura` regenera solo las dos composiciones. No usa un navegador, no maneja ventanas y no modifica el archivo original. Las imágenes de documentación no se han generado con IA; el logo conserva su atribución independiente.
