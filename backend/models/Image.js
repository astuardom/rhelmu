const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  url: { type: String, required: true },
  tipo: String,
  fecha: Date,
  notas: String
});

module.exports = mongoose.model('Image', imageSchema);
