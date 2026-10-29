// Service worker. App y trips.json: red primero, caché de respaldo. Leaflet y tiles: caché primero.
// No toca la caché "rutas-v1" (rutas OSRM, la gestiona js/rutas.js) ni intercepta OSRM/Nominatim.
const VERSION = 'v1';
const PREFIJO = 'viaje-';
const SHELL = `${PREFIJO}shell-${VERSION}`;
const TILES = `${PREFIJO}tiles-${VERSION}`;
const MAX_TILES = 1000;
const LEAFLET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/';

const ARCHIVOS = [
  './', 'index.html', 'css/app.css', 'js/main.js', 'js/datos.js', 'js/rutas.js', 'js/gps.js',
  'verificar.html', 'js/verificar.js', 'icon.svg', 'manifest.webmanifest', 'trips.json',
  `${LEAFLET}leaflet.min.css`, `${LEAFLET}leaflet.min.js`,
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(ARCHIVOS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  const vigentes = [SHELL, TILES];
  e.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((k) => k.startsWith(PREFIJO) && !vigentes.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function redPrimero(req) {
  const cache = await caches.open(SHELL);
  const respaldo = () => cache.match(req, { ignoreSearch: true });
  try {
    const resp = await fetch(req, { signal: AbortSignal.timeout(8000) });
    if (resp.ok) {
      cache.put(req, resp.clone()).catch(() => {});
      return resp;
    }
    return (await respaldo()) ?? resp;
  } catch {
    return (await respaldo()) ?? Response.error();
  }
}

async function tile(req) {
  const cache = await caches.open(TILES);
  const guardada = await cache.match(req);
  if (guardada) return guardada;
  const resp = await fetch(req);
  if (resp.ok) {
    try {
      await cache.put(req, resp.clone());
      const claves = await cache.keys(); // en orden de inserción
      await Promise.all(claves.slice(0, Math.max(0, claves.length - MAX_TILES)).map((k) => cache.delete(k)));
    } catch {
      /* caché llena o no disponible: se sirve igualmente la respuesta de red */
    }
  }
  return resp;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) e.respondWith(redPrimero(req));
  else if (url.hostname.endsWith('tile.openstreetmap.org')) e.respondWith(tile(req));
  else if (req.url.startsWith(LEAFLET)) e.respondWith(caches.match(req).then((r) => r ?? fetch(req)));
});
