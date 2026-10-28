function icono(trazos) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + trazos + '</svg>';
}

const categorias = {
  comida: {
    nombre: 'Comida',
    color: '#f59e0b',
    ejemplo: 'Ej: tacos, súper, café',
    icono: icono('<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7"/>'),
  },
  transporte: {
    nombre: 'Transporte',
    color: '#3b82f6',
    ejemplo: 'Ej: gasolina, camión, taxi',
    icono: icono('<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>'),
  },
  casa: {
    nombre: 'Casa',
    color: '#10b981',
    ejemplo: 'Ej: luz, renta, internet',
    icono: icono('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
  },
  ocio: {
    nombre: 'Ocio',
    color: '#ec4899',
    ejemplo: 'Ej: cine, videojuego, salida',
    icono: icono('<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4"/><path d="M15 13h.01M18 11h.01"/>'),
  },
  otros: {
    nombre: 'Otros',
    color: '#8b5cf6',
    ejemplo: 'Ej: ropa, regalo, farmacia',
    icono: icono('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
  },
};

const iconoBorrar = icono('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>');
const iconoRecibo = icono('<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>');

function buscarCategoria(clave) {
  return categorias[clave] || categorias.otros;
}
