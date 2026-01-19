const Usuario = require('../models/usuario');

exports.autenticacionMiddleware = async (req, res, next) => {
  try {
    const usuarioId = req.header('x-user-id');

    if (!usuarioId) {
      return res.status(401).json({ msg: 'No autenticado' });
    }

    const usuario = await Usuario.findById(usuarioId)
      .populate('rol')
      .select('-password');

    if (!usuario || !usuario.rol) {
      return res.status(401).json({ msg: 'Usuario no válido' });
    }

    req.usuario = usuario;
    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error de autenticación' });
  }
};