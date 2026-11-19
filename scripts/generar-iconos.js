// Genera los iconos a partir de logo.webp sin librerías externas.
// El navegador del sistema (Edge o Chrome) decodifica el WebP; Node solo escribe los archivos.
// Ejecutar con: npm run iconos

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEN = path.join(RAIZ, "logo.webp");

function aIco(png) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(1, 4);

  const entrada = Buffer.alloc(16);
  entrada[0] = 64;
  entrada[1] = 64;
  entrada.writeUInt16LE(1, 4);
  entrada.writeUInt16LE(32, 6);
  entrada.writeUInt32LE(png.length, 8);
  entrada.writeUInt32LE(22, 12);

  return Buffer.concat([cabecera, entrada, png]);
}

function navegadorDisponible() {
  const rutas = [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  ];
  return rutas.find(ruta => fs.existsSync(ruta));
}

function convertirWebp(base64, navegador, temporal) {
  const archivoHtml = path.join(temporal, "convertir.html");
  const html = `<!doctype html><html><body><pre id="resultado">esperando</pre><script>
const imagen = new Image();
imagen.onload = () => {
  const salida = {};
  for (const lado of [64, 192, 512]) {
    const lienzo = document.createElement("canvas");
    lienzo.width = lado;
    lienzo.height = lado;
    lienzo.getContext("2d").drawImage(imagen, 0, 0, lado, lado);
    salida[lado] = lienzo.toDataURL("image/png").split(",")[1];
  }
  document.getElementById("resultado").textContent = JSON.stringify(salida);
};
imagen.onerror = () => { document.getElementById("resultado").textContent = "ERROR"; };
imagen.src = "data:image/webp;base64,${base64}";
</script></body></html>`;

  fs.writeFileSync(archivoHtml, html, "utf8");

  const salida = execFileSync(navegador, [
    "--headless",
    "--disable-gpu",
    "--no-first-run",
    "--disable-extensions",
    `--user-data-dir=${path.join(temporal, "perfil")}`,
    "--virtual-time-budget=8000",
    "--dump-dom",
    "file:///" + archivoHtml.replace(/\\/g, "/")
  ], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024, timeout: 60000 });

  const encontrado = salida.match(/<pre id="resultado">([\s\S]*?)<\/pre>/);
  if (!encontrado || !encontrado[1].startsWith("{")) {
    throw new Error("El navegador no pudo convertir logo.webp a PNG.");
  }

  return JSON.parse(encontrado[1]);
}

function main() {
  if (!fs.existsSync(ORIGEN)) {
    throw new Error("No se encontró logo.webp en la raíz del proyecto.");
  }

  const navegador = navegadorDisponible();
  if (!navegador) {
    throw new Error("Se necesita Edge o Chrome para convertir logo.webp.");
  }

  const temporal = path.join(os.tmpdir(), "opencode", "sinrodeos-iconos");
  fs.mkdirSync(temporal, { recursive: true });

  const base64 = fs.readFileSync(ORIGEN).toString("base64");
  const imagenes = convertirWebp(base64, navegador, temporal);

  for (const lado of [64, 192, 512]) {
    if (!imagenes[lado]) throw new Error(`Falta la imagen de ${lado} px.`);
  }

  fs.writeFileSync(path.join(RAIZ, "icono.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><image href="logo.webp" width="64" height="64"/></svg>\n`, "utf8");
  fs.writeFileSync(path.join(RAIZ, "icono-192.png"), Buffer.from(imagenes[192], "base64"));
  fs.writeFileSync(path.join(RAIZ, "icono-512.png"), Buffer.from(imagenes[512], "base64"));
  fs.writeFileSync(path.join(RAIZ, "icono.ico"), aIco(Buffer.from(imagenes[64], "base64")));

  fs.rmSync(temporal, { recursive: true, force: true });

  console.log("Iconos generados desde logo.webp: icono.svg, icono-192.png, icono-512.png e icono.ico.");
}

main();
