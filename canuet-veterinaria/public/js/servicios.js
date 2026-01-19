console.log('servicio.js cargado');

// Solamente un administrador puede entra a esta sección
const userId = localStorage.getItem('userId');
const rol = localStorage.getItem('rol');

if (!userId || rol !== 'ADMIN') {
  window.location.href = '/login.html';
}

const form = document.getElementById('servicioForm');
const tabla = document.getElementById('tablaServicios');
const mensaje = document.getElementById('mensaje');

const servicioId = document.getElementById('servicioId');
const nombre = document.getElementById('nombre');
const descripcion = document.getElementById('descripcion');
const precio = document.getElementById('precio');

// 📋 Listar los servicios
async function cargarServicios() {
  const res = await fetch('/api/servicios');
  const servicios = await res.json();

  tabla.innerHTML = '';

  servicios.forEach(s => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${s.nombre}</td>
      <td>${s.descripcion || '—'}</td>
      <td>$${s.precio}</td>
      <td>
        <button class="btn-editar"
          onclick="editarServicio('${s._id}', '${s.nombre}', '${s.descripcion}', ${s.precio})">
          Editar
        </button>
        <button class="btn-eliminar"
          onclick="eliminarServicio('${s._id}')">
          Eliminar
        </button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

// Guardar el servicio
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    precio: Number(precio.value)
  };

  let url = '/api/servicios';
  let method = 'POST';

  if (servicioId.value) {
    url = `/api/servicios/${servicioId.value}`;
    method = 'PUT';
  }

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

  limpiarFormulario();
  cargarServicios();
});

// Editar el servicio
function editarServicio(id, nom, desc, prec) {
  servicioId.value = id;
  nombre.value = nom;
  descripcion.value = desc !== 'null' ? desc : '';
  precio.value = prec;
}

// Eliminar el servicio
async function eliminarServicio(id) {
  if (!confirm('¿Eliminar este servicio?')) return;

  const res = await fetch(`/api/servicios/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': userId }
  });

  const result = await res.json();
  mensaje.textContent = result.msg;
  cargarServicios();
}

// Limpiar el formulario cuando se allá creado el servicio
function limpiarFormulario() {
  servicioId.value = '';
  nombre.value = '';
  descripcion.value = '';
  precio.value = '';
}

// Iniciar
cargarServicios();