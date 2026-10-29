// Compara las coordenadas de trips.json con Nominatim (1 petición/segundo). Solo informa.
import { cargarViajes } from './datos.js';
import { distanciaM } from './rutas.js';

const UMBRAL_M = 150;
const $ = (id) => document.getElementById(id);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const enlaceOsm = (ll, texto) => {
  const a = document.createElement('a');
  a.href = `https://www.openstreetmap.org/?mlat=${ll[0]}&mlon=${ll[1]}#map=18/${ll[0]}/${ll[1]}`;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = texto;
  return a;
};
const fmt = (ll) => `${ll[0]}, ${ll[1]}`;

const consultadas = new Map(); // "nombre|lugar" -> resultado, para no repetir (p. ej. el hotel)
let ultimaPeticion = 0;

// Caja del viaje ampliada ~0,1° para limitar la búsqueda: left,top,right,bottom
function viewbox(viaje) {
  const puntos = [...viaje.dias.flatMap((d) => d.paradas), ...viaje.extras].map((p) => p.ll);
  const lats = puntos.map((p) => p[0]);
  const lngs = puntos.map((p) => p[1]);
  return [Math.min(...lngs) - 0.1, Math.max(...lats) + 0.1, Math.max(...lngs) + 0.1, Math.min(...lats) - 0.1].join(',');
}

// Quita lo que va entre paréntesis y las horas
const limpiar = (nombre) => nombre.replace(/\([^)]*\)/g, '').replace(/\b\d{1,2}:\d{2}\b/g, '').replace(/\s+/g, ' ').trim();

async function consulta(texto, lugar, vb) {
  const clave = `${texto}|${lugar}|${vb}`;
  if (consultadas.has(clave)) return consultadas.get(clave);
  const falta = ultimaPeticion + 1100 - Date.now();
  if (falta > 0) await espera(falta);
  ultimaPeticion = Date.now();
  const q = encodeURIComponent(`${texto}, ${lugar}`);
  const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1&viewbox=${vb}&bounded=1`);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const [r] = await resp.json();
  const ll = r ? [Number(r.lat), Number(r.lon)] : null;
  consultadas.set(clave, ll);
  return ll;
}

// Si no aparece y el nombre lleva "·", prueba cada parte por separado
async function buscar(nombre, lugar, vb) {
  const limpio = limpiar(nombre);
  let ll = await consulta(limpio, lugar, vb);
  if (!ll && limpio.includes('·')) {
    for (const parte of limpio.split('·').map((s) => s.trim()).filter(Boolean)) {
      ll = await consulta(parte, lugar, vb);
      if (ll) break;
    }
  }
  return ll;
}

function fila(tipo, viaje, p, tbody) {
  const tr = document.createElement('tr');
  const celdas = [viaje.lugar, tipo, p.nombre, fmt(p.ll), '…', '', ''].map((t) => {
    const td = document.createElement('td');
    td.textContent = t;
    tr.append(td);
    return td;
  });
  tbody.append(tr);
  return { tr, celdas };
}

async function empezar() {
  $('empezar').disabled = true;
  const tbody = $('tabla').tBodies[0];
  tbody.replaceChildren();
  $('resumen').textContent = '';
  const { viajes, errores } = await cargarViajes('trips.json');
  $('errores').textContent = errores.join(' | ');
  const filas = [];
  for (const v of viajes) {
    v.dias.forEach((d) => d.paradas.forEach((p) => filas.push(['Parada', v, p])));
    v.extras.forEach((x) => filas.push(['Extra', v, x]));
  }
  let mal = 0;
  for (const [i, [tipo, v, p]] of filas.entries()) {
    $('progreso').textContent = `${i + 1} / ${filas.length}`;
    const { tr, celdas } = fila(tipo, v, p, tbody);
    let dudoso = true;
    try {
      const ll = await buscar(p.nombre, v.lugar, viewbox(v));
      if (ll) {
        const m = Math.round(distanciaM(p.ll, ll));
        celdas[4].textContent = fmt(ll);
        celdas[5].textContent = `${m} m`;
        celdas[6].append(enlaceOsm(p.ll, 'actual'), ' · ', enlaceOsm(ll, 'Nominatim'));
        dudoso = m > UMBRAL_M;
      } else {
        celdas[4].textContent = 'no encontrado';
        celdas[6].append(enlaceOsm(p.ll, 'actual'));
      }
    } catch (e) {
      celdas[4].textContent = `error: ${e.message}`;
    }
    tr.classList.toggle('mal', dudoso);
    if (dudoso) mal++;
  }
  $('resumen').textContent = `${filas.length} puntos revisados, ${mal} a revisar (rojo).`;
  $('empezar').disabled = false;
}

$('empezar').addEventListener('click', empezar);
