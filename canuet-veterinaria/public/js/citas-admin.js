console.log('citas-admin.js cargado');

// Solamente un administrador puede entra a esta sección
const userId = localStorage.getItem('userId');
const rol = localStorage.getItem('rol');

if (!userId || rol !== 'ADMIN') {
  window.location.href = 'login.html';
}

const tabla = document.getElementById('tablaCitas');
const mensaje = document.getElementById('mensaje');

// Formato fecha CL (Chilena)
function formatFechaChile(fecha) {
  if (!fecha) return '—';
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}-${mes}-${anio}`;
}

// Estado de la cita
function estadoClase(estado) {
  if (estado === 'APROBADA') return 'estado-aprobada';
  if (estado === 'CANCELADA') return 'estado-cancelada';
  return 'estado-pendiente';
}

// Cargar citas
async function cargarCitas() {
  const res = await fetch('/api/citas', {
    headers: { 'x-user-id': userId }
  });

  const citas = await res.json();
  tabla.innerHTML = '';

  citas.forEach(cita => {
    const tr = document.createElement('tr');

    const horario = cita.disponibilidad
      ? `${cita.disponibilidad.horaInicio} - ${cita.disponibilidad.horaFin}`
      : '—';

    tr.innerHTML = `
      <td>${cita.usuario?.nombre || '—'}</td>
      <td>${cita.mascota?.nombre || '—'}</td>
      <td>${cita.servicio?.nombre || '—'}</td>
      <td>${formatFechaChile(cita.fecha)}</td>
      <td>${horario}</td>
      <td class="${estadoClase(cita.estado)}">${cita.estado}</td>
      <td>
        <button class="btn-aprobar" onclick="actualizarEstado('${cita._id}', 'APROBADA')">Aprobar</button>
        <button class="btn-cancelar" onclick="actualizarEstado('${cita._id}', 'CANCELADA')">Cancelar</button>
        <button class="btn-eliminar" onclick="eliminarCita('${cita._id}')">Eliminar</button>
      </td>
    `;

    tabla.appendChild(tr);
  });
}

// Actualizar estado de la cita
async function actualizarEstado(id, estado) {
  const res = await fetch(`/api/citas/${id}/estado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId
    },
    body: JSON.stringify({ estado })
  });

  const data = await res.json();
  mensaje.textContent = data.msg;
  cargarCitas();
}

// Eliminar la cita
async function eliminarCita(id) {
  if (!confirm('¿Eliminar esta cita?')) return;

  const res = await fetch(`/api/citas/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId }
  });

  const data = await res.json();
  mensaje.textContent = data.msg;
  cargarCitas();
}

// Iniciar
cargarCitas();