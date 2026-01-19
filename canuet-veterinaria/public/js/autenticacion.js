console.log('autenticacion.js cargado');

const formularioLogin = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');

formularioLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const contrasena = document.getElementById('contrasena').value;

  try {
    const response = await fetch('/api/autenticacion/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: correo,
        password: contrasena
      })
    });

    const data = await response.json();

    if (!response.ok) {
      mensaje.textContent = data.msg;
      return;
    }

    // Guardar sesión
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('nombre', data.nombre);

    // Redireccionar según su rol
    if (data.rol === 'ADMIN') {
      window.location.href = '/admin-citas.html';
    } else {
      window.location.href = '/crear-mascota.html';
    }

  } catch (error) {
    console.error(error);
    mensaje.textContent = 'Error al iniciar sesión';
  }
});