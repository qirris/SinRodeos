// Genera los iconos con módulos nativos de Node: sin librerías ni instalaciones.
// Ejecutar con: npm run iconos

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const OSCURO = [17, 24, 39, 255];
const BLANCO = [255, 255, 255, 255];

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#111827"/>
  <path d="M15 25h30m0 0-7-6m7 6-7 6" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M49 40H19m0 0 7-6m-7 6 7 6" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

function crearLienzo(lado) {
  return { lado, pixeles: Buffer.alloc(lado * lado * 4, 0) };
}

function ponerPixel(lienzo, x, y, color) {
  if (x < 0 || y < 0 || x >= lienzo.lado || y >= lienzo.lado) return;
  const indice = (y * lienzo.lado + x) * 4;
  lienzo.pixeles[indice] = color[0];
  lienzo.pixeles[indice + 1] = color[1];
  lienzo.pixeles[indice + 2] = color[2];
  lienzo.pixeles[indice + 3] = color[3];
}

function dentroRedondeado(x, y, lado, radio) {
  const cx = Math.min(Math.max(x, radio), lado - radio);
  const cy = Math.min(Math.max(y, radio), lado - radio);
  return (x - cx) ** 2 + (y - cy) ** 2 <= radio ** 2;
}

function dentroTriangulo(x, y, a, b, c) {
  const area = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const d1 = area([x, y], a, b);
  const d2 = area([x, y], b, c);
  const d3 = area([x, y], c, a);
  const negativos = d1 < 0 || d2 < 0 || d3 < 0;
  const positivos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(negativos && positivos);
}

function dibujarFlecha(lienzo, inicio, fin, y, grosor, haciaDerecha) {
  const mitad = grosor / 2;
  const finalDelTallo = haciaDerecha ? fin - grosor * 1.2 : inicio + grosor * 1.2;
  const izquierda = Math.min(inicio, finalDelTallo);
  const derecha = Math.max(inicio, finalDelTallo);

  for (let yy = Math.floor(y - mitad); yy <= Math.ceil(y + mitad); yy++) {
    for (let xx = Math.floor(izquierda); xx <= Math.ceil(derecha); xx++) {
      if (yy >= y - mitad && yy <= y + mitad) ponerPixel(lienzo, xx, yy, BLANCO);
    }
  }

  const base = haciaDerecha ? fin - grosor * 1.35 : inicio + grosor * 1.35;
  const punta = haciaDerecha ? fin : inicio;
  const triangulo = [[punta, y], [base, y - grosor], [base, y + grosor]];

  for (let yy = Math.floor(y - grosor); yy <= Math.ceil(y + grosor); yy++) {
    for (let xx = Math.floor(Math.min(punta, base)); xx <= Math.ceil(Math.max(punta, base)); xx++) {
      if (dentroTriangulo(xx, yy, ...triangulo)) ponerPixel(lienzo, xx, yy, BLANCO);
    }
  }
}

function reducir(lienzoGrande, lado, escala) {
  const salida = crearLienzo(lado);

  for (let y = 0; y < lado; y++) {
    for (let x = 0; x < lado; x++) {
      let rojo = 0;
      let verde = 0;
      let azul = 0;
      let alfa = 0;

      for (let dy = 0; dy < escala; dy++) {
        for (let dx = 0; dx < escala; dx++) {
          const indice = ((y * escala + dy) * lienzoGrande.lado + (x * escala + dx)) * 4;
          const opacidad = lienzoGrande.pixeles[indice + 3] / 255;
          rojo += lienzoGrande.pixeles[indice] * opacidad;
          verde += lienzoGrande.pixeles[indice + 1] * opacidad;
          azul += lienzoGrande.pixeles[indice + 2] * opacidad;
          alfa += opacidad;
        }
      }

      if (alfa === 0) continue;

      const indice = (y * lado + x) * 4;
      salida.pixeles[indice] = Math.round(rojo / alfa);
      salida.pixeles[indice + 1] = Math.round(verde / alfa);
      salida.pixeles[indice + 2] = Math.round(azul / alfa);
      salida.pixeles[indice + 3] = Math.round((alfa / (escala * escala)) * 255);
    }
  }

  return salida;
}

function renderizar(lado) {
  const escala = 2;
  const tamaño = lado * escala;
  const grande = crearLienzo(tamaño);
  const radio = tamaño * 0.22;
  const grosor = tamaño * 0.075;

  for (let y = 0; y < tamaño; y++) {
    for (let x = 0; x < tamaño; x++) {
      if (dentroRedondeado(x, y, tamaño, radio)) ponerPixel(grande, x, y, OSCURO);
    }
  }

  dibujarFlecha(grande, tamaño * 0.24, tamaño * 0.72, tamaño * 0.4, grosor, true);
  dibujarFlecha(grande, tamaño * 0.28, tamaño * 0.76, tamaño * 0.62, grosor, false);

  return reducir(grande, lado, escala);
}

const TABLA_CRC = (() => {
  const tabla = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let valor = n;
    for (let k = 0; k < 8; k++) {
      valor = valor & 1 ? 0xedb88320 ^ (valor >>> 1) : valor >>> 1;
    }
    tabla[n] = valor >>> 0;
  }
  return tabla;
})();

function crc32(buffer) {
  let valor = 0xffffffff;
  for (const byte of buffer) {
    valor = TABLA_CRC[(valor ^ byte) & 0xff] ^ (valor >>> 8);
  }
  return (valor ^ 0xffffffff) >>> 0;
}

function trozoPng(tipo, datos) {
  const longitud = Buffer.alloc(4);
  longitud.writeUInt32BE(datos.length, 0);
  const nombre = Buffer.from(tipo, "ascii");
  const comprobacion = Buffer.alloc(4);
  comprobacion.writeUInt32BE(crc32(Buffer.concat([nombre, datos])), 0);
  return Buffer.concat([longitud, nombre, datos, comprobacion]);
}

function aPng(lienzo) {
  const { lado, pixeles } = lienzo;
  const filas = Buffer.alloc((lado * 4 + 1) * lado);

  for (let y = 0; y < lado; y++) {
    const inicioFila = y * (lado * 4 + 1);
    filas[inicioFila] = 0;
    pixeles.copy(filas, inicioFila + 1, y * lado * 4, (y + 1) * lado * 4);
  }

  const cabecera = Buffer.alloc(13);
  cabecera.writeUInt32BE(lado, 0);
  cabecera.writeUInt32BE(lado, 4);
  cabecera[8] = 8;
  cabecera[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    trozoPng("IHDR", cabecera),
    trozoPng("IDAT", zlib.deflateSync(filas)),
    trozoPng("IEND", Buffer.alloc(0))
  ]);
}

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

fs.writeFileSync(path.join(RAIZ, "icono.svg"), SVG, "utf8");
fs.writeFileSync(path.join(RAIZ, "icono-192.png"), aPng(renderizar(192)));
fs.writeFileSync(path.join(RAIZ, "icono-512.png"), aPng(renderizar(512)));
fs.writeFileSync(path.join(RAIZ, "icono.ico"), aIco(aPng(renderizar(64))));

console.log("Iconos generados: icono.svg, icono-192.png, icono-512.png e icono.ico.");
