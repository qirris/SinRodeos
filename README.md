# Sin Rodeos

> Escribe como quieras. Recibe un prompt que dice exactamente lo que querías decir.

![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square)
![Sin dependencias](https://img.shields.io/badge/dependencias-cero-2440e0?style=flat-square)
![Gemini gratuito](https://img.shields.io/badge/IA-Gemini%20gratis-4285F4?style=flat-square)
![Licencia MIT](https://img.shields.io/badge/licencia-MIT-111827?style=flat-square)

Herramienta que convierte una petición escrita deprisa, desordenada o con faltas en un **prompt claro, bien presentado y profesional en español**, sin cambiar nada de lo que pediste.

## El problema

Cada vez que le paso un mensaje a una IA para que me ayude con un proyecto, me pasa una de tres cosas: no sé explicar bien lo que quiero, lo entiende mal o directamente no me hace caso. Y claro, acabo escribiendo lo mismo tres o cuatro veces hasta que por fin sale.

Pensé: si el problema está en el mensaje de entrada, arreglo el mensaje de entrada. De ahí salió Sin Rodeos: le echo mi texto tal como me sale —con faltas, desordenado— y me devuelve un prompt claro diciendo exactamente lo que yo quise decir, sin inventar nada ni dejarme nada fuera.

## Cómo funciona

1. Escribes tu texto tal cual, sin preocuparte por el orden ni la ortografía.
2. Gemini lo reescribe con una regla fija: **no añadir, no quitar, no cambiar, todo en español y bien presentado en Markdown**.
3. La herramienta compara tus ideas con el resultado y te dice cuántas siguen ahí. Es una comprobación aproximada: sirve para avisarte, no para decidir por ti.
4. Copias el resultado y lo pegas en la IA que uses.

No hay selector de modos: siempre se usa la IA, que es la que deja el prompt bien escrito. La parte estricta solo se usa por dentro para vigilar que no falte nada, nunca para mostrarte un prompt plano en su lugar.

## Ejemplo real

**Entrada**

```text
cuando trabajo con la ia en mis proyectos no me hace caso
y quiero que me pases el prompt ya puesto
sin cambiar nada de lo que he pedido ni añadir cosas
devuélvemelo en español
```

**Salida generada por Gemini**

```markdown
# Solución para proyectos con IA

## Problema
* Al trabajar con la **IA** en mis proyectos, no me hace caso.

## Petición
* Quiero que me pases el prompt ya puesto.
* Sin cambiar nada de lo que he pedido ni añadir cosas.
* Devuélvemelo en **español**.
```

Fíjate en lo importante: no aparece ninguna idea nueva y no falta ninguna. Cambia la forma, no el fondo.

## Instalación y arranque

Necesitas **Node.js 18 o superior**. No hay dependencias que instalar con `npm install`.

### En Windows, como una app de escritorio

- Busca **Sin Rodeos** en el menú Inicio y ábrelo. Sale una ventana propia, sin pestañas ni barra de navegador.
- También puedes hacer doble clic en `abrir.bat` dentro de la carpeta del proyecto.
- El acceso directo arranca el servidor si no está en marcha, así que no tienes que escribir comandos.

Si prefieres usar el navegador normal:

```powershell
cd [RUTA_DEL_PROYECTO]
npm start
```

Y abres `http://localhost:8000`.

### La clave, solo una vez

1. Entra en <https://aistudio.google.com/apikey> e inicia sesión con tu cuenta de Google.
2. Pulsa **Crear clave de API** y cópiala.
3. Abre el archivo `.env` de la carpeta del proyecto y pega la clave aquí:

```text
GEMINI_API_KEY=tu_clave_aquí
```

4. Guardas el archivo y vuelves a pulsar **Convertir en prompt**. No hace falta reiniciar nada.

`.env` está en `.gitignore`: **la clave nunca se sube a GitHub ni aparece en el navegador**. El servidor la guarda y es quien habla con Gemini. Si la subes por accidente, revócala en Google AI Studio y crea otra.

El modelo por defecto es `gemini-3.5-flash-lite`. Si algún día no está disponible, cambia en `.env` la línea `GEMINI_MODELO` por `gemini-3.8-flash`.

### Instalarlo como app (opcional)

Si abres la app en Edge o Chrome, puedes usar **Instalar aplicación** desde el menú del navegador. Queda como una app más con su icono. El acceso directo del menú Inicio ya hace esto mismo sin necesidad de instalar nada.

## Uso

- Escribe o pega tu texto en **Tu texto** y pulsa **Convertir en prompt**.
- Atajo: `Ctrl + Enter` (o `Cmd + Enter`).
- **Copiar prompt** lo deja listo en el portapapeles.
- **Probar ejemplo** carga un texto de muestra para que veas el resultado al instante.
- Los últimos prompts se guardan en el navegador; puedes restaurarlos o borrar el historial.
- Si la clave falta o falla, la propia app te dice qué archivo editar.

## Privacidad y límites, sin adornos

- El texto **se envía a Gemini (Google)** para que lo reescriba. Ya no es todo local: antes se usaba Ollama en el ordenador, ahora no.
- La clave se queda en tu ordenador. El navegador nunca la recibe.
- La capa gratuita tiene límite de peticiones y Google indica en sus condiciones que puede usar el contenido para mejorar sus productos. **No pegues información sensible.**
- Necesitas conexión a internet.

## Arquitectura

```text
SinRodeos/
├── index.html                 Interfaz (manifest, icono y zona de avisos)
├── estilos.css                Sistema visual
├── app.js                     Eventos, estados y comprobación visual
├── servidor.js                Servidor estático + llamada a Gemini con la clave
├── service-worker.js          Guarda la interfaz en caché (nunca las peticiones a la API)
├── manifest.webmanifest       App instalable en ventana propia
├── abrir.bat                  Abre la ventana de app y arranca el servidor si hace falta
├── icono.svg / *.png / .ico   Iconos generados sin dependencias
├── logica/
│   ├── gemini.js              Llamada al servidor y limpieza de la respuesta
│   ├── instrucciones.js       Reglas que recibe Gemini
│   ├── mejorador.js           Comprobación interna de conservación
│   └── historial.js           Historial en localStorage
├── scripts/generar-iconos.js  Genera los iconos con módulos nativos
├── pruebas/                   Pruebas unitarias
├── instrucciones/             Memoria de trabajo del proyecto
├── memoria.md                 Estado y decisiones del proyecto
└── PRODUCT.md                 Definición del producto
```

Solo módulos nativos del navegador y de Node. Cero dependencias.

## Pruebas

```powershell
npm test
```

Usa el test runner nativo de Node. Comprueba la limpieza de la respuesta, las reglas enviadas a Gemini y la detección de ideas perdidas. Las iconos se regeneran con `npm run iconos`.

## Asistencia de IA

Este proyecto ha sido desarrollado **con asistencia de IA**. Yo decidí qué problema resolver, cómo tenía que comportarse la herramienta y qué reglas no se podían romper; la IA me ayudó a escribir parte del código, de las pruebas y de esta documentación, y yo lo he revisado y adaptado.

Lo pongo aquí porque me parece más honesto decirlo que disimularlo. Si estás mirando mi GitHub para conocerme: así trabajo, usando herramientas nuevas y siendo claro sobre lo que hice yo y lo que me ayudaron a hacer.

## Licencia y autor

MIT · Hecho por [qirris](https://github.com/qirris), con asistencia de IA.

Sin rodeos.
