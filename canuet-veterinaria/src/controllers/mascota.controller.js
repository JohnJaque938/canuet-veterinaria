const Mascota = require('../models/mascota');
const Cita = require('../models/cita');

// Crear mascota
exports.crearMascota = async (req, res) => {
  try {
    const { nombre, especie, raza, edad } = req.body;

    const mascota = new Mascota({
      nombre,
      especie,
      raza,
      edad,
      propietario: req.usuario._id
    });

    await mascota.save();

    res.status(201).json({ msg: 'Mascota creada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear la mascota' });
  }
};

// listar las mascotas del usuario
exports.obtenerMisMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.find({
      propietario: req.usuario._id
    });

    res.json(mascotas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al listar las mascotas' });
  }
};

// Se obtiene las mascota del usuario por su ID
exports.obtenerMascotaPorId = async (req, res) => {
  try {
    const mascota = await Mascota.findOne({
      _id: req.params.id,
      propietario: req.usuario._id
    });

    if (!mascota) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    res.json(mascota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la mascota' });
  }
};

// Actualizar los datos de la mascota del usuario
exports.actualizarMascota = async (req, res) => {
  try {
    const mascotaId = req.params.id;

    // Se verifica que la mascota exista y sea del usuario en cuestión
    const mascota = await Mascota.findOne({
      _id: mascotaId,
      propietario: req.usuario._id
    });

    if (!mascota) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    // Se verifica si tiene citas asociadas la mascota
    const citaExistente = await Cita.findOne({
      mascota: mascotaId
    });

    if (citaExistente) {
      return res.status(400).json({
        msg: 'No puedes editar esta mascota porque tiene una o más citas registradas'
      });
    }

    // Se actualiza la mascota
    mascota.nombre = req.body.nombre;
    mascota.especie = req.body.especie;
    mascota.raza = req.body.raza;
    mascota.edad = req.body.edad;

    await mascota.save();

    res.json({ msg: 'Mascota actualizada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar la mascota' });
  }
};

// Eliminar la mascota del usuario
exports.eliminarMascota = async (req, res) => {
  try {
    const mascotaId = req.params.id;

    // Se verifica que la mascota exista y sea del usuario en cuestión
    const mascota = await Mascota.findOne({
      _id: mascotaId,
      propietario: req.usuario._id
    });

    if (!mascota) {
      return res.status(404).json({ msg: 'Mascota no encontrada' });
    }

    // Se verifica si tiene citas asociadas la mascota
    const citaExistente = await Cita.findOne({
      mascota: mascotaId
    });

    if (citaExistente) {
      return res.status(400).json({
        msg: 'No puedes eliminar esta mascota porque tiene una o más citas registradas'
      });
    }

    // Se elimina la mascota
    await Mascota.findByIdAndDelete(mascotaId);

    res.json({ msg: 'Mascota eliminada correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la mascota' });
  }
};