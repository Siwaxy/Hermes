Convierte el itinerario de viaje que te pego al final en UN objeto JavaScript para el array `window.TRIPS` de mi archivo `trips.js`.

Esquema exacto:

{
  lugar: "Sevilla", fecha: "2026-10",
  days: [
    { name: "Lun 5 · Tema del día", color: "#1f5fa8", modo: "car", stops: [
      { n: "Nombre del sitio", ll: [37.3921, -5.9946], note: "Nota corta y útil.", opt: true }
    ]}
  ]
}

Reglas:
- `lugar`: ciudad o zona del viaje. `fecha`: "AAAA-MM".
- Un elemento de `days` por día. `name` con el formato "Lun 5 · Tema del día" (día de la semana abreviado y número, punto medio, tema).
- `color` del día, en este orden y repitiendo si hay más de 4 días: #1f5fa8, #c98a1b, #a82a45, #2f7d5b.
- `modo: "car"` solo si ese día se hace en coche; si es a pie, omite el campo.
- `stops` en el orden del recorrido. Si el día empieza y termina en el hotel, repite el hotel con el mismo nombre al principio y al final.
- `ll`: [lat, lng] con 4 decimales, del punto de entrada real del sitio (no del centro de la ciudad). Si no estás seguro de una coordenada, termina su `note` con "(verificar ubicación)".
- `note`: una frase corta y útil (reservas, horarios, consejos). Sin relleno.
- `opt: true` solo en paradas opcionales; en las demás, omite el campo.
- No declares constantes ni variables: escribe siempre las coordenadas literales.

Devuelve únicamente el objeto JS, terminado en coma, sin explicaciones ni bloque de texto adicional.

Itinerario:
