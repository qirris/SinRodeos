// Este service worker se desactiva solo para que la app siempre cargue la versión
// más reciente desde el servidor local. Borra cualquier caché antigua al activarse.

const NOMBRE_CACHÉ = "sinrodeos-v3";

self.addEventListener("install", evento => {
  evento.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(clave => clave.startsWith("sinrodeos-")).map(clave => caches.delete(clave))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", evento => {
  const url = new URL(evento.request.url);
  if (url.pathname.startsWith("/api/") || evento.request.method !== "GET") return;
  evento.respondWith(fetch(evento.request));
});
