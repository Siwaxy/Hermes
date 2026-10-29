// Carga y validación de trips.json
export const PALETA = ['#1f5fa8', '#a86f10', '#a82a45', '#2f7d5b'];

const esTexto = (v) => typeof v === 'string' && v.trim() !== '';
const esLl = (v) =>
  Array.isArray(v) && v.length === 2 && v.every(Number.isFinite) && Math.abs(v[0]) <= 90 && Math.abs(v[1]) <= 180;

// Comprueba nombre, ll y campos opcionales de una parada o extra
function validarPunto(p, ctx, errores) {
  if (p === null || typeof p !== 'object') return errores.push(`${ctx}: no es un objeto`);
  if (!esTexto(p.nombre)) errores.push(`${ctx}: falta nombre`);
  if (p.ll === undefined) errores.push(`${ctx}: falta ll`);
  else if (!esLl(p.ll)) errores.push(`${ctx}: ll inválido (debe ser [lat, lng] con números)`);
  if (p.nota !== undefined && typeof p.nota !== 'string') errores.push(`${ctx}: nota debe ser texto`);
  if (p.hora !== undefined && !/^([01]?\d|2[0-3]):[0-5]\d$/.test(p.hora)) errores.push(`${ctx}: hora debe ser HH:MM`);
  if (p.opcional !== undefined && typeof p.opcional !== 'boolean') errores.push(`${ctx}: opcional debe ser true/false`);
}

// Devuelve el viaje normalizado, o null si tiene errores (que se añaden a `errores`)
function validarViaje(v, i, errores) {
  const antes = errores.length;
  const lugar = esTexto(v?.lugar) ? v.lugar : null;
  const etiqueta = lugar ?? `viaje ${i + 1}`;
  if (!lugar) errores.push(`${etiqueta}: falta lugar`);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(v?.fecha ?? '')) errores.push(`${etiqueta}: fecha debe ser AAAA-MM`);
  if (!Array.isArray(v?.dias) || v.dias.length === 0) {
    errores.push(`${etiqueta}: falta dias (lista con al menos un día)`);
  } else {
    v.dias.forEach((d, j) => {
      const dctx = `${etiqueta} › ${esTexto(d?.nombre) ? d.nombre : `día ${j + 1}`}`;
      if (!esTexto(d?.nombre)) errores.push(`${dctx}: falta nombre`);
      if (d?.modo !== undefined && !['coche', 'pie'].includes(d.modo)) errores.push(`${dctx}: modo debe ser "coche" o "pie"`);
      if (d?.color !== undefined && !/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(d.color)) errores.push(`${dctx}: color debe ser #rrggbb`);
      if (!Array.isArray(d?.paradas) || d.paradas.length === 0) {
        errores.push(`${dctx}: falta paradas (lista con al menos una)`);
      } else {
        d.paradas.forEach((p, k) => validarPunto(p, `${dctx} › parada ${k + 1}`, errores));
      }
    });
  }
  if (v?.extras !== undefined) {
    if (!Array.isArray(v.extras)) errores.push(`${etiqueta}: extras debe ser una lista`);
    else v.extras.forEach((x, k) => validarPunto(x, `${etiqueta} › extra ${k + 1}`, errores));
  }
  if (errores.length > antes) return null;

  return {
    lugar,
    fecha: v.fecha,
    extras: v.extras ?? [],
    dias: v.dias.map((d, j) => ({
      nombre: d.nombre,
      modo: d.modo ?? 'pie',
      color: d.color ?? PALETA[j % PALETA.length],
      paradas: d.paradas,
    })),
  };
}

// Devuelve { viajes (más reciente primero), errores }
export async function cargarViajes(url = 'trips.json') {
  let datos;
  try {
    const resp = await fetch(url, { cache: 'no-cache' });
    if (!resp.ok) return { viajes: [], errores: [`No se pudo cargar ${url} (HTTP ${resp.status})`] };
    datos = JSON.parse(await resp.text());
  } catch (e) {
    const motivo = e instanceof SyntaxError ? `JSON mal formado (${e.message})` : 'sin conexión o archivo no disponible';
    return { viajes: [], errores: [`No se pudo leer ${url}: ${motivo}`] };
  }
  if (!Array.isArray(datos?.viajes)) return { viajes: [], errores: [`${url}: falta la lista "viajes"`] };

  const errores = [];
  const viajes = datos.viajes.map((v, i) => validarViaje(v, i, errores)).filter(Boolean);
  viajes.sort((a, b) => b.fecha.localeCompare(a.fecha));
  return { viajes, errores };
}
