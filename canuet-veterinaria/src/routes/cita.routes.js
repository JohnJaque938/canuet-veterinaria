const express = require('express');
const router = express.Router();

const {
  crearCita,
  obtenerMisCitas,
  obtenerCitas,
  actualizarEstadoCita,
  eliminarCita
} = require('../controllers/cita.controller');

const { autenticacionMiddleware } = require('../middlewares/autenticacion.middleware');
const { adminMiddleware } = require('../middlewares/rol.middleware');


// Usuarios
// Crear una cita
router.post(
  '/',
  autenticacionMiddleware,
  crearCita
);

// Listar sus citas
router.get(
  '/mias',
  autenticacionMiddleware,
  obtenerMisCitas
);

// Administrador
// Listar todas las citas disponibles
router.get(
  '/',
  autenticacionMiddleware,
  adminMiddleware,
  obtenerCitas
);

// Aprobar o cancelar la cita
router.put(
  '/:id/estado',
  autenticacionMiddleware,
  adminMiddleware,
  actualizarEstadoCita
);

// Eliminar la cita
router.delete(
  '/:id',
  autenticacionMiddleware,
  adminMiddleware,
  eliminarCita
);

module.exports = router;