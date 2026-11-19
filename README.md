# Sin Rodeos

> Escribe como quieras. Recibe un prompt que dice exactamente lo que querías decir.

![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square)
![Sin dependencias](https://img.shields.io/badge/dependencias-cero-2440e0?style=flat-square)
![Ollama opcional](https://img.shields.io/badge/Ollama-local-FF6A00?style=flat-square)
![Licencia MIT](https://img.shields.io/badge/licencia-MIT-111827?style=flat-square)

Herramienta local que convierte una petición escrita deprisa, desordenada o con faltas en un **prompt claro, estructurado y profesional en español**, sin cambiar nada de lo que pediste.

## El problema (contado como lo viví)

Tengo 19 años y estoy en 2º de DA. Llevo un tiempo haciendo proyectos y subiéndolos a GitHub para que se vea lo que hago, no solo lo que digo que sé.

El caso es que cada vez que le pasaba un mensaje a una IA para que me ayudara, me pasaba una de tres cosas: no sabía explicar bien lo que quería, lo entendía mal o directamente no me hacía caso. Y claro, acababa escribiendo lo mismo tres o cuatro veces hasta que por fin salía.

Pensé: si el problema está en el mensaje de entrada, arreglo el mensaje de entrada. De ahí salió Sin Rodeos: le echo mi texto tal como me sale —con faltas, desordenado, como lo escribiría a las tantas— y me devuelve un prompt claro diciendo exactamente lo que yo quise decir, sin inventar nada ni dejarme nada fuera.

## Cómo funciona

1. Escribes tu texto tal cual, sin preocuparte por el orden ni la ortografía.
2. Sin Rodeos lo separa en ideas y las organiza en secciones (contexto, restricciones, entrega esperada...).
3. Añade, si quieres, tres reglas de precisión: no inventar, no omitir, preguntar si hay duda y responder en español.
4. Copias el resultado y lo pegas en la IA que uses.

Hay dos modos:

| Modo | Qué hace | Cuándo usarlo |
| --- | --- | --- |
| **Estricto, sin IA** | Ordena y limpia el texto con reglas deterministas. Comprueba que cada una de tus ideas sigue en el resultado y lo indica en pantalla. | Siempre que quieras control total y conservación verificable. Funciona sin Ollama. |
| **Con IA local** | Pide a Ollama que reescriba el texto con mejor redacción, respetando literalmente el contenido. | Cuando quieras una redacción más natural sin enviar tus textos a internet. |

## Ejemplo real

**Entrada**

```text
cuando trabajo con la ia en mis proyectos no me hace caso
y quiero que me pases el prompt ya puesto
sin cambiar nada de lo que he pedido ni añadir cosas
devuélvemelo en español
```

**Salida en modo estricto**

```markdown
# Prompt mejorado

## Contexto

- cuando trabajo con la ia en mis proyectos no me hace caso.

## Restricciones

- sin cambiar nada de lo que he pedido ni añadir cosas.

## Entrega esperada

- y quiero que me pases el prompt ya puesto.
- devuélvemelo en español.

## Reglas de precisión

- Respeta literalmente todo lo indicado; no añadas, no quites y no cambies ningún requisito.
- Si algo no está claro, pregunta antes de asumir.
- Responde siempre en español.
```

Fíjate en lo importante: no aparece ninguna idea nueva y no falta ninguna.

## Instalación

Necesitas **Node.js 18 o superior**. No hay dependencias que instalar.

```powershell
git clone https://github.com/qirris/SinRodeos.git
cd SinRodeos
npm start
```

Abre <http://localhost:8000> en tu navegador.

### Ollama (opcional)

Para usar el modo con IA local:

```powershell
ollama pull qwen3:8b
ollama serve
```

La aplicación detecta los modelos instalados y los muestra en el selector. Si Ollama está apagado, verás un aviso y el modo estricto seguirá funcionando con normalidad.

## Uso

- Escribe o pega tu texto en **Tu texto** y pulsa **Convertir en prompt**.
- Atajo: `Ctrl + Enter` (o `Cmd + Enter`).
- **Copiar prompt** lo deja listo en el portapapeles.
- **Probar ejemplo** carga un texto de muestra para que veas el resultado al instante.
- Los últimos prompts se guardan en el navegador; puedes restaurarlos o borrar el historial.
- La casilla **Añadir reglas de precisión** controla si se incluyen las reglas extra.

## Arquitectura

```text
SinRodeos/
├── index.html              Interfaz
├── estilos.css             Sistema visual
├── app.js                  Eventos y estado de la interfaz
├── servidor.js             Servidor estático + intermediario local de Ollama
├── logica/
│   ├── mejorador.js        Reglas del modo estricto (lógica pura)
│   ├── ollama.js           Comunicación con Ollama y alternativa directa
│   └── historial.js        Historial en localStorage
├── pruebas/
│   └── mejorador.test.js   Pruebas unitarias
├── instrucciones/          Memoria de trabajo del proyecto
├── memoria.md              Estado y decisiones del proyecto
└── PRODUCT.md              Definición del producto
```

Todo el procesamiento ocurre en tu ordenador. El texto no se envía a ningún servicio externo: el intermediario de `servidor.js` solo habla con `127.0.0.1:11434`.

## Pruebas

```powershell
npm test
```

Usa el test runner nativo de Node. Comprueba la conservación de ideas, la limpieza de texto, la clasificación de secciones y el comportamiento con entradas vacías.

## Principios

1. Conservar literalmente lo que pediste.
2. Mejorar solo la forma: ortografía, puntuación y estructura.
3. Hacerlo siempre en español.
4. Funcionar sin conexión y sin IA.
5. No pedir permiso para guardar tus datos: no hay ninguno fuera de tu navegador.

## Asistencia de IA

Este proyecto ha sido desarrollado **con asistencia de IA**. Yo decidí qué problema resolver, cómo tenía que comportarse la herramienta y qué reglas no se podían romper; la IA me ayudó a escribir parte del código, de las pruebas y de esta documentación, y yo lo he revisado y adaptado.

Lo pongo aquí porque me parece más honesto decirlo que disimularlo. Si estás mirando mi GitHub para conocerme: así trabajo, usando herramientas nuevas y siendo claro sobre lo que hice yo y lo que me ayudaron a hacer.

## Licencia y autor

MIT · Hecho por [qirris](https://github.com/qirris), con asistencia de IA.

Sin rodeos.
