const express = require('express');
const router = express.Router();

const {
  crearServicio,
  obtenerServicios,
  actualizarServicio,
  eliminarServicio
} = require('../controllers/servicio.controller');

const { autenticacionMiddleware } = require('../middlewares/autenticacion.middleware');
const { adminMiddleware } = require('../middlewares/rol.middleware');

// Listar servicios (Solo usuarios)
router.get('/', obtenerServicios);

// Crear servicio (Solo administrador)
router.post(
  '/',
  autenticacionMiddleware,
  adminMiddleware,
  crearServicio
);
// Actualizar servicio (Solo administrador)
router.put(
  '/:id',
  autenticacionMiddleware,
  adminMiddleware,
  actualizarServicio
);
// Eliminar servicio (Solo administrador)
router.delete(
  '/:id',
  autenticacionMiddleware,
  adminMiddleware,
  eliminarServicio
);

module.exports = router;