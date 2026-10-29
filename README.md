# Rutas de viaje

PWA personal que muestra sobre un mapa rutas de viaje ya planificadas. Sin build ni dependencias: archivos estáticos.

## Archivos a subir

Todo el contenido de la carpeta `app/`:

- `index.html`, `verificar.html`
- `trips.json`
- `manifest.webmanifest`, `icon.svg`, `sw.js`
- `css/app.css`
- `js/main.js`, `js/datos.js`, `js/rutas.js`, `js/gps.js`, `js/verificar.js`

`PROMPT.md` y `README.md` son opcionales.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `rutas`).
2. Sube el contenido de `app/` a la raíz del repositorio (arrastrar los archivos en "Add file → Upload files").
3. Ve a Settings → Pages → Build and deployment → Source: "Deploy from a branch", rama `main`, carpeta `/ (root)` → Save.
4. Al cabo de un minuto estará en `https://USUARIO.github.io/rutas/`. Ábrelo en el móvil y usa "Añadir a pantalla de inicio".

Los cambios que subas se ven al recargar con conexión (la app pide primero a la red y usa la caché solo sin conexión); no hace falta tocar `VERSION` en `sw.js`.

La paleta por defecto usa `#a86f10` en lugar de `#c98a1b` por contraste con el texto blanco.

## Añadir un viaje

1. Pide a una IA el viaje en JSON con el prompt de `PROMPT.md`.
2. Pega el objeto resultante dentro de la lista `"viajes"` de `trips.json`.
3. Abre `verificar.html`, pulsa "Empezar" y corrige las coordenadas marcadas en rojo.
4. Sube `trips.json` actualizado.

Si hay errores en un viaje, la app los muestra en el panel indicando viaje, día, parada y campo.
