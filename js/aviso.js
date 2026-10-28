const toast = document.getElementById('toast');
let temporizador;

function mostrarAviso(texto, textoBoton, alHacerClic) {
  toast.innerHTML = '';

  const mensaje = document.createElement('span');
  mensaje.textContent = texto;
  toast.appendChild(mensaje);

  if (textoBoton) {
    const boton = document.createElement('button');
    boton.textContent = textoBoton;
    boton.addEventListener('click', function () {
      alHacerClic();
      toast.classList.remove('visible');
    });
    toast.appendChild(boton);
  }

  toast.classList.add('visible');
  clearTimeout(temporizador);
  temporizador = setTimeout(function () {
    toast.classList.remove('visible');
  }, 4000);
}
