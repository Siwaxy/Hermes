const V='rutas-v2', TILES='rutas-tiles-v2', MAX_TILES=500;
const LEAF='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/';
const SHELL=['./','index.html','trips.js','manifest.json','icon.svg',LEAF+'leaflet.min.css',LEAF+'leaflet.min.js'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('rutas-')&&k!==V&&k!==TILES).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});

async function netFirst(req){
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),4000);
  try{const r=await fetch(req,{cache:'no-cache',signal:ctl.signal}).finally(()=>clearTimeout(t));if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(req,cp)).catch(()=>{})}return r}
  catch(err){const c=await caches.match(req,{ignoreSearch:true});if(c)return c;throw err}
}
async function cacheFirst(req,name,max){
  const cache=await caches.open(name),c=await cache.match(req);
  if(c)return c;
  const r=await fetch(req);
  if(r.ok){const cp=r.clone();cache.put(req,cp).then(()=>max&&cache.keys()).then(ks=>ks&&ks.length>max&&Promise.all(ks.slice(0,ks.length-max).map(k=>cache.delete(k)))).catch(()=>{})}
  return r;
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.hostname==='routing.openstreetmap.de')return;
  if(u.hostname.endsWith('tile.openstreetmap.org'))return e.respondWith(cacheFirst(req,TILES,MAX_TILES));
  if(u.origin===location.origin){
    if(req.mode==='navigate'||/(\/|index\.html|trips\.js)$/.test(u.pathname))return e.respondWith(netFirst(req));
    return e.respondWith(caches.match(req).then(c=>c||fetch(req)));
  }
  if(u.hostname==='cdnjs.cloudflare.com')e.respondWith(cacheFirst(req,V));
});
