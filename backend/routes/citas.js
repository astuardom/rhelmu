const express = require('express');
const router = express.Router();
const Cita = require('../models/citas'); // Asegúrate de tener el modelo

// Obtener todas las citas
router.get('/', async (req, res) => {
  try {
    const citas = await Cita.find();
    res.json(citas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

// Crear cita
router.post('/', async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();
    res.status(201).json(nuevaCita);
  } catch (err) {
    console.error('❌ Error al guardar cita:', err.message);
    res.status(500).json({ error: err.message || 'Error al guardar cita' });
  }
});


// Editar cita
router.put('/:id', async (req, res) => {
  try {
    const citaActualizada = await Cita.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(citaActualizada);
  } catch (err) {
    res.status(500).json({ error: 'Error al editar cita' });
  }
});

module.exports = router;
