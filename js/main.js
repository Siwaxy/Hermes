// Mapa, panel de viajes/días y marcadores
import { cargarViajes } from './datos.js';
import { obtenerRuta } from './rutas.js';
import { crearGps } from './gps.js';

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const $ = (id) => document.getElementById(id);
const esMovil = () => matchMedia('(max-width: 640px)').matches;

function el(tag, attrs = {}, ...hijos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v);
  }
  e.append(...hijos);
  return e;
}

const map = L.map('mapa', { zoomControl: false, attributionControl: false }).setView([40.4, -3.7], 6);
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.attribution({ position: esMovil() ? 'topleft' : 'bottomright' }).addTo(map);

// Para no recolocar el mapa si el usuario ya lo ha movido tras activar una ruta
let mapaTocado = false;
['pointerdown', 'wheel'].forEach((ev) => map.getContainer().addEventListener(ev, () => (mapaTocado = true), { passive: true }));
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  crossOrigin: true,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let viajes = [];
let viajeActivo = null;
let gps;
let avisoTimer;

function avisar(texto) {
  const a = $('aviso');
  a.textContent = texto;
  a.hidden = false;
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => (a.hidden = true), 6000);
}

// ---------- Panel plegable (móvil) ----------
function plegar(plegado) {
  $('panel').classList.toggle('plegado', plegado);
  $('btn-plegar').setAttribute('aria-expanded', String(!plegado));
  $('btn-plegar').textContent = plegado ? 'Mostrar rutas' : 'Ocultar';
}
$('btn-plegar').addEventListener('click', () => plegar(!$('panel').classList.contains('plegado')));

// ---------- Utilidades de datos ----------
const mismoPunto = (a, b) => a[0] === b[0] && a[1] === b[1];

// Si la última parada repite la primera (vuelta al hotel) no lleva marcador
function paradasVisibles(dia) {
  const p = dia.paradas;
  return p.length > 1 && mismoPunto(p[0].ll, p[p.length - 1].ll) ? p.slice(0, -1) : p;
}

function enlaceLlegar(ll, modo) {
  return el('a', {
    class: 'llegar',
    href: `https://www.google.com/maps/dir/?api=1&destination=${ll[0]},${ll[1]}&travelmode=${modo === 'coche' ? 'driving' : 'walking'}`,
    target: '_blank',
    rel: 'noopener',
    text: 'Cómo llegar',
  });
}

function contenidoPopup(p, modo) {
  const c = el('div', { class: 'popup' }, el('strong', { text: p.nombre }));
  if (p.hora) c.append(el('div', { class: 'hora', text: p.hora }));
  if (p.nota) c.append(el('div', { text: p.nota }));
  c.append(enlaceLlegar(p.ll, modo));
  return c;
}

function insigniaNum(n, p, color) {
  const e = el('span', { class: p.opcional ? 'num opc' : 'num', text: String(n) });
  e.style.setProperty('--c', color);
  return e;
}

