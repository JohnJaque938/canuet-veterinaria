const mongoose = require('mongoose');

const disponibilidadSchema = new mongoose.Schema({
  // Fecha de la disponibilidad  
  fecha: {
    type: String,
    required: true
  },
  // Hora de inicio
  horaInicio: {
    type: String,
    required: true
  },
  // Hora de termino
  horaFin: {
    type: String,
    required: true
  },
  // Estado de la disponibilidad
  disponible: {
    type: Boolean,
    default: true
  }
}, 
{
  // Fecha de creación o modificación de la disponibilidad 
  timestamps: true
});

module.exports = mongoose.model('Disponibilidad', disponibilidadSchema, 'disponibilidad');