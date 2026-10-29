// GPS con seguimiento y Wake Lock. Estados: apagado -> siguiendo <-> mostrando
const TEXTO = { apagado: 'Ubicación', siguiendo: 'Siguiendo', mostrando: 'Mostrando · centrar' };
const ERRORES = {
  1: 'Permiso de ubicación denegado.',
  2: 'No se pudo obtener la ubicación.',
  3: 'La ubicación tarda demasiado en responder.',
};

export function crearGps(map, boton, avisar) {
  let estado = 'apagado';
  let watchId = null;
  let bloqueo = null;
  let punto = null;
  let circulo = null;
  let ultima = null;
  let pidiendo = false;
  let avisadoError = false;
  map.createPane('gps').style.zIndex = 650;

  function pintarBoton() {
    boton.dataset.estado = estado;
    boton.setAttribute('aria-pressed', String(estado !== 'apagado'));
    boton.querySelector('.gps-texto').textContent = TEXTO[estado];
  }

  async function pedirBloqueo() {
    if (!('wakeLock' in navigator) || bloqueo || pidiendo) return;
    pidiendo = true;
    try {
      const lock = await navigator.wakeLock.request('screen');
      if (estado === 'apagado') return lock.release();
      bloqueo = lock;
      lock.addEventListener('release', () => (bloqueo = null));
    } catch {
      /* no disponible o denegado: la app sigue funcionando */
    } finally {
      pidiendo = false;
    }
  }

  function alPosicion({ coords }) {
    const ll = [coords.latitude, coords.longitude];
    const primera = !ultima;
    ultima = ll;
    if (!punto) {
      circulo = L.circle(ll, { pane: 'gps', radius: coords.accuracy, weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
      punto = L.circleMarker(ll, { pane: 'gps', radius: 8, color: '#fff', weight: 3, fillColor: '#1a73e8', fillOpacity: 1 }).addTo(map);
    }
    punto.setLatLng(ll);
    circulo.setLatLng(ll).setRadius(coords.accuracy);
    if (estado === 'siguiendo') {
      primera ? map.setView(ll, Math.max(map.getZoom(), 16)) : map.panTo(ll);
    }
  }

  function alError(e) {
    if (e.code === 1) {
      avisar(ERRORES[1]);
      apagar();
    } else if (!avisadoError) {
      avisadoError = true;
      avisar(ERRORES[e.code] ?? 'Error de ubicación.');
    }
  }

  function iniciar() {
    if (!('geolocation' in navigator)) return avisar('Este navegador no ofrece ubicación.');
    watchId = navigator.geolocation.watchPosition(alPosicion, alError, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
    estado = 'siguiendo';
    avisadoError = false;
    pedirBloqueo();
    pintarBoton();
  }

  function apagar() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null;
    [punto, circulo].forEach((c) => c && map.removeLayer(c));
    punto = circulo = ultima = null;
    bloqueo?.release();
    bloqueo = null;
    estado = 'apagado';
    pintarBoton();
  }

  boton.addEventListener('click', () => {
    if (estado === 'apagado') iniciar();
    else if (estado === 'siguiendo') apagar();
    else {
      estado = 'siguiendo';
      if (ultima) map.setView(ultima, Math.max(map.getZoom(), 16));
      pintarBoton();
    }
  });

  function dejarDeSeguir() {
    if (estado === 'siguiendo') {
      estado = 'mostrando';
      pintarBoton();
    }
  }
  map.on('dragstart', dejarDeSeguir);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && estado !== 'apagado') pedirBloqueo();
  });

  pintarBoton();
  return { dejarDeSeguir };
}
