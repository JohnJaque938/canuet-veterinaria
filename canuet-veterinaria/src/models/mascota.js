const mongoose = require('mongoose');

const MascotaSchema = new mongoose.Schema({
   // Nombre de la mascota 
  nombre: {
    type: String,
    required: true
  },
  // Especie de la mascota
  especie: {
    type: String,
    required: true
  },
  // Raza de la mascota
  raza: {
    type: String,
    required: true
  },
  // Edad de la mascota
  edad: {
    type: Number,
    required: true
  },
  // dueño de la mascota
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Fecha de la creación de la mascota
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Mascota', MascotaSchema);