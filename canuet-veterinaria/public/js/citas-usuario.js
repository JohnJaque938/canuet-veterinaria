console.log('citas-usuario.js cargado');

const userId = localStorage.getItem('userId');
if (!userId) {
  alert('Debes iniciar sesión');
  window.location.href = 'login.html';
}

const seleccionarMascota = document.getElementById('seleccionarMascota');
const seleccionarServicio = document.getElementById('seleccionarServicio');
const seleccionarDisponibilidad = document.getElementById('seleccionarDisponibilidad');
const tablaCitas = document.getElementById('tablaCitas');
const mensaje = document.getElementById('mensaje');
const form = document.getElementById('citaForm');

// ID de la mascota desde Url
const params = new URLSearchParams(window.location.search);
const mascotaIdURL = params.get('mascotaId');

// Formato fecha CL (Chilena)
const formatoFecha = fecha => {
  const [anio, mes, dia] = fecha.split('T')[0].split('-');
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CL');
};

// Listar mascotas del usuario
async function cargarMascotas() {
  const res = await fetch('/api/mascotas/mias', {
    headers: { 'x-user-id': userId }
  });

  const mascotas = await res.json();
  seleccionarMascota.innerHTML = '<option value="">Seleccione Mascota</option>';

  mascotas.forEach(m => {
    const option = document.createElement('option');
    option.value = m._id;
    option.textContent = m.nombre;
    seleccionarMascota.appendChild(option);
  });

  if (mascotaIdURL) {
    seleccionarMascota.value = mascotaIdURL;
  }
}

// Cargar servicios
async function cargarServicios() {
  const res = await fetch('/api/servicios');
  const servicios = await res.json();

  seleccionarServicio.innerHTML = '<option value="">Seleccione Servicio</option>';

  servicios.forEach(s => {
    const option = document.createElement('option');
    option.value = s._id;
    option.textContent = s.nombre;
    seleccionarServicio.appendChild(option);
  });
}

// Cargar las disponibilidades
async function cargarDisponibilidad() {
  const res = await fetch('/api/disponibilidad');
  const horarios = await res.json();

  seleccionarDisponibilidad.innerHTML = '<option value="">Seleccione Horario</option>';

  horarios
    .filter(h => h.disponible)
    .forEach(h => {
      const option = document.createElement('option');
      option.value = h._id;
      option.textContent = `${formatoFecha(h.fecha)} ${h.horaInicio} - ${h.horaFin}`;
      seleccionarDisponibilidad.appendChild(option);
    });
}

// Crear una cita
form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    mascota: seleccionarMascota.value,
    servicio: seleccionarServicio.value,
    disponibilidad: seleccionarDisponibilidad.value
  };

  const res = await fetch('/api/citas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  mensaje.textContent = result.msg;

  if (res.ok) {
    form.reset();
    cargarDisponibilidad();
    cargarCitas();
  }
});

// Listar cita (Responsive)
async function cargarCitas() {
  const res = await fetch('/api/citas/mias', {
    headers: { 'x-user-id': userId }
  });

  const citas = await res.json();
  tablaCitas.innerHTML = '';

  if (citas.length === 0) {
    tablaCitas.innerHTML = `
      <tr>
        <td colspan="5">No tienes citas registradas</td>
      </tr>`;
    return;
  }

  citas.forEach(c => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td data-label="Mascota">${c.mascota.nombre}</td>
      <td data-label="Servicio">${c.servicio.nombre}</td>
      <td data-label="Fecha">${formatoFecha(c.disponibilidad.fecha)}</td>
      <td data-label="Horario">${c.disponibilidad.horaInicio} - ${c.disponibilidad.horaFin}</td>
      <td data-label="Estado" class="estado-${c.estado.toLowerCase()}">${c.estado}</td>
    `;

    tablaCitas.appendChild(tr);
  });
}

// Iniciar
(async () => {
  await cargarMascotas();
  await cargarServicios();
  await cargarDisponibilidad();
  await cargarCitas();
})();