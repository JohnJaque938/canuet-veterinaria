const Cita = require('../models/cita');
const Disponibilidad = require('../models/disponibilidad');

// Crear citas (Solamente usuario)
exports.crearCita = async (req, res) => {
  try {
    const usuario = req.usuario._id;
    const { mascota, servicio, disponibilidad } = req.body;

    const disponibilidadExiste = await Disponibilidad.findById(disponibilidad);

    if (!disponibilidadExiste || !disponibilidadExiste.disponible) {
      return res.status(400).json({ msg: 'Horario no disponible' });
    }

    const citaExistente = await Cita.findOne({ disponibilidad });
    if (citaExistente) {
      return res.status(400).json({ msg: 'Este horario ya tiene una cita asignada' });
    }

    const cita = new Cita({
      usuario,
      mascota,
      servicio,
      disponibilidad,
      fecha: disponibilidadExiste.fecha,
      estado: 'PENDIENTE'
    });

    await cita.save();

    disponibilidadExiste.disponible = false;
    await disponibilidadExiste.save();

    res.status(201).json({ msg: 'Cita solicitada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear la cita' });
  }
};

// Listar las citas del usuario
exports.obtenerMisCitas = async (req, res) => {
  try {
    const usuario = req.usuario._id;

    const citas = await Cita.find({ usuario })
      .populate('mascota', 'nombre')
      .populate('servicio', 'nombre')
      .populate('disponibilidad', 'fecha horaInicio horaFin')
      .sort({ createdAt: -1 });

    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener mis citas' });
  }
};

// Obtener las citas (Solamente Administrador)
exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('usuario', 'nombre email')
      .populate('mascota', 'nombre')
      .populate('servicio', 'nombre')
      .populate('disponibilidad', 'fecha horaInicio horaFin');

    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las citas' });
  }
};

// Actulizar estado de la cita (Solamente administrador)
exports.actualizarEstadoCita = async (req, res) => {
  try {
    const { estado } = req.body;
    const { id } = req.params;

    if (!['APROBADA', 'CANCELADA'].includes(estado)) {
      return res.status(400).json({ msg: 'Estado no válido' });
    }

    const cita = await Cita.findById(id);
    if (!cita) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }

    cita.estado = estado;
    await cita.save();

    // Si se cancela, se debe liberar la disponibilidad
    if (estado === 'CANCELADA') {
      await Disponibilidad.findByIdAndUpdate(
        cita.disponibilidad,
        { disponible: true }
      );
    }

    res.json({ msg: `Cita ${estado.toLowerCase()} correctamente` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el estado' });
  }
};

// Eliminar la cita (Solamente administrador)
exports.eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findById(id);
    if (!cita) {
      return res.status(404).json({ msg: 'Cita no encontrada' });
    }

    await Disponibilidad.findByIdAndUpdate(
      cita.disponibilidad,
      { disponible: true }
    );

    await cita.deleteOne();

    res.json({ msg: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la cita' });
  }
};