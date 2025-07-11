const mongoose = require('mongoose');

const ToothSchema = new mongoose.Schema({
  numero: Number,
  estado: String,
  tratamiento: String,
  notas: String
}, { _id: false });

const MonthControlSchema = new mongoose.Schema({
  month: { type: String, required: true },
  attended: { type: Boolean, required: true }
}, { _id: false });

const YearControlSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  months: { type: [MonthControlSchema], required: true }
}, { _id: false });

const HistorialItemSchema = new mongoose.Schema({
  fecha: String,
  diagnostico: String,
  tratamiento: String,
  procedimiento: String,
  observaciones: String
}, { _id: false });

const PacienteSchema = new mongoose.Schema({
  nombre: String,
  rut: String,
  edad: Number,
  correo: String,
  telefono: String,
  historial: [HistorialItemSchema],
  odontograma: [ToothSchema],
  fichaOrtodoncia: {
    maloclusion: String,
    planTratamiento: String,
    duracion: String,
    controles: [String]
  },
  controles: [YearControlSchema],
  tieneConvenio: { type: Boolean, default: false },
  promocionDescuento: { type: String, default: '' }
});

module.exports = mongoose.model('Paciente', PacienteSchema);
