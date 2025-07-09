const mongoose = require('mongoose');

const MedicamentoSchema = new mongoose.Schema({
  nombre: String,
  dosis: String,
  frecuencia: String,
  duracion: String
});

const RecetaSchema = new mongoose.Schema({
  pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  fecha: { type: Date, default: Date.now },
  medicamentos: [MedicamentoSchema],
  indicaciones: String,
  profesional: String,
  vigencia: { type: Number, default: 30 }
});

module.exports = mongoose.model('Receta', RecetaSchema);