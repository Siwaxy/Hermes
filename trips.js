// Cada viaje -> lugar, fecha, días -> paradas en orden. Coordenadas siempre literales (sin constantes ni variables).
// lugar: ciudad/zona del viaje (opcional). Con lugar y fecha se genera el título 'Viaje a {lugar} en {mes} {año}' y se usa para buscar en Google Maps.
// title: (opcional) título manual; si existe, tiene prioridad sobre el generado.
// fecha ('AAAA-MM'): ordena los viajes (el más reciente primero) y da el mes/año del título.
// day: name, color, modo (opcional; 'car' traza la ruta en coche, por defecto a pie), stops.
// stop: n = nombre, ll = [lat, lng], note = aclaración corta, opt = true si es parada opcional.
window.TRIPS = [
{
  lugar: "Sevilla", fecha: "2026-10",
  days: [
    { name: "Lun 5 · Centro, Santa Cruz y flamenco", color: "#1f5fa8", stops: [
      { n: "Hotel (C. Cuna 4)", ll: [37.3921, -5.9946], note: "Base del viaje, a un paso del Salvador y de Sierpes." },
      { n: "Plaza del Salvador", ll: [37.3925, -5.9930], note: "Primera cerveza y tapa. Su iglesia se visita el jueves con la entrada de la Catedral." },
      { n: "Calle Sierpes", ll: [37.3894, -5.9935], note: "Calle peatonal y comercial, de las más tradicionales del centro." },
      { n: "Calle Tetuán", ll: [37.3900, -5.9950], note: "Paralela a Sierpes; mira también las calles laterales." },
      { n: "Plaza de San Francisco", ll: [37.3886, -5.9953], note: "Ayuntamiento con fachada plateresca del siglo XVI." },
      { n: "Catedral y Giralda (exterior)", ll: [37.3862, -5.9926], note: "Una de las mayores catedrales góticas del mundo. Mejor con luz de atardecer; la visita interior es el jueves." },
      { n: "Barrio de Santa Cruz", ll: [37.3857, -5.9895], note: "Antigua judería. Perderse sin mapa es parte del plan." },
      { n: "Patio de Banderas", ll: [37.3860, -5.9918], note: "Plaza entre el Alcázar y la Catedral, con vistas a la Giralda." },
      { n: "Flamenco · Casa de la Memoria", ll: [37.3920, -5.9944], note: "C. Cuna, 6. Conviene tener la entrada reservada; el aforo es pequeño." },
      { n: "Hotel (C. Cuna 4)", ll: [37.3921, -5.9946], note: "Vuelta al hotel." }
    ]},
    { name: "Mar 6 · Pilatos, Plaza de España y Triana", color: "#c98a1b", stops: [
      { n: "Hotel (C. Cuna 4)", ll: [37.3921, -5.9946], note: "Salida a las 9:00." },
      { n: "Casa de Pilatos", ll: [37.3927, -5.9905], note: "Palacio mudéjar y renacentista. Calcula 1 h; lo mejor son los patios." },
      { n: "Barrio de Santa Cruz", ll: [37.3857, -5.9895], note: "Recorre calles distintas a las del lunes. Buen sitio para un café." },
      { n: "Puerta de Jerez", ll: [37.3837, -5.9948], note: "Plaza junto al Hotel Alfonso XIII; buen punto para orientarse." },
      { n: "Plaza de España", ll: [37.3772, -5.9869], note: "Construida para la Exposición Iberoamericana de 1929. Los bancos de azulejo representan provincias." },
      { n: "Parque de María Luisa", ll: [37.3735, -5.9873], note: "Paseo relajado; no hace falta recorrerlo entero." },
      { n: "Puente de San Telmo", ll: [37.3807, -5.9967], note: "Para cruzar a Triana con buenas vistas del río." },
      { n: "Puente de Triana", ll: [37.3855, -6.0000], note: "Inaugurado en 1852, también llamado puente de Isabel II." },
      { n: "Triana", ll: [37.3834, -6.0033], note: "Barrio marinero y de ceramistas, cuna de flamencos y toreros." },
      { n: "Calle Betis", ll: [37.3828, -6.0003], note: "Paseo con terrazas junto al río, con el centro de Sevilla de fondo." },
      { n: "Hotel (C. Cuna 4)", ll: [37.3921, -5.9946], note: "Vuelta por el puente de San Telmo." }
    ]},
    { name: "Mié 7 · Dueñas, Alameda y Setas", color: "#a82a45", stops: [
      { n: "Hotel (C. Cuna 4)", ll: [37.3921, -5.9946], note: "Salida hacia el palacio de Dueñas." },
      { n: "Palacio de Dueñas", ll: [37.3960, -5.9893], note: "Palacio de la Casa de Alba. Visita de 1–1,5 h; aquí nació el poeta Antonio Machado." },
      { n: "Basílica de la Macarena", ll: [37.4008, -5.9918], opt: true, note: "Alberga la Virgen de la Esperanza Macarena. Solo si queda tiempo." },
      { n: "Alameda de Hércules", ll: [37.3985, -5.9948], note: "Paseo del siglo XVI y ambiente alternativo. Buen sitio para comer o tapear." },
      { n: "Setas · Antiquarium y mirador", ll: [37.3933, -5.9917], note: "Antiquarium con ruinas romanas. Sube al mirador al atardecer; de noche, Aurora." },
      { n: "Hotel (C. Cuna 4)", ll: [37.3921, -5.9946], note: "Cena por el centro." }
    ]},
    { name: "Jue 8 · Río, Arenal y Catedral 13:30", color: "#2f7d5b", stops: [
      { n: "Plaza Nueva", ll: [37.3881, -5.9962], note: "Punto de partida tranquilo, con la estatua de San Fernando." },
      { n: "Arenal", ll: [37.3850, -5.9973], note: "Antiguo barrio portuario de la Sevilla de las Indias." },
      { n: "Torre del Oro (exterior)", ll: [37.3824, -5.9963], note: "Torre almohade del siglo XIII. Basta verla por fuera." },
      { n: "Plaza de Toros de la Maestranza", ll: [37.3846, -5.9981], note: "Una de las plazas de toros más famosas de España. Exterior." },
      { n: "Mercado del Barranco", ll: [37.3855, -5.9990], note: "Mercado de estructura de hierro del siglo XIX. Buen sitio para comer." },
      { n: "Catedral y Giralda · 13:30", ll: [37.3862, -5.9926], note: "Llega a las 13:15–13:20: la hora de la entrada es de acceso. Cuenta ~75 min." },
      { n: "Iglesia del Salvador", ll: [37.3925, -5.9929], note: "Incluida en la entrada. Se levantó sobre la antigua mezquita mayor." },
      { n: "Hotel (C. Cuna 4)", ll: [37.3921, -5.9946], note: "Descanso y último paseo opcional por Betis." }
    ]}
  ]
},
{
  lugar: "Cantabria", fecha: "2026-08",
  days: [
    { name: "Día 1 · Santander", color: "#1f5fa8", modo: "car", stops: [
      { n: "Palacio de la Magdalena", ll: [43.4713, -3.7655], note: "Palacio de principios del siglo XX que fue residencia veraniega de Alfonso XIII." },
      { n: "Playa del Sardinero", ll: [43.4772, -3.7860], note: "Playa emblemática desde que la realeza veraneaba aquí." },
      { n: "Faro de Cabo Mayor", ll: [43.4943, -3.7870], note: "Acantilados y mucho viento; lleva una capa." },
      { n: "Centro Botín", ll: [43.4631, -3.8015], note: "Edificio de Renzo Piano sobre la bahía; vale la pena aunque no entres a las salas." },
      { n: "Catedral de Santander", ll: [43.4636, -3.8005], note: "Muy afectada por el incendio de 1941. Mira la cripta." },
      { n: "Mercado de la Esperanza", ll: [43.4620, -3.8089], note: "Mercado del siglo XIX con anchoas, quesos y productos locales." }
    ]},
    { name: "Día 2 · Parque de Cabárceno", color: "#c98a1b", modo: "car", stops: [
      { n: "Peña Cabarga (mirador)", ll: [43.3979, -3.7644], opt: true, note: "Mirador a unos 570 m con vistas de la bahía; se sube en coche." },
      { n: "Parque de la Naturaleza de Cabárceno", ll: [43.3503, -3.8398], note: "Antigua mina de hierro. Reserva entradas, llega temprano y calcula la visita en coche." }
    ]},
    { name: "Día 3 · Costa occidental", color: "#a82a45", modo: "car", stops: [
      { n: "Santillana del Mar", ll: [43.3881, -4.1090], note: "Villa medieval peatonal; aparca fuera del casco." },
      { n: "Museo de Altamira", ll: [43.3774, -4.1195], opt: true, note: "La cueva original no se visita; se ve la réplica. Reserva con antelación." },
      { n: "Comillas · El Capricho de Gaudí", ll: [43.3866, -4.2905], note: "Obra temprana de Gaudí (1883–85). Comprueba el horario de visita." },
      { n: "Playa de Oyambre", ll: [43.3918, -4.3300], note: "Playa amplia dentro de un parque natural." },
      { n: "San Vicente de la Barquera", ll: [43.3836, -4.3979], note: "Villa pesquera con castillo y vistas de los Picos de Europa. Cena junto al puerto." }
    ]},
    { name: "Día 4 · Costa oriental", color: "#2f7d5b", modo: "car", stops: [
      { n: "Noja", ll: [43.4850, -3.5280], note: "Playa larga con marismas protegidas al lado." },
      { n: "Santoña · Faro del Caballo", ll: [43.4551, -3.4563], opt: true, note: "Famosa por sus anchoas; sendero por el monte Buciero hasta el faro." },
      { n: "Laredo", ll: [43.4101, -3.4157], note: "Playa de unos 5 km y casco antiguo (Puebla Vieja)." },
      { n: "Castro Urdiales", ll: [43.3834, -3.2197], note: "Iglesia gótica de Santa María y castillo-faro sobre el puerto." }
    ]}
  ]
},
{
  lugar: "Barcelona", fecha: "2026-06",
  days: [
    { name: "Día 1 · Gótico y Born", color: "#1f5fa8", stops: [
      { n: "Plaça de Catalunya", ll: [41.3870, 2.1700], note: "Punto de partida; une La Rambla y el Eixample." },
      { n: "La Rambla · Mercat de la Boqueria", ll: [41.3816, 2.1719], note: "Cuidado con los carteristas. Para comer, mejor alejarse de la entrada principal." },
      { n: "Plaça Reial", ll: [41.3802, 2.1750], note: "Plaza porticada con farolas diseñadas por Gaudí." },
      { n: "Catedral de Barcelona", ll: [41.3840, 2.1762], note: "Gótica. Mira el claustro, con sus trece ocas." },
      { n: "Plaça de Sant Jaume", ll: [41.3825, 2.1774], note: "Sede del Ayuntamiento y de la Generalitat." },
      { n: "Santa Maria del Mar", ll: [41.3838, 2.1818], note: "Joya del gótico catalán, levantada en el siglo XIV por los vecinos del barrio." },
      { n: "Parc de la Ciutadella", ll: [41.3883, 2.1866], note: "Cascada monumental con colaboración del joven Gaudí. Zoo en el interior." },
      { n: "Arc de Triomf", ll: [41.3910, 2.1805], opt: true, note: "Entrada de la Exposición Universal de 1888." }
    ]},
    { name: "Día 2 · Gaudí", color: "#c98a1b", stops: [
      { n: "Sagrada Família", ll: [41.4036, 2.1744], note: "Reserva con antelación; las torres requieren entrada aparte." },
      { n: "Hospital de Sant Pau", ll: [41.4114, 2.1742], opt: true, note: "Modernismo Patrimonio de la Humanidad, mucho menos masificado." },
      { n: "Casa Batlló", ll: [41.3917, 2.1649], note: "La fachada impresiona desde la calle. Reserva si quieres entrar." },
      { n: "La Pedrera (Casa Milà)", ll: [41.3953, 2.1620], note: "Azotea con chimeneas escultóricas. Reserva con hora." }
    ]},
    { name: "Día 3 · Montjuïc", color: "#a82a45", stops: [
      { n: "Plaça d'Espanya", ll: [41.3750, 2.1491], note: "Torres venecianas y la antigua plaza de toros Las Arenas, con mirador." },
      { n: "Font Màgica de Montjuïc", ll: [41.3712, 2.1517], note: "Espectáculo de agua, luz y música; comprueba los días y horarios." },
      { n: "MNAC", ll: [41.3688, 2.1534], note: "Gran colección de arte románico catalán. Las escaleras tienen buenas vistas." },
      { n: "Estadi Olímpic", ll: [41.3647, 2.1556], opt: true, note: "Estadio de los Juegos de 1992." },
      { n: "Castell de Montjuïc", ll: [41.3636, 2.1666], note: "Fortaleza con vistas al puerto. Se sube en teleférico o a pie." }
    ]},
    { name: "Día 4 · Park Güell y mar", color: "#2f7d5b", stops: [
      { n: "Búnquers del Carmel", ll: [41.4192, 2.1583], opt: true, note: "Antiguas baterías antiaéreas con vistas de 360°. Sin sombra, mejor al atardecer." },
      { n: "Park Güell", ll: [41.4145, 2.1527], note: "Zona monumental con entrada de pago y hora reservada." },
      { n: "Platja de la Barceloneta", ll: [41.3785, 2.1925], note: "Cuidado con tus pertenencias en la playa." },
      { n: "Port Olímpic", ll: [41.3868, 2.1964], note: "Construido para 1992, con vistas al Hotel Arts y a la Torre Mapfre." }
    ]}
  ]
},
{
  lugar: "Madrid", fecha: "2026-03",
  days: [
    { name: "Día 1 · Madrid de los Austrias", color: "#1f5fa8", stops: [
      { n: "Puerta del Sol", ll: [40.4169, -3.7035], note: "Aquí está el kilómetro cero de las carreteras españolas." },
      { n: "Plaza Mayor", ll: [40.4155, -3.7074], note: "Plaza porticada del siglo XVII. Prueba un bocadillo de calamares por los alrededores." },
      { n: "Mercado de San Miguel", ll: [40.4155, -3.7089], note: "Mercado de hierro y cristal de 1916. Más tranquilo fuera de hora punta." },
      { n: "Catedral de la Almudena", ll: [40.4154, -3.7143], note: "Consagrada en 1993, frente al Palacio Real." },
      { n: "Palacio Real (exterior)", ll: [40.4180, -3.7143], note: "Basta el exterior. Si entras, reserva y comprueba cierres por actos oficiales." },
      { n: "Plaza de España", ll: [40.4234, -3.7122], note: "Monumento a Cervantes; desde aquí empieza la Gran Vía." },
      { n: "Templo de Debod", ll: [40.4240, -3.7178], opt: true, note: "Templo egipcio del siglo II a. C. regalado a España en 1968. Mejor al atardecer." },
      { n: "Gran Vía", ll: [40.4203, -3.7058], note: "Abierta a partir de 1910; arquitectura de principios del siglo XX." }
    ]},
    { name: "Día 2 · Arte y Retiro", color: "#c98a1b", stops: [
      { n: "Museo Reina Sofía", ll: [40.4086, -3.6944], opt: true, note: "Aquí está el Guernica de Picasso. Mira los horarios de acceso gratuito." },
      { n: "Museo del Prado", ll: [40.4138, -3.6921], note: "Reserva entrada. Imprescindibles: Velázquez, Goya y El Bosco." },
      { n: "Parque del Retiro · Palacio de Cristal", ll: [40.4128, -3.6844], note: "Palacio de 1887 con entrada gratuita." },
      { n: "Puerta de Alcalá", ll: [40.4200, -3.6888], note: "Arco neoclásico de 1778, anterior a la Puerta de Brandeburgo de Berlín." },
      { n: "Plaza de Cibeles", ll: [40.4193, -3.6931], note: "El Palacio de Cibeles tiene mirador de pago con buenas vistas." }
    ]},
    { name: "Día 3 · Barrios y tapas", color: "#a82a45", stops: [
      { n: "Plaza de Oriente", ll: [40.4187, -3.7107], note: "Frente al Palacio Real, con el Teatro Real al lado." },
      { n: "Malasaña · Plaza del Dos de Mayo", ll: [40.4263, -3.7048], note: "Recuerda el levantamiento contra los franceses de 1808. Barrio alternativo." },
      { n: "Chueca · Plaza de Chueca", ll: [40.4222, -3.6972], note: "Cafeterías y ambiente animado." },
      { n: "Círculo de Bellas Artes (azotea)", ll: [40.4180, -3.6965], opt: true, note: "Azotea con vistas de pago. Mejor al atardecer." },
      { n: "Barrio de las Letras · Plaza de Santa Ana", ll: [40.4147, -3.7010], note: "Zona de teatros y terrazas, donde vivieron Cervantes y Lope de Vega." },
      { n: "La Latina · Cava Baja", ll: [40.4122, -3.7088], note: "Calle de mesones y tabernas. En fin de semana, mejor reservar mesa." }
    ]}
  ]
}
];
