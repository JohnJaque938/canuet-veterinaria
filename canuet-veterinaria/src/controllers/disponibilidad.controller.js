const Disponibilidad = require('../models/disponibilidad');
const Cita = require('../models/cita');

// Crear disponibilidad (Solamente administrador)
exports.crearDisponibilidad = async (req, res) => {
  try {
    const disponibilidad = new Disponibilidad(req.body);
    await disponibilidad.save();

    res.status(201).json({ msg: 'Disponibilidad creada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear la disponibilidad' });
  }
};


// Listar o obtener las disponibilidades a los usuarios (Usuarios)
exports.obtenerDisponibilidades = async (req, res) => {
  try {
    const disponibilidades = await Disponibilidad.find({ disponible: true });
    res.json(disponibilidades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las disponibilidades' });
  }
};

// Eliminar disponibilidad (Solamente administrador)
exports.eliminarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;

    // Se verifica que exista la disponibilidad en el sitio
    const disponibilidad = await Disponibilidad.findById(id);
    if (!disponibilidad) {
      return res.status(404).json({ msg: 'Disponibilidad no encontrada' });
    }

    // Se verifica si está asociada a alguna cita dentro del sitio
    const citaExistente = await Cita.findOne({
      disponibilidad: id
    });

    if (citaExistente) {
      return res.status(400).json({
        msg: 'No puedes eliminar esta disponibilidad porque está asociada a una cita'
      });
    }

    // Se elimina la disponibilidad
    await Disponibilidad.findByIdAndDelete(id);

    res.json({ msg: 'Disponibilidad eliminada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la disponibilidad' });
  }
};