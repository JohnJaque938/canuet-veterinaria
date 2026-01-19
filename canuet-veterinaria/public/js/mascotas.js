console.log('mascotas.js cargado');

const userId = localStorage.getItem('userId');

if (!userId) {
  alert('Debes iniciar sesión');
  window.location.href = 'login.html';
}

const formMascota = document.getElementById('formMascota');
const contenedorMascotas = document.getElementById('contenedorMascotas');
const mensaje = document.getElementById('mensaje');
const mascotaIdInput = document.getElementById('mascotaId');
const tituloFormulario = document.getElementById('tituloFormulario');

// Crear la mascota del usuario
formMascota.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    nombre: nombre.value,
    especie: especie.value,
    raza: raza.value,
    edad: edad.value
  };

  const mascotaId = mascotaIdInput.value;
  const url = mascotaId ? `/api/mascotas/${mascotaId}` : '/api/mascotas';
  const method = mascotaId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  mensaje.textContent = result.msg;

  if (res.ok) {
    formMascota.reset();
    mascotaIdInput.value = '';
    tituloFormulario.textContent = 'Registrar Mascota';
    cargarMascotas();
  }
});

// Listar las mascotas del usuario
async function cargarMascotas() {
  const res = await fetch('/api/mascotas/mias', {
    headers: { 'x-user-id': userId }
  });

  const mascotas = await res.json();
  contenedorMascotas.innerHTML = '';

  mascotas.forEach(mascota => {
    const div = document.createElement('div');
    div.className = 'item-mascota';

    div.innerHTML = `
      <p><strong>Nombre:</strong> ${mascota.nombre}</p>
      <p><strong>Especie:</strong> ${mascota.especie}</p>
      <p><strong>Raza:</strong> ${mascota.raza}</p>
      <p><strong>Edad:</strong> ${mascota.edad} años</p>

      <div class="acciones-mascota">
        <button class="btn-editar" onclick="editarMascota('${mascota._id}')">Editar</button>
        <button class="btn-eliminar" onclick="eliminarMascota('${mascota._id}')">Eliminar</button>
        <button class="btn-cita" onclick="agendarCita('${mascota._id}')">Agendar cita</button>
      </div>
    `;
    contenedorMascotas.appendChild(div);
  });
}

// Editar la mascota del usuario seleccionada
async function editarMascota(id) {
  const res = await fetch(`/api/mascotas/${id}`, {
    headers: { 'x-user-id': userId }
  });

  const mascota = await res.json();

  mascotaIdInput.value = mascota._id;
  nombre.value = mascota.nombre;
  especie.value = mascota.especie;
  raza.value = mascota.raza;
  edad.value = mascota.edad;

  tituloFormulario.textContent = 'Editar Mascota';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eliminar la mascota del usuario
async function eliminarMascota(id) {
  if (!confirm('¿Deseas eliminar esta mascota?')) return;

  const res = await fetch(`/api/mascotas/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId }
  });

  const result = await res.json();
  alert(result.msg);

  if (res.ok) cargarMascotas();
}


// redireccionar a crear cita para agendar cita a la mascota
function agendarCita(mascotaId) {
  window.location.href = `crear-cita.html?mascotaId=${mascotaId}`;
}

// Iniciar
cargarMascotas();