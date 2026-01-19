console.log('registro.js cargado');

const formularioRegistro = document.getElementById('formRegistro');
const mensaje = document.getElementById('mensaje');

formularioRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  try {
    const response = await fetch('/api/autenticacion/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre,
        email: correo,
        password: contrasena
      })
    });

    const data = await response.json();

    mensaje.textContent = data.msg;
    mensaje.style.color = response.ok ? 'green' : 'red';

    // Redirigir al login si se registró correctamente el usuario
    if (response.ok) {
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
    }

  } catch (error) {
    console.error(error);
    mensaje.textContent = 'Error de conexión con el servidor';
    mensaje.style.color = 'red';
  }
});