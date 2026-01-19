const Servicio = require('../models/servicio');
const Cita = require('../models/cita');

// Crear servicio (Solamente admin)
exports.crearServicio = async (req, res) => {
  try {
    const servicio = new Servicio(req.body);
    await servicio.save();

    res.status(201).json({ msg: 'Servicio creado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el servicio' });
  }
};


// Listar los servicios (Usuarios)
exports.obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.json(servicios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los servicios' });
  }
};

// Actualizar servicios (Solamente admin)
exports.actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Se verifica que el servicio exista dentro del sitio
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ msg: 'Servicio no encontrado' });
    }

    // Se verifica si el servicio está asociado a alguna cita
    const citaExistente = await Cita.findOne({
      servicio: id
    });

    if (citaExistente) {
      return res.status(400).json({
        msg: 'No puedes editar este servicio porque está asociado a una o más citas'
      });
    }

    // Se actualiza el servicio dentro del sitio
    await Servicio.findByIdAndUpdate(id, req.body);

    res.json({ msg: 'Servicio actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el servicio' });
  }
};

// Eliminar servicio (Solamente admin)
exports.eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;

    // Se verifica que el servicio exista dentro del sitio
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ msg: 'Servicio no encontrado' });
    }

    // Se verifica si el servicio está asociado a una cita
    const citaExistente = await Cita.findOne({
      servicio: id
    });

    if (citaExistente) {
      return res.status(400).json({
        msg: 'No puedes eliminar este servicio porque está asociado a una o más citas'
      });
    }

    // Se elimina servicio dentro del sitio
    await Servicio.findByIdAndDelete(id);

    res.json({ msg: 'Servicio eliminado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el servicio' });
  }
};