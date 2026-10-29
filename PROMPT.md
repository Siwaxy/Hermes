# Prompt para convertir un itinerario en un viaje JSON

Pega esto en un chat de IA y, a continuación, tu itinerario en texto.

```
Convierte el itinerario que te pego en UN objeto JSON de viaje con exactamente este esquema. Responde SOLO con el JSON, sin texto antes ni después ni bloques de código.

{
  "lugar": "Ciudad o región",
  "fecha": "AAAA-MM",
  "dias": [
    {
      "nombre": "Lun 5 · Título corto del día",
      "modo": "coche",
      "paradas": [
        { "nombre": "Nombre", "ll": [lat, lng], "nota": "Frase corta y útil", "hora": "13:30", "opcional": true }
      ]
    }
  ],
  "extras": [ { "nombre": "Nombre", "ll": [lat, lng], "nota": "Frase corta" } ]
}

Reglas:
- Obligatorios: lugar, fecha (AAAA-MM), dias[].nombre, dias[].paradas[].nombre y .ll. Todo lo demás es opcional: omítelo si no hay dato (no pongas null ni cadenas vacías).
- "modo": solo "coche" si el día se hace en coche; en otro caso omite el campo (por defecto es a pie).
- "ll" es [latitud, longitud] en grados decimales con 4 o 5 decimales, y apunta a la ENTRADA real del sitio (puerta o acceso), no al centro del edificio o del barrio. Si no estás seguro de una coordenada, di tu mejor estimación; se comprobará después.
- Paradas en el orden en que se visitan. Si el día empieza y acaba en el alojamiento, repite el alojamiento como primera y última parada con las MISMAS coordenadas.
- "hora" en formato HH:MM, solo si el itinerario fija una hora. "opcional": true solo para paradas marcadas como opcionales.
- "nota": una frase corta y útil (reservas, avisos, dato breve).
- "extras": lugares "si sobra tiempo" que no forman parte de ningún día. Omite el campo si no hay.
- No añadas color ni otros campos. Texto en español. JSON válido (comillas dobles, sin comas finales).
```

Después: pega el objeto dentro de la lista `"viajes"` de `trips.json`, abre `verificar.html` y corrige las coordenadas marcadas en rojo.
