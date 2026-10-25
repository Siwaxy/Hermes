const APP='rutas-v1',TILES='tiles-v1';
const SHELL=['./','index.html','trips.js','manifest.json','icon.svg','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
self.addEventListener('install',e=>e.waitUntil(caches.open(APP).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.endsWith('tile.openstreetmap.org')){ // los mapas vistos quedan guardados
    e.respondWith(caches.open(TILES).then(async c=>{const h=await c.match(e.request);if(h)return h;
      try{const r=await fetch(e.request);c.put(e.request,r.clone());return r}catch{return Response.error()}}));return}
  if(u.hostname.includes('routing.openstreetmap.de'))return;
  e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(APP).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request)));
});
