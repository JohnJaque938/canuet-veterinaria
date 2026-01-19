const express = require('express');
const router = express.Router();

const autenticacionController = require('../controllers/autenticacion.controller');

// Registro de usuario
router.post('/registro', autenticacionController.registrarUsuario);

// Inicio de sesión del usuario
router.post('/login', autenticacionController.iniciarSesion);

module.exports = router;