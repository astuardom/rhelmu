const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  tratamiento: String,
  cantidad: Number,
  precio: Number,
  diente: String,
  subtotal: Number
}, { _id: false });

const PresupuestoSchema = new mongoose.Schema({
  paciente: {
    nombre: String,
    rut: String,
    email: String,
    telefono: String
  },
  fecha: String,
  items: [ItemSchema],
  descuento: Number,
  notas: String,
  estado: {
    type: String,
    default: 'pendiente'
  },
  confirmado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Presupuesto', PresupuestoSchema);
