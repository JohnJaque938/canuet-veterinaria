require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const autenticacionRoutes = require('./routes/autenticacion.routes');
const citaRoutes = require('./routes/cita.routes');
const mascotaRoutes = require('./routes/mascota.routes');
const servicioRoutes = require('./routes/servicio.routes');
const disponibilidadRoutes = require('./routes/disponibilidad.routes');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend
app.use(express.static('public'));

// Conexión a MongoDB
connectDB();

// Rutas API
app.use('/api/autenticacion', autenticacionRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/disponibilidad', disponibilidadRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});