console.log('disponibilidad.js cargado');

// Solamente un administrador puede entra a esta sección
const userId = localStorage.getItem('userId');
const rol = localStorage.getItem('rol');

if (!userId || rol !== 'ADMIN') {
  window.location.href = '/login.html';
}

const form = document.getElementById('disponibilidadForm');
const mensaje = document.getElementById('mensaje');
const tabla = document.getElementById('tablaDisponibilidad');

// Formato fecha CL (Chilena)
function formatearFecha(fechaISO) {
  const [y, m, d] = fechaISO.split('-');
  return `${d}-${m}-${y}`;
}

// Cargar disponibilidad
async function cargarDisponibilidad() {
  const res = await fetch('/api/disponibilidad');
  const data = await res.json();

  tabla.innerHTML = '';

  data.forEach(d => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${formatearFecha(d.fecha)}</td>
      <td>${d.horaInicio} - ${d.horaFin}</td>
      <td>
        <button class="btn-eliminar" onclick="eliminarDisponibilidad('${d._id}')">
          Eliminar
        </button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Crear disponibilidad
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    fecha: fecha.value,
    horaInicio: horaInicio.value,
    horaFin: horaFin.value
  };

  const res = await fetch('/api/disponibilidad', {
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
  }
});

// Eliminar disponibilidad
async function eliminarDisponibilidad(id) {
  if (!confirm('¿Eliminar disponibilidad?')) return;

  const res = await fetch(`/api/disponibilidad/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId }
  });

  const result = await res.json();
  mensaje.textContent = result.msg;
  cargarDisponibilidad();
}

// Iniciar
cargarDisponibilidad();