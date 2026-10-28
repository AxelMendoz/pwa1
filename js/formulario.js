const formulario = document.getElementById('formulario');
const inputMonto = document.getElementById('monto');
const inputDescripcion = document.getElementById('descripcion');

function mostrarCategoriasDelFormulario() {
  let html = '';
  for (const clave in categorias) {
    let marcado = '';
    if (clave === 'comida') {
      marcado = 'checked';
    }
    html +=
      '<label>' +
      '<input type="radio" name="categoria" value="' + clave + '" ' + marcado + '>' +
      '<span>' + categorias[clave].icono + '<small>' + categorias[clave].nombre + '</small></span>' +
      '</label>';
  }
  document.getElementById('categorias').innerHTML = html;
}

function cambiarEjemplo() {
  inputDescripcion.placeholder = categorias[formulario.categoria.value].ejemplo;
}

function abrirPanel() {
  document.body.classList.add('hoja-abierta');
  setTimeout(function () {
    inputMonto.focus();
  }, 300);
}

function cerrarPanel() {
  document.body.classList.remove('hoja-abierta');
}

document.getElementById('btn-abrir').addEventListener('click', abrirPanel);
document.getElementById('btn-cerrar').addEventListener('click', cerrarPanel);
document.getElementById('fondo').addEventListener('click', cerrarPanel);
document.getElementById('categorias').addEventListener('change', cambiarEjemplo);

document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape') {
    cerrarPanel();
  }
});

for (const boton of document.querySelectorAll('.rapidos button')) {
  boton.addEventListener('click', function () {
    const actual = Number(inputMonto.value) || 0;
    inputMonto.value = actual + Number(boton.dataset.monto);
  });
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const monto = Number(inputMonto.value);
  if (monto <= 0) {
    return;
  }

  agregarGasto(monto, inputDescripcion.value.trim(), formulario.categoria.value);

  filtro = 'todas';
  mostrarFiltros();
  mostrarTodo();

  formulario.reset();
  cambiarEjemplo();
  cerrarPanel();
  mostrarAviso('Gasto guardado');
});
