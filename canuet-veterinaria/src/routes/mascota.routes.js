const express = require('express');
const router = express.Router();

const {
  crearMascota,
  obtenerMisMascotas,
  obtenerMascotaPorId,
  actualizarMascota,
  eliminarMascota
} = require('../controllers/mascota.controller');

const { autenticacionMiddleware } = require('../middlewares/autenticacion.middleware');

// Crear mascota (Usuario)
router.post('/', autenticacionMiddleware, crearMascota);

// Listar sus mascotas (Usuario)
router.get('/mias', autenticacionMiddleware, obtenerMisMascotas);

// Obtener una mascota (Usuario)
router.get('/:id', autenticacionMiddleware, obtenerMascotaPorId);

// Actualizar mascota (Usuario)
router.put('/:id', autenticacionMiddleware, actualizarMascota);

// Eliminar mascota (Usuario)
router.delete('/:id', autenticacionMiddleware, eliminarMascota);

module.exports = router;