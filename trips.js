// Cada viaje -> días -> paradas en orden. ll = [lat, lng], opt = parada opcional.
// modo: 'car' en un día para trazar la ruta en coche (por defecto, a pie).
const H = [37.3921, -5.9946]; // Hotel, C. Cuna 4
window.TRIPS = [{
  title: "Viaje a Sevilla en octubre 2026",
  days: [
    { name: "Lun 5 · Centro, Santa Cruz y flamenco", color: "#1f5fa8", stops: [
      { n: "Hotel (C. Cuna 4)", ll: H },
      { n: "Plaza del Salvador", ll: [37.3925, -5.9930], note: "Primera cerveza y tapa." },
      { n: "Calle Sierpes", ll: [37.3894, -5.9935] },
      { n: "Calle Tetuán", ll: [37.3900, -5.9950] },
      { n: "Plaza de San Francisco", ll: [37.3886, -5.9953], note: "Ayuntamiento y entorno." },
      { n: "Catedral y Giralda (exterior)", ll: [37.3862, -5.9926], note: "Mejor con luz de atardecer." },
      { n: "Barrio de Santa Cruz", ll: [37.3857, -5.9895], note: "Paseo sin rumbo." },
      { n: "Patio de Banderas", ll: [37.3860, -5.9918], note: "Vistas a la Giralda." },
      { n: "Flamenco · Casa de la Memoria", ll: [37.3920, -5.9944], note: "C. Cuna, 6." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]},
    { name: "Mar 6 · Pilatos, Plaza de España y Triana", color: "#c98a1b", stops: [
      { n: "Hotel (C. Cuna 4)", ll: H },
      { n: "Casa de Pilatos", ll: [37.3927, -5.9905], note: "Reservar ~1 h." },
      { n: "Barrio de Santa Cruz", ll: [37.3857, -5.9895], note: "Calles que no viste el lunes." },
      { n: "Puerta de Jerez", ll: [37.3837, -5.9948] },
      { n: "Plaza de España", ll: [37.3772, -5.9869] },
      { n: "Parque de María Luisa", ll: [37.3735, -5.9873], note: "Paseo relajado." },
      { n: "Puente de San Telmo", ll: [37.3807, -5.9967] },
      { n: "Puente de Triana", ll: [37.3855, -6.0000] },
      { n: "Triana", ll: [37.3834, -6.0033] },
      { n: "Calle Betis", ll: [37.3828, -6.0003], note: "Junto al Guadalquivir." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]},
    { name: "Mié 7 · Dueñas, Alameda y Setas", color: "#a82a45", stops: [
      { n: "Hotel (C. Cuna 4)", ll: H },
      { n: "Palacio de Dueñas", ll: [37.3960, -5.9893], note: "1–1,5 h." },
      { n: "Basílica de la Macarena", ll: [37.4008, -5.9918], opt: true, note: "Solo si apetece." },
      { n: "Alameda de Hércules", ll: [37.3985, -5.9948], note: "Almuerzo / tapeo." },
      { n: "Setas · Antiquarium y mirador", ll: [37.3933, -5.9917], note: "Subir al atardecer; de noche, Aurora." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]},
    { name: "Jue 8 · Río, Arenal y Catedral 13:30", color: "#2f7d5b", stops: [
      { n: "Plaza Nueva", ll: [37.3881, -5.9962] },
      { n: "Arenal", ll: [37.3850, -5.9973] },
      { n: "Torre del Oro (exterior)", ll: [37.3824, -5.9963] },
      { n: "Plaza de Toros de la Maestranza", ll: [37.3846, -5.9981], note: "Exterior." },
      { n: "Mercado del Barranco", ll: [37.3855, -5.9990], note: "Comer / tapear." },
      { n: "Catedral y Giralda · 13:30", ll: [37.3862, -5.9926], note: "Llegar 13:15–13:20. ~75 min." },
      { n: "Iglesia del Salvador", ll: [37.3925, -5.9929], note: "Incluida en la entrada." },
      { n: "Hotel (C. Cuna 4)", ll: H }
    ]}
  ]
},

{
  title: "Viaje a Madrid en [mes año]",
  days: [
    { name: "Día 1 · Madrid de los Austrias", color: "#1f5fa8", stops: [
      { n: "Puerta del Sol", ll: [40.4169, -3.7035] },
      { n: "Plaza Mayor", ll: [40.4155, -3.7074] },
      { n: "Mercado de San Miguel", ll: [40.4155, -3.7089], note: "Tapeo." },
      { n: "Catedral de la Almudena", ll: [40.4154, -3.7143] },
      { n: "Palacio Real (exterior)", ll: [40.4180, -3.7143] },
      { n: "Plaza de España", ll: [40.4234, -3.7122] },
      { n: "Templo de Debod", ll: [40.4240, -3.7178], opt: true, note: "Ideal al atardecer." },
      { n: "Gran Vía", ll: [40.4203, -3.7058] }
    ]},
    { name: "Día 2 · Arte y Retiro", color: "#c98a1b", stops: [
      { n: "Museo Reina Sofía", ll: [40.4086, -3.6944], opt: true, note: "Guernica." },
      { n: "Museo del Prado", ll: [40.4138, -3.6921] },
      { n: "Parque del Retiro · Palacio de Cristal", ll: [40.4128, -3.6844] },
      { n: "Puerta de Alcalá", ll: [40.4200, -3.6888] },
      { n: "Plaza de Cibeles", ll: [40.4193, -3.6931] }
    ]},
    { name: "Día 3 · Barrios y tapas", color: "#a82a45", stops: [
      { n: "Plaza de Oriente", ll: [40.4187, -3.7107] },
      { n: "Malasaña · Plaza del Dos de Mayo", ll: [40.4263, -3.7048] },
      { n: "Chueca · Plaza de Chueca", ll: [40.4222, -3.6972] },
      { n: "Círculo de Bellas Artes (azotea)", ll: [40.4180, -3.6965], opt: true, note: "Vistas de la ciudad." },
      { n: "Barrio de las Letras · Plaza de Santa Ana", ll: [40.4147, -3.7010] },
      { n: "La Latina · Cava Baja", ll: [40.4122, -3.7088], note: "Cena de tapas." }
    ]}
  ]
},
{
  title: "Viaje a Barcelona en [mes año]",
  days: [
    { name: "Día 1 · Gótico y Born", color: "#1f5fa8", stops: [
      { n: "Plaça de Catalunya", ll: [41.3870, 2.1700] },
      { n: "La Rambla · Mercat de la Boqueria", ll: [41.3816, 2.1719] },
      { n: "Plaça Reial", ll: [41.3802, 2.1750] },
      { n: "Catedral de Barcelona", ll: [41.3840, 2.1762] },
      { n: "Plaça de Sant Jaume", ll: [41.3825, 2.1774] },
      { n: "Santa Maria del Mar", ll: [41.3838, 2.1818] },
      { n: "Parc de la Ciutadella", ll: [41.3883, 2.1866] },
      { n: "Arc de Triomf", ll: [41.3910, 2.1805], opt: true }
    ]},
    { name: "Día 2 · Gaudí", color: "#c98a1b", stops: [
      { n: "Sagrada Família", ll: [41.4036, 2.1744], note: "Entrada reservada." },
      { n: "Hospital de Sant Pau", ll: [41.4114, 2.1742], opt: true },
      { n: "Casa Batlló", ll: [41.3917, 2.1649] },
      { n: "La Pedrera (Casa Milà)", ll: [41.3953, 2.1620] }
    ]},
    { name: "Día 3 · Montjuïc", color: "#a82a45", stops: [
      { n: "Plaça d'Espanya", ll: [41.3750, 2.1491] },
      { n: "Font Màgica de Montjuïc", ll: [41.3712, 2.1517] },
      { n: "MNAC", ll: [41.3688, 2.1534], note: "Vistas desde las escaleras." },
      { n: "Estadi Olímpic", ll: [41.3647, 2.1556], opt: true },
      { n: "Castell de Montjuïc", ll: [41.3636, 2.1666] }
    ]},
    { name: "Día 4 · Park Güell y mar", color: "#2f7d5b", stops: [
      { n: "Búnquers del Carmel", ll: [41.4192, 2.1583], opt: true, note: "Mirador, mejor al atardecer." },
      { n: "Park Güell", ll: [41.4145, 2.1527], note: "Entrada reservada." },
      { n: "Platja de la Barceloneta", ll: [41.3785, 2.1925] },
      { n: "Port Olímpic", ll: [41.3868, 2.1964] }
    ]}
  ]
},
{
  title: "Viaje a Cantabria en [mes año]",
  days: [
    { name: "Día 1 · Santander", color: "#1f5fa8", modo: "car", stops: [
      { n: "Palacio de la Magdalena", ll: [43.4713, -3.7655] },
      { n: "Playa del Sardinero", ll: [43.4772, -3.7860] },
      { n: "Faro de Cabo Mayor", ll: [43.4943, -3.7870] },
      { n: "Centro Botín", ll: [43.4631, -3.8015] },
      { n: "Catedral de Santander", ll: [43.4636, -3.8005] },
      { n: "Mercado de la Esperanza", ll: [43.4620, -3.8089], note: "Para comer o comprar productos locales." }
    ]},
    { name: "Día 2 · Parque de Cabárceno", color: "#c98a1b", modo: "car", stops: [
      { n: "Peña Cabarga (mirador)", ll: [43.3979, -3.7644], opt: true, note: "Vistas de la bahía." },
      { n: "Parque de la Naturaleza de Cabárceno", ll: [43.3503, -3.8398], note: "Día completo. Entrada reservada." }
    ]},
    { name: "Día 3 · Costa occidental", color: "#a82a45", modo: "car", stops: [
      { n: "Santillana del Mar", ll: [43.3881, -4.1090] },
      { n: "Museo de Altamira", ll: [43.3774, -4.1195], opt: true },
      { n: "Comillas · El Capricho de Gaudí", ll: [43.3866, -4.2905] },
      { n: "Playa de Oyambre", ll: [43.3918, -4.3300] },
      { n: "San Vicente de la Barquera", ll: [43.3836, -4.3979], note: "Cena junto al puerto." }
    ]},
    { name: "Día 4 · Costa oriental", color: "#2f7d5b", modo: "car", stops: [
      { n: "Noja", ll: [43.4850, -3.5280] },
      { n: "Santoña · Faro del Caballo", ll: [43.4551, -3.4563], opt: true },
      { n: "Laredo", ll: [43.4101, -3.4157] },
      { n: "Castro Urdiales", ll: [43.3834, -3.2197] }
    ]}
  ]
}
];
