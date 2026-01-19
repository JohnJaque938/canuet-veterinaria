exports.adminMiddleware = (req, res, next) => {
  if (
    !req.usuario ||
    !req.usuario.rol ||
    req.usuario.rol.name !== 'ADMIN'
  ) {
    return res.status(403).json({
      msg: 'Acceso solo para administradores'
    });
  }

  next();
};