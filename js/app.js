function mostrarSaludo() {
  const hora = new Date().getHours();
  let saludo = 'Buenas noches';
  if (hora < 12) {
    saludo = 'Buenos días';
  } else if (hora < 19) {
    saludo = 'Buenas tardes';
  }
  document.getElementById('saludo').textContent = saludo;
}

mostrarSaludo();
revisarConexion();
mostrarCategoriasDelFormulario();
cambiarEjemplo();
mostrarFiltros();
mostrarTodo();
