// Rutas por calles con OSRM, cacheadas con la Cache API; si falla, línea recta
const SERVIDORES = {
  pie: 'https://routing.openstreetmap.de/routed-foot/route/v1/foot/',
  coche: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/',
};
const CACHE = 'rutas-v1';

export function distanciaM([la1, ln1], [la2, ln2]) {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((la2 - la1) * rad) / 2) ** 2 +
    Math.cos(la1 * rad) * Math.cos(la2 * rad) * Math.sin(((ln2 - ln1) * rad) / 2) ** 2;
  return 12742000 * Math.asin(Math.sqrt(a));
}

async function pedir(url) {
  const cache = 'caches' in self ? await caches.open(CACHE).catch(() => null) : null;
  const guardada = cache && (await cache.match(url));
  if (guardada) return guardada.json();

  const resp = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const datos = await resp.clone().json();
  if (datos.code !== 'Ok') throw new Error(datos.code);
  if (cache) cache.put(url, resp).catch(() => {});
  return datos;
}

// Devuelve { coords: [[lat,lng]...], km, recta }
export async function obtenerRuta(paradas, modo) {
  const puntos = paradas.map((p) => p.ll);
  const url = SERVIDORES[modo] + puntos.map(([la, ln]) => `${ln},${la}`).join(';') + '?overview=full&geometries=geojson';
  try {
    const ruta = (await pedir(url)).routes[0];
    return { coords: ruta.geometry.coordinates.map(([ln, la]) => [la, ln]), km: ruta.distance / 1000, recta: false };
  } catch {
    const metros = puntos.slice(1).reduce((suma, p, i) => suma + distanciaM(puntos[i], p), 0);
    return { coords: puntos, km: metros / 1000, recta: true };
  }
}
