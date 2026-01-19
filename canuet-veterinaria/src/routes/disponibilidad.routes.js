const express = require('express');
const router = express.Router();

const {
  crearDisponibilidad,
  obtenerDisponibilidades,
  eliminarDisponibilidad
} = require('../controllers/disponibilidad.controller');

const { autenticacionMiddleware } = require('../middlewares/autenticacion.middleware');
const { adminMiddleware } = require('../middlewares/rol.middleware');

// Crear disponibilidad (Solamente admin)
router.post(
  '/',
  autenticacionMiddleware,
  adminMiddleware,
  crearDisponibilidad
);

// Eliminar disponibilidad (Solamente admin)
router.delete(
  '/:id',
  autenticacionMiddleware,
  adminMiddleware,
  eliminarDisponibilidad
);

// Listar disponibilidad (Usuarios)
router.get('/', obtenerDisponibilidades);

module.exports = router;