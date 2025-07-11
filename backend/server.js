const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch((err) => console.error('❌ Error de conexión:', err));

// Rutas API
app.use('/api/pacientes', require('./routes/pacientes'));
app.use('/api/imagenes', require('./routes/imagenes'));
app.use('/api/recetas', require('./routes/recetas'));
app.use('/api/recordatorios', require('./routes/reminders'));
app.use('/api/citas', require('./routes/citas'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api', require('./routes/auth')); // 🔐 Login & Registro
app.use('/api/presupuestos', require('./routes/presupuestos'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 API de Clínica funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT} ✅`);
});
