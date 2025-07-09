const mongoose = require('mongoose');

const InventarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, enum: ['material', 'medicamento', 'equipo'], default: 'material' },
  stock: { type: Number, default: 0 },
  stockMinimo: { type: Number, default: 5 },
  precio: { type: Number, default: 0 },
  fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inventario', InventarioSchema);