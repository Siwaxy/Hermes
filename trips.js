// Cada viaje -> días -> paradas en orden. ll = [lat, lng], s = estrellas (1-5), opt = parada opcional.
const H = [37.3921, -5.9946]; // Hotel, C. Cuna 4
window.TRIPS = [{
  title: "Viaje a Sevilla en octubre 2026",
  days: [
    { name: "Lun 5 · Centro, Santa Cruz y flamenco", color: "#1f5fa8", stops: [
      { n: "Hotel (C. Cuna 4)", ll: H },
      { n: "Plaza del Salvador", ll: [37.3925, -5.9930], s: 5, note: "Primera cerveza y tapa." },
      { n: "Calle Sierpes", ll: [37.3894, -5.9935], s: 4 },
      { n: "Calle Tetuán", ll: [37.3900, -5.9950], s: 4 },
      { n: "Plaza de San Francisco", ll: [37.3886, -5.9953], s: 4, note: "Ayuntamiento y entorno." },
      { n: "Catedral y Giralda (exterior)", ll: [37.3862, -5.9926], s: 5, note: "Mejor con luz de atardecer." },
      { n: "Barrio de Santa Cruz", ll: [37.3857, -5.9895], s: 5, note: "Paseo sin rumbo." },
      { n: "Patio de Banderas", ll: [37.3860, -5.9918], s: 4, note: "Vistas a la Giralda." },
      { n: "Flamenco · Casa de la Memoria", ll: [37.3920, -5.9944], s: 5, note: "C. Cuna, 6." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]},
    { name: "Mar 6 · Pilatos, Plaza de España y Triana", color: "#c98a1b", stops: [
      { n: "Hotel (C. Cuna 4)", ll: H },
      { n: "Casa de Pilatos", ll: [37.3927, -5.9905], s: 4, note: "Reservar ~1 h." },
      { n: "Barrio de Santa Cruz", ll: [37.3857, -5.9895], s: 5, note: "Calles que no viste el lunes." },
      { n: "Puerta de Jerez", ll: [37.3837, -5.9948], s: 4 },
      { n: "Plaza de España", ll: [37.3772, -5.9869], s: 5 },
      { n: "Parque de María Luisa", ll: [37.3735, -5.9873], s: 4, note: "Paseo relajado." },
      { n: "Puente de San Telmo", ll: [37.3807, -5.9967], s: 4 },
      { n: "Puente de Triana", ll: [37.3855, -6.0000], s: 5 },
      { n: "Triana", ll: [37.3834, -6.0033], s: 5 },
      { n: "Calle Betis", ll: [37.3828, -6.0003], s: 5, note: "Junto al Guadalquivir." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]},
    { name: "Mié 7 · Dueñas, Alameda y Setas", color: "#a82a45", stops: [
      { n: "Hotel (C. Cuna 4)", ll: H },
      { n: "Palacio de Dueñas", ll: [37.3960, -5.9893], s: 4, note: "1–1,5 h." },
      { n: "Basílica de la Macarena", ll: [37.4008, -5.9918], s: 3, opt: true, note: "Solo si apetece." },
      { n: "Alameda de Hércules", ll: [37.3985, -5.9948], s: 4, note: "Almuerzo / tapeo." },
      { n: "Setas · Antiquarium y mirador", ll: [37.3933, -5.9917], s: 5, note: "Subir al atardecer; de noche, Aurora." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]},
    { name: "Jue 8 · Río, Arenal y Catedral 13:30", color: "#2f7d5b", stops: [
      { n: "Plaza Nueva", ll: [37.3881, -5.9962], s: 4 },
      { n: "Arenal", ll: [37.3850, -5.9973], s: 4 },
      { n: "Torre del Oro (exterior)", ll: [37.3824, -5.9963], s: 4 },
      { n: "Plaza de Toros de la Maestranza", ll: [37.3846, -5.9981], s: 4, note: "Exterior." },
      { n: "Mercado del Barranco", ll: [37.3855, -5.9990], s: 4, note: "Comer / tapear." },
      { n: "Catedral y Giralda · 13:30", ll: [37.3862, -5.9926], s: 5, note: "Llegar 13:15–13:20. ~75 min." },
      { n: "Iglesia del Salvador", ll: [37.3925, -5.9929], s: 4, note: "Incluida en la entrada." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]}
  ]
}];
