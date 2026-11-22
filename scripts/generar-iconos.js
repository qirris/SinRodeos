// Genera los recursos desde logo.png con módulos nativos y System.Drawing de Windows.
// No abre ventanas, no usa un navegador ni instala dependencias.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEN = path.join(RAIZ, "logo.png");
const ORIGEN_VENTANA = path.join(RAIZ, "logo-ventana.png");
const LADOS = [32, 48, 64, 256];

function crearIco(imagenes, lados = LADOS) {
  const cabecera = Buffer.alloc(6 + lados.length * 16);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(lados.length, 4);
  const datos = [];
  let posicion = cabecera.length;
  lados.forEach((lado, indice) => {
    const png = Buffer.from(imagenes[lado], "base64");
    const entrada = 6 + indice * 16;
    cabecera[entrada] = lado === 256 ? 0 : lado;
    cabecera[entrada + 1] = lado === 256 ? 0 : lado;
    cabecera.writeUInt16LE(1, entrada + 4);
    cabecera.writeUInt16LE(32, entrada + 6);
    cabecera.writeUInt32LE(png.length, entrada + 8);
    cabecera.writeUInt32LE(posicion, entrada + 12);
    datos.push(png);
    posicion += png.length;
  });
  return Buffer.concat([cabecera, ...datos]);
}

if (process.platform !== "win32") throw new Error("La generación de iconos usa System.Drawing de Windows. La aplicación no depende de este paso para funcionar.");
if (!fs.existsSync(ORIGEN)) throw new Error("No se encontró logo.png en la raíz del proyecto.");
if (!fs.existsSync(ORIGEN_VENTANA)) throw new Error("No se encontró logo-ventana.png en la raíz del proyecto.");

const salida = execFileSync("powershell.exe", [
  "-NoLogo", "-NoProfile", "-NonInteractive", "-File",
  path.join(RAIZ, "scripts", "convertir-iconos.ps1"), "-Origen", ORIGEN, "-OrigenVentana", ORIGEN_VENTANA
], { encoding: "utf8", windowsHide: true, maxBuffer: 32 * 1024 * 1024, timeout: 60000 });
const imagenes = JSON.parse(salida.replace(/^\uFEFF/, "").trim());
for (const lado of [...LADOS, 192, 512]) {
  if (!imagenes[lado]) throw new Error(`No se pudo generar el tamaño de ${lado} px.`);
}
for (const lado of [192, 512]) fs.writeFileSync(path.join(RAIZ, `icono-${lado}.png`), Buffer.from(imagenes[lado], "base64"));
const ico = crearIco(imagenes);
fs.writeFileSync(path.join(RAIZ, "icono.ico"), ico);
fs.writeFileSync(path.join(RAIZ, "icono-app.ico"), ico);
const ventana = {};
for (const lado of [16, 32]) {
  if (!imagenes[`ventana${lado}`]) throw new Error(`Falta el favicon de ${lado} px.`);
  ventana[lado] = imagenes[`ventana${lado}`];
  fs.writeFileSync(path.join(RAIZ, `favicon-${lado}-v4.png`), Buffer.from(ventana[lado], "base64"));
}
fs.writeFileSync(path.join(RAIZ, "icono-ventana-v4.ico"), crearIco(ventana, [16, 32]));
fs.writeFileSync(path.join(RAIZ, "icono.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image href="data:image/png;base64,${imagenes[192]}" width="192" height="192"/></svg>\n`);
console.log("Iconos de app actualizados y favicon transparente v4 de 16/32 px generado. Sin navegador ni ventanas.");
