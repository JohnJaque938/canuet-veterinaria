const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  // Nombre del servicio  
  nombre: {
    type: String,
    required: true
  },
  // descripción del servicio
  descripcion: {
    type: String,
    required: true
  },
  // precio del servicio
  precio: {
    type: Number,
    required: true
  },
  // Estado del servicio
  activo: {
    type: Boolean,
    default: true
  }
}, 
{
    // Fecha de creación o modificación del servicio  
    timestamps: true
});

module.exports = mongoose.model('Servicio', servicioSchema);