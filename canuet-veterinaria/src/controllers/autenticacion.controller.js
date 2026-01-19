const Usuario = require('../models/usuario');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');

// Registrar el usuario dentro del sitio
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    const rolUsuario = await Rol.findOne({ name: 'USER' });
    if (!rolUsuario) {
      return res.status(500).json({
        msg: 'Rol USER no existe. Debe ejecutarse el seed.'
      });
    }

    const passwordHasheada = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHasheada,
      rol: rolUsuario._id
    });

    await nuevoUsuario.save();

    res.status(201).json({
      msg: 'Usuario registrado correctamente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al registrar el usuario'
    });
  }
};

// Iniciar sesión dentro del sitio
exports.iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).populate('rol');
    if (!usuario || !usuario.rol) {
      return res.status(400).json({ msg: 'Usuario o rol inválido' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    res.json({
      userId: usuario._id,
      nombre: usuario.nombre,
      rol: usuario.rol.name
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al iniciar sesión'
    });
  }
};