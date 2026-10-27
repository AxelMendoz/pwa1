// ===== Íconos (SVG de línea) =====
const svg = (trazos) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${trazos}</svg>`;

const ICONOS = {
  comida: svg('<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7"/>'),
  transporte: svg('<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>'),
  casa: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
  ocio: svg('<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4"/><path d="M15 13h.01M18 11h.01"/>'),
  otros: svg('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
  recibo: svg('<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
  borrar: svg('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'),
};

// ===== Configuración =====
const CATEGORIAS = {
  comida: { nombre: 'Comida', icono: ICONOS.comida, color: '#f59e0b', ejemplo: 'Ej: tacos, súper, café' },
  transporte: { nombre: 'Transporte', icono: ICONOS.transporte, color: '#3b82f6', ejemplo: 'Ej: gasolina, camión, taxi' },
  casa: { nombre: 'Casa', icono: ICONOS.casa, color: '#10b981', ejemplo: 'Ej: luz, renta, internet' },
  ocio: { nombre: 'Ocio', icono: ICONOS.ocio, color: '#ec4899', ejemplo: 'Ej: cine, videojuego, salida' },
  otros: { nombre: 'Otros', icono: ICONOS.otros, color: '#8b5cf6', ejemplo: 'Ej: ropa, regalo, farmacia' },
};

// Si el gasto no tiene detalle, se muestra el nombre de su categoría
const titulo = (g) => g.descripcion || (CATEGORIAS[g.categoria] || CATEGORIAS.otros).nombre;

const dinero = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
const $ = (id) => document.getElementById(id);

// ===== Datos (se guardan en el navegador, funcionan sin internet) =====
// Los gastos de la versión anterior no tenían categoría ni fecha: se completan
let gastos = (JSON.parse(localStorage.getItem('gastos')) || []).map((g) => ({
  categoria: 'otros',
  fecha: g.id,
  ...g,
}));
let filtro = 'todas';
let nuevoId = null;
let ultimoTotal = 0;

function guardar() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

const sumar = (lista) => lista.reduce((suma, g) => suma + g.monto, 0);

function etiquetaDia(fecha) {
  const dia = new Date(fecha).toDateString();
  const hoy = new Date();
  const ayer = new Date();
  ayer.setDate(hoy.getDate() - 1);
  if (dia === hoy.toDateString()) return 'Hoy';
  if (dia === ayer.toDateString()) return 'Ayer';
  return new Date(fecha).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ===== Resumen =====
function animarNumero(elemento, desde, hasta) {
  const inicio = performance.now();
  function paso(ahora) {
    const t = Math.min((ahora - inicio) / 600, 1);
    const suave = 1 - Math.pow(1 - t, 3);
    elemento.textContent = dinero.format(desde + (hasta - desde) * suave);
    if (t < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

function mostrarResumen() {
  const total = sumar(gastos);
  animarNumero($('total'), ultimoTotal, total);
  ultimoTotal = total;

  $('hoy').textContent = dinero.format(sumar(gastos.filter((g) => etiquetaDia(g.fecha) === 'Hoy')));
  $('cantidad').textContent = gastos.length;
  $('promedio').textContent = dinero.format(gastos.length ? total / gastos.length : 0);

  // Barra de colores con el porcentaje de cada categoría
  const porCategoria = Object.entries(CATEGORIAS)
    .map(([clave, cat]) => ({ ...cat, suma: sumar(gastos.filter((g) => g.categoria === clave)) }))
    .filter((c) => c.suma > 0);

  $('barra').innerHTML = porCategoria
    .map((c) => `<span style="flex:${c.suma};background:${c.color}" title="${c.nombre}"></span>`)
    .join('');
  $('leyenda').innerHTML = porCategoria
    .map((c) => `<span style="color:${c.color}">${c.icono}<em>${c.nombre} ${Math.round((c.suma / total) * 100)}%</em></span>`)
    .join('');
}

// ===== Filtros =====
function mostrarFiltros() {
  const opciones = [['todas', 'Todas'], ...Object.entries(CATEGORIAS).map(([k, c]) => [k, `${c.icono}${c.nombre}`])];
  $('filtros').innerHTML = opciones
    .map(([clave, texto]) => `<button class="${clave === filtro ? 'activo' : ''}" data-filtro="${clave}">${texto}</button>`)
    .join('');
}

$('filtros').addEventListener('click', (e) => {
  const boton = e.target.closest('button');
  if (!boton) return;
  filtro = boton.dataset.filtro;
  mostrarFiltros();
  mostrarLista();
});

// ===== Lista agrupada por día =====
function mostrarLista() {
  const lista = $('lista');
  const visibles = gastos
    .filter((g) => filtro === 'todas' || g.categoria === filtro)
    .sort((a, b) => b.fecha - a.fecha);

  if (visibles.length === 0) {
    lista.innerHTML = `
      <div class="vacio">
        <div class="vacio-icono">${ICONOS.recibo}</div>
        <p>${gastos.length ? 'No hay gastos en esta categoría' : 'Aún no tienes gastos'}</p>
        <small>Toca el botón + para agregar uno</small>
      </div>`;
    return;
  }

  lista.innerHTML = '';
  let diaActual = '';

  visibles.forEach((g) => {
    const dia = etiquetaDia(g.fecha);
    if (dia !== diaActual) {
      diaActual = dia;
      const encabezado = document.createElement('h3');
      encabezado.className = 'dia';
      encabezado.textContent = dia;
      lista.appendChild(encabezado);
    }

    const cat = CATEGORIAS[g.categoria] || CATEGORIAS.otros;
    const hora = new Date(g.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    const item = document.createElement('div');
    item.className = 'gasto' + (g.id === nuevoId ? ' nuevo' : '');
    item.innerHTML = `
      <div class="gasto-icono" style="background:${cat.color}26;color:${cat.color}">${cat.icono}</div>
      <div class="gasto-info">
        <p class="gasto-desc"></p>
        <small>${g.descripcion ? cat.nombre + ' · ' : ''}${hora}</small>
      </div>
      <p class="gasto-monto">-${dinero.format(g.monto)}</p>
      <button class="gasto-borrar" aria-label="Eliminar">${ICONOS.borrar}</button>`;
    item.querySelector('.gasto-desc').textContent = titulo(g); // evita meter HTML
    item.querySelector('.gasto-borrar').onclick = () => eliminar(g.id, item);
    lista.appendChild(item);
  });

  nuevoId = null;
}

function mostrarTodo() {
  mostrarResumen();
  mostrarLista();
}

// ===== Eliminar (con opción de deshacer) =====
function eliminar(id, elemento) {
  const indice = gastos.findIndex((g) => g.id === id);
  const [borrado] = gastos.splice(indice, 1);
  guardar();

  elemento.classList.add('saliendo');
  elemento.addEventListener('animationend', mostrarTodo, { once: true });

  aviso(`Se eliminó "${titulo(borrado)}"`, 'Deshacer', () => {
    gastos.splice(indice, 0, borrado);
    guardar();
    nuevoId = borrado.id;
    mostrarTodo();
  });
}

// ===== Panel para agregar =====
$('categorias').innerHTML = Object.entries(CATEGORIAS)
  .map(([clave, c], i) => `
    <label>
      <input type="radio" name="categoria" value="${clave}" ${i === 0 ? 'checked' : ''}>
      <span>${c.icono}<small>${c.nombre}</small></span>
    </label>`)
  .join('');

// El ejemplo del detalle cambia según la categoría elegida
function actualizarEjemplo() {
  $('descripcion').placeholder = CATEGORIAS[$('formulario').categoria.value].ejemplo;
}
$('categorias').addEventListener('change', actualizarEjemplo);
actualizarEjemplo();

function abrirPanel() {
  document.body.classList.add('hoja-abierta');
  setTimeout(() => $('monto').focus(), 300);
}

function cerrarPanel() {
  document.body.classList.remove('hoja-abierta');
}

$('btn-abrir').addEventListener('click', abrirPanel);
$('btn-cerrar').addEventListener('click', cerrarPanel);
$('fondo').addEventListener('click', cerrarPanel);
document.addEventListener('keydown', (e) => e.key === 'Escape' && cerrarPanel());

// Botones de monto rápido (+50, +100...)
document.querySelector('.rapidos').addEventListener('click', (e) => {
  const boton = e.target.closest('button');
  if (!boton) return;
  const actual = Number($('monto').value) || 0;
  $('monto').value = actual + Number(boton.dataset.monto);
});

$('formulario').addEventListener('submit', (e) => {
  e.preventDefault();
  const formulario = e.target;
  const monto = Number($('monto').value);
  const descripcion = $('descripcion').value.trim();

  if (!monto || monto <= 0) {
    formulario.classList.add('error');
    setTimeout(() => formulario.classList.remove('error'), 300);
    return;
  }

  const gasto = {
    id: Date.now(),
    fecha: Date.now(),
    descripcion,
    monto,
    categoria: formulario.categoria.value,
  };
  gastos.push(gasto);
  guardar();

  nuevoId = gasto.id;
  filtro = 'todas';
  mostrarFiltros();
  mostrarTodo();

  formulario.reset();
  actualizarEjemplo();
  cerrarPanel();
  if (navigator.vibrate) navigator.vibrate(15);
  aviso('Gasto guardado');
});

// ===== Notificaciones =====
let temporizador;
function aviso(texto, textoBoton, accion) {
  const toast = $('toast');
  toast.innerHTML = '';

  const mensaje = document.createElement('span');
  mensaje.textContent = texto;
  toast.appendChild(mensaje);

  if (accion) {
    const boton = document.createElement('button');
    boton.textContent = textoBoton;
    boton.onclick = () => {
      accion();
      toast.classList.remove('visible');
    };
    toast.appendChild(boton);
  }

  toast.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = setTimeout(() => toast.classList.remove('visible'), 4000);
}

// ===== Saludo según la hora =====
const hora = new Date().getHours();
$('saludo').textContent = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

// ===== Estado de conexión =====
function revisarConexion(avisar) {
  const enLinea = navigator.onLine;
  $('conexion').classList.toggle('offline', !enLinea);
  $('conexion').querySelector('span').textContent = enLinea ? 'En línea' : 'Sin conexión';
  if (avisar) {
    aviso(enLinea ? 'Conexión recuperada' : 'Sin conexión: tus gastos se guardan en este dispositivo');
  }
}
window.addEventListener('online', () => revisarConexion(true));
window.addEventListener('offline', () => revisarConexion(true));

// ===== PWA: registrar el Service Worker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ===== PWA: botón "Instalar" =====
let eventoInstalar = null;
const btnInstalar = $('btn-instalar');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  eventoInstalar = e;
  btnInstalar.hidden = false;
});

btnInstalar.addEventListener('click', () => {
  eventoInstalar.prompt();
  eventoInstalar = null;
  btnInstalar.hidden = true;
});

window.addEventListener('appinstalled', () => aviso('¡App instalada!'));

// ===== Inicio =====
revisarConexion(false);
mostrarFiltros();
mostrarTodo();
