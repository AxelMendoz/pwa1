let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

function guardar() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

function agregarGasto(monto, descripcion, categoria) {
  gastos.push({
    id: Date.now(),
    fecha: Date.now(),
    descripcion: descripcion,
    monto: monto,
    categoria: categoria,
  });
  guardar();
}

function formatoDinero(cantidad) {
  return cantidad.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

function nombreDelGasto(gasto) {
  if (gasto.descripcion) {
    return gasto.descripcion;
  }
  return buscarCategoria(gasto.categoria).nombre;
}

function nombreDelDia(fecha) {
  const dia = new Date(fecha);
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);

  if (dia.toDateString() === hoy.toDateString()) {
    return 'Hoy';
  }
  if (dia.toDateString() === ayer.toDateString()) {
    return 'Ayer';
  }
  return dia.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
}
