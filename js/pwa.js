const btnInstalar = document.getElementById('btn-instalar');
let eventoInstalar = null;

function revisarConexion() {
  const conexion = document.getElementById('conexion');
  if (navigator.onLine) {
    conexion.classList.remove('offline');
    conexion.querySelector('span').textContent = 'En línea';
  } else {
    conexion.classList.add('offline');
    conexion.querySelector('span').textContent = 'Sin conexión';
  }
}

window.addEventListener('online', function () {
  revisarConexion();
  mostrarAviso('Conexión recuperada');
});

window.addEventListener('offline', function () {
  revisarConexion();
  mostrarAviso('Sin conexión: tus gastos se guardan en este dispositivo');
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

window.addEventListener('beforeinstallprompt', function (evento) {
  evento.preventDefault();
  eventoInstalar = evento;
  btnInstalar.hidden = false;
});

btnInstalar.addEventListener('click', function () {
  eventoInstalar.prompt();
  eventoInstalar = null;
  btnInstalar.hidden = true;
});

window.addEventListener('appinstalled', function () {
  mostrarAviso('¡App instalada!');
});
