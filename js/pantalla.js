const lista = document.getElementById('lista');
let filtro = 'todas';

function mostrarResumen() {
  let total = 0;
  let totalHoy = 0;
  for (const gasto of gastos) {
    total += gasto.monto;
    if (nombreDelDia(gasto.fecha) === 'Hoy') {
      totalHoy += gasto.monto;
    }
  }

  let promedio = 0;
  if (gastos.length > 0) {
    promedio = total / gastos.length;
  }

  document.getElementById('total').textContent = formatoDinero(total);
  document.getElementById('hoy').textContent = formatoDinero(totalHoy);
  document.getElementById('cantidad').textContent = gastos.length;
  document.getElementById('promedio').textContent = formatoDinero(promedio);

  let barra = '';
  let leyenda = '';
  for (const clave in categorias) {
    const categoria = categorias[clave];
    let suma = 0;
    for (const gasto of gastos) {
      if (gasto.categoria === clave) {
        suma += gasto.monto;
      }
    }
    if (suma > 0) {
      const porcentaje = Math.round((suma / total) * 100);
      barra += '<span style="flex:' + suma + ';background:' + categoria.color + '"></span>';
      leyenda += '<span style="color:' + categoria.color + '">' + categoria.icono + '<em>' + categoria.nombre + ' ' + porcentaje + '%</em></span>';
    }
  }
  document.getElementById('barra').innerHTML = barra;
  document.getElementById('leyenda').innerHTML = leyenda;
}

function mostrarFiltros() {
  let html = '<button data-filtro="todas">Todas</button>';
  for (const clave in categorias) {
    html += '<button data-filtro="' + clave + '">' + categorias[clave].icono + categorias[clave].nombre + '</button>';
  }

  const contenedor = document.getElementById('filtros');
  contenedor.innerHTML = html;
  for (const boton of contenedor.querySelectorAll('button')) {
    if (boton.dataset.filtro === filtro) {
      boton.classList.add('activo');
    }
    boton.addEventListener('click', function () {
      filtro = boton.dataset.filtro;
      mostrarFiltros();
      mostrarLista();
    });
  }
}

function mostrarLista() {
  let visibles = [];
  for (const gasto of gastos) {
    if (filtro === 'todas' || gasto.categoria === filtro) {
      visibles.push(gasto);
    }
  }
  visibles.sort(function (a, b) {
    return b.fecha - a.fecha;
  });

  if (visibles.length === 0) {
    let mensaje = 'Aún no tienes gastos';
    if (gastos.length > 0) {
      mensaje = 'No hay gastos en esta categoría';
    }
    lista.innerHTML =
      '<div class="vacio">' +
      '<div class="vacio-icono">' + iconoRecibo + '</div>' +
      '<p>' + mensaje + '</p>' +
      '<small>Toca el botón + para agregar uno</small>' +
      '</div>';
    return;
  }

  lista.innerHTML = '';
  let diaAnterior = '';

  for (const gasto of visibles) {
    const dia = nombreDelDia(gasto.fecha);
    if (dia !== diaAnterior) {
      const titulo = document.createElement('h3');
      titulo.className = 'dia';
      titulo.textContent = dia;
      lista.appendChild(titulo);
      diaAnterior = dia;
    }
    lista.appendChild(crearFila(gasto));
  }
}

function crearFila(gasto) {
  const categoria = buscarCategoria(gasto.categoria);
  const hora = new Date(gasto.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  let subtitulo = hora;
  if (gasto.descripcion) {
    subtitulo = categoria.nombre + ' · ' + hora;
  }

  const fila = document.createElement('div');
  fila.className = 'gasto';
  fila.innerHTML =
    '<div class="gasto-icono" style="background:' + categoria.color + '26;color:' + categoria.color + '">' + categoria.icono + '</div>' +
    '<div class="gasto-info">' +
    '<p class="gasto-desc"></p>' +
    '<small>' + subtitulo + '</small>' +
    '</div>' +
    '<p class="gasto-monto">-' + formatoDinero(gasto.monto) + '</p>' +
    '<button class="gasto-borrar" aria-label="Eliminar">' + iconoBorrar + '</button>';

  fila.querySelector('.gasto-desc').textContent = nombreDelGasto(gasto);
  fila.querySelector('.gasto-borrar').addEventListener('click', function () {
    eliminar(gasto);
  });
  return fila;
}

function mostrarTodo() {
  mostrarResumen();
  mostrarLista();
}

function eliminar(gasto) {
  const posicion = gastos.indexOf(gasto);
  gastos.splice(posicion, 1);
  guardar();
  mostrarTodo();

  mostrarAviso('Se eliminó "' + nombreDelGasto(gasto) + '"', 'Deshacer', function () {
    gastos.splice(posicion, 0, gasto);
    guardar();
    mostrarTodo();
  });
}