// ---------- Capas ----------
function crearCapaDia(dia) {
  dia.capa = L.layerGroup();
  dia.marcadores = paradasVisibles(dia).map((p, i) => {
    const icono = L.divIcon({
      html: insigniaNum(i + 1, p, dia.color),
      className: '',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
    return L.marker(p.ll, { icon: icono, title: p.nombre }).bindPopup(contenidoPopup(p, dia.modo)).addTo(dia.capa);
  });
}

function crearCapaExtras(viaje) {
  viaje.capaExtras = L.layerGroup();
  viaje.extras.forEach((x) => {
    const icono = L.divIcon({ html: el('span', { class: 'extra-pt' }), className: '', iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -10] });
    L.marker(x.ll, { icon: icono, title: x.nombre }).bindPopup(contenidoPopup(x, 'pie')).addTo(viaje.capaExtras);
  });
}

function opcionesEncuadre() {
  const r = $('panel').getBoundingClientRect();
  return esMovil()
    ? { paddingTopLeft: [30, 30], paddingBottomRight: [30, r.height + 20], maxZoom: 16 }
    : { paddingTopLeft: [r.width + 40, 30], paddingBottomRight: [60, 30], maxZoom: 16 };
}

function encuadrar() {
  const b = L.latLngBounds([]);
  const sumar = (l) => b.extend(l.getBounds ? l.getBounds() : l.getLatLng());
  for (const v of viajes) {
    v.dias.forEach((d) => d.activo && d.capa.eachLayer(sumar));
    if (v.extrasActivo) v.capaExtras.eachLayer(sumar);
  }
  if (!b.isValid()) return;
  gps?.dejarDeSeguir();
  map.fitBounds(b, opcionesEncuadre());
}

// ---------- Activar / desactivar ----------
function textoSub(dia, km, recta) {
  const n = paradasVisibles(dia).length;
  const dist = km === undefined ? '' : `${recta ? '~' : ''}${km.toLocaleString('es-ES', { maximumFractionDigits: 1 })} km `;
  const modo = recta ? 'en línea recta' : dia.modo === 'coche' ? 'en coche' : 'a pie';
  return `${n} ${n === 1 ? 'parada' : 'paradas'} · ${dist}${modo}`;
}

function encenderDia(dia) {
  dia.activo = true;
  if (dia.recta) {
    // La ruta anterior cayó a línea recta: reintentar OSRM
    dia.capa.removeLayer(dia.linea);
    dia.linea = dia.ruta = null;
    dia.recta = false;
  }
  if (!dia.capa) crearCapaDia(dia);
  dia.capa.addTo(map);
  dia.btn.setAttribute('aria-pressed', 'true');
  dia.lista.hidden = false;

  dia.ruta ??= obtenerRuta(dia.paradas, dia.modo);
  dia.ruta.then((r) => {
    dia.sub.textContent = textoSub(dia, r.km, r.recta);
    if (!dia.linea) {
      dia.recta = r.recta;
      dia.linea = L.polyline(r.coords, { color: dia.color, weight: 5, opacity: 0.85, dashArray: r.recta ? '8 8' : null });
      dia.capa.addLayer(dia.linea);
      if (r.recta && dia.activo) avisar(`Sin ruta por calles para "${dia.nombre}": se muestra línea recta.`);
    }
    if (dia.activo && !mapaTocado) encuadrar();
  });
}

function apagarDia(dia) {
  dia.activo = false;
  map.removeLayer(dia.capa);
  dia.btn.setAttribute('aria-pressed', 'false');
  dia.lista.hidden = true;
}

function apagarViaje(viaje) {
  viaje.dias.forEach((d) => d.activo && apagarDia(d));
  if (viaje.extrasActivo) alternarExtras(viaje);
}

function tomarViaje(viaje) {
  if (viajeActivo && viajeActivo !== viaje) apagarViaje(viajeActivo);
  viajeActivo = viaje;
}

function alternarDia(viaje, dia) {
  tomarViaje(viaje);
  if (dia.activo) return apagarDia(dia);
  mapaTocado = false;
  encenderDia(dia);
  encuadrar();
}

function alternarExtras(viaje) {
  viaje.extrasActivo = !viaje.extrasActivo;
  if (viaje.extrasActivo) {
    if (!viaje.capaExtras) crearCapaExtras(viaje);
    viaje.capaExtras.addTo(map);
  } else {
    map.removeLayer(viaje.capaExtras);
  }
  viaje.btnExtras.setAttribute('aria-pressed', String(viaje.extrasActivo));
}

// ---------- Interfaz ----------
function listaParadas(dia) {
  const ol = el('ol', { class: 'paradas' });
  ol.hidden = true;
  paradasVisibles(dia).forEach((p, i) => {
    const textos = el('span', { class: 'p-textos' }, el('strong', { text: p.nombre }));
    if (p.hora) textos.append(el('span', { class: 'hora', text: p.hora }));
    if (p.opcional) textos.append(el('span', { class: 'etiqueta', text: 'opcional' }));
    if (p.nota) textos.append(el('span', { class: 'nota', text: p.nota }));
    const btn = el('button', { type: 'button', class: 'parada' }, insigniaNum(i + 1, p, dia.color), textos);
    btn.addEventListener('click', () => {
      if (esMovil()) plegar(true);
      gps?.dejarDeSeguir();
      map.setView(p.ll, Math.max(map.getZoom(), 16));
      dia.marcadores[i].openPopup();
    });
    ol.append(el('li', {}, btn, enlaceLlegar(p.ll, dia.modo)));
  });
  return ol;
}

function crearDia(viaje, dia) {
  dia.sub = el('span', { class: 'dia-sub', text: textoSub(dia) });
  dia.btn = el('button', { type: 'button', class: 'dia-btn', 'aria-pressed': 'false' }, el('span', { class: 'dia-nombre', text: dia.nombre }), dia.sub);
  dia.btn.style.setProperty('--c', dia.color);
  dia.btn.addEventListener('click', () => alternarDia(viaje, dia));
  dia.lista = listaParadas(dia);
  return el('div', { class: 'dia' }, dia.btn, dia.lista);
}

function crearViaje(viaje, i) {
  const [anio, mes] = viaje.fecha.split('-');
  const det = el('details', { class: 'viaje' }, el('summary', { text: `Viaje a ${viaje.lugar} en ${MESES[mes - 1]} ${anio}` }));
  if (i === 0) det.open = true;
  viaje.dias.forEach((d) => det.append(crearDia(viaje, d)));
  if (viaje.extras.length) {
    viaje.btnExtras = el('button', { type: 'button', class: 'extras-btn', 'aria-pressed': 'false', text: `Si sobra tiempo (${viaje.extras.length})` });
    viaje.btnExtras.addEventListener('click', () => {
      tomarViaje(viaje);
      alternarExtras(viaje);
      if (viaje.extrasActivo) {
        mapaTocado = false;
        encuadrar();
      }
    });
    det.append(viaje.btnExtras);
  }
  return det;
}

function mostrarErrores(errores) {
  const caja = $('errores');
  caja.hidden = errores.length === 0;
  caja.replaceChildren();
  if (!errores.length) return;
  caja.append(el('strong', { text: 'Problemas en trips.json:' }), el('ul', {}, ...errores.map((e) => el('li', { text: e }))));
}

async function iniciar() {
  const res = await cargarViajes('trips.json');
  viajes = res.viajes;
  mostrarErrores(res.errores);
  $('viajes').replaceChildren(...viajes.map(crearViaje));
  if (!viajes.length) $('viajes').append(el('p', { text: 'No hay viajes en trips.json' }));
  if (viajes.length) {
    const todas = viajes[0].dias.flatMap((d) => d.paradas.map((p) => p.ll));
    map.fitBounds(L.latLngBounds(todas), opcionesEncuadre());
  }
  gps = crearGps(map, $('btn-gps'), avisar);
}

iniciar();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
