const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  // Nombre del usuario  
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  // Nombre de la mascota
  mascota: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mascota',
    required: true
  },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio',
    required: true
  },
  disponibilidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Disponibilidad',
    required: true
  },
  // Fecha de la cita
  fecha: {
    type: String,
    required: true
  },
  // Estado de la cita
  estado: {
    type: String,
    enum: ['PENDIENTE', 'APROBADA', 'CANCELADA'],
    // Por defecto debe estar en pendiente
    default: 'PENDIENTE'
  },
  // Fecha de creación de la cita
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cita', CitaSchema);