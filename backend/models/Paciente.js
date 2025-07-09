const mongoose = require('mongoose');

const ToothSchema = new mongoose.Schema({
  numero: Number,
  estado: String,
  tratamiento: String,
  notas: String
}, { _id: false });

const MonthControlSchema = new mongoose.Schema({
  month: String,
  attended: Boolean
}, { _id: false });

const YearControlSchema = new mongoose.Schema({
  year: Number,
  months: [MonthControlSchema]
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
  fechaNacimiento: Date,
  edad: Number,
  genero: String,
  telefono: String,
  email: String,

  // 👇 NUEVOS CAMPOS
  tieneConvenio: { type: Boolean, default: false },
  promocionDescuento: { type: String, default: '' },

  historial: [HistorialItemSchema],
  odontograma: [ToothSchema],
  fichaOrtodoncia: {
    maloclusion: String,
    planTratamiento: String,
    duracion: String,
    controles: [String]
  },
  controles: [YearControlSchema]
});


module.exports = mongoose.model('Paciente', PacienteSchema);