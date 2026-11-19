// Guarda solo la interfaz para que la app abra rápido.
// Las peticiones a /api/ nunca se guardan: siempre tienen que llegar al servidor.

const NOMBRE_CACHÉ = "sinrodeos-v1";
const ARCHIVOS = [
  "/",
  "/index.html",
  "/estilos.css",
  "/app.js",
  "/logica/gemini.js",
  "/logica/mejorador.js",
  "/logica/historial.js",
  "/manifest.webmanifest",
  "/icono.svg"
];

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(NOMBRE_CACHÉ)
      .then(caché => caché.addAll(ARCHIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(clave => clave !== NOMBRE_CACHÉ).map(clave => caches.delete(clave))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", evento => {
  const url = new URL(evento.request.url);

  if (url.pathname.startsWith("/api/") || evento.request.method !== "GET") {
    return;
  }

  evento.respondWith(
    fetch(evento.request)
      .then(respuesta => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(NOMBRE_CACHÉ).then(caché => caché.put(evento.request, copia));
        }
        return respuesta;
      })
      .catch(() => caches.match(evento.request).then(guardada => guardada || caches.match("/index.html")))
  );
});
