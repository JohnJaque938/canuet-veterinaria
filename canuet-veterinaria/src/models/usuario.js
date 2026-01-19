const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  // Nombre del usuario  
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  // Correo del usuario
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  // Contraseña del usuario
  password: {
    type: String,
    required: true
  },
  // Rol del usuario
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol',
    required: true
  },
  // Fecha de creación del usuario
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);