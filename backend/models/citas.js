const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: [true, 'La fecha es obligatoria'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)']
  },
  hora: {
    type: String,
    required: [true, 'La hora es obligatoria'],
    match: [/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:MM en 24h)']
  },
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente', // <-- Asegúrate de que coincide con tu modelo real
    required: [true, 'El paciente es obligatorio']
  },
  motivo: {
    type: String,
    required: [true, 'El motivo es obligatorio'],
    trim: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
    default: 'pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Cita', citaSchema);
