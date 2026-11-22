// Genera los recursos desde logo.png con módulos nativos y System.Drawing de Windows.
// No abre ventanas, no usa un navegador ni instala dependencias.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ORIGEN = path.join(RAIZ, "logo.png");
const LADOS = [32, 48, 64, 256];

function crearIco(imagenes) {
  const cabecera = Buffer.alloc(6 + LADOS.length * 16);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(LADOS.length, 4);
  const datos = [];
  let posicion = cabecera.length;
  LADOS.forEach((lado, indice) => {
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

const salida = execFileSync("powershell.exe", [
  "-NoLogo", "-NoProfile", "-NonInteractive", "-File",
  path.join(RAIZ, "scripts", "convertir-iconos.ps1"), "-Origen", ORIGEN
], { encoding: "utf8", windowsHide: true, maxBuffer: 32 * 1024 * 1024, timeout: 60000 });
const imagenes = JSON.parse(salida.replace(/^\uFEFF/, "").trim());
for (const lado of [...LADOS, 192, 512]) {
  if (!imagenes[lado]) throw new Error(`No se pudo generar el tamaño de ${lado} px.`);
}
for (const lado of [192, 512]) fs.writeFileSync(path.join(RAIZ, `icono-${lado}.png`), Buffer.from(imagenes[lado], "base64"));
const ico = crearIco(imagenes);
fs.writeFileSync(path.join(RAIZ, "icono.ico"), ico);
fs.writeFileSync(path.join(RAIZ, "icono-app.ico"), ico);
fs.writeFileSync(path.join(RAIZ, "icono.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><image href="data:image/png;base64,${imagenes[192]}" width="192" height="192"/></svg>\n`);
console.log("Iconos actualizados desde logo.png: PNG de 192/512 px, SVG autocontenido e ICO de 32/48/64/256 px. Sin navegador ni ventanas.");
