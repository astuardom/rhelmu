// models/usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  clave: { type: String, required: true }, // 👈 necesario
  rol: { type: String, enum: ['doctor', 'contador', 'asistente', 'admin'], default: 'asistente' }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
