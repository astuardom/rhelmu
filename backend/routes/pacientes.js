const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');

router.get('/', async (req, res) => {
  const pacientes = await Paciente.find();
  res.json(pacientes);
});

router.post('/', async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    await paciente.save();
    res.status(201).json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/odontograma', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    paciente.odontograma = req.body.odontograma;
    await paciente.save();
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/controles', async (req, res) => {
  try {
    const { controles } = req.body;

    console.log('🟡 Controles recibidos:', controles);

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) {
      console.log("⚠️ Paciente no encontrado con ID:", req.params.id);
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    console.log('🟢 Paciente encontrado:', paciente.nombre);

    paciente.controles = controles;

    console.log('🔵 Guardando paciente con nuevos controles...');
    const saved = await paciente.save();
    console.log('✅ Guardado exitoso:', saved);

    res.status(200).json(saved);
  } catch (err) {
    console.error('❌ Error en PATCH /pacientes/:id/controles:', err);
    res.status(500).json({ error: 'Error interno al actualizar controles' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar ficha ortodoncia
router.patch('/:id/ficha-ortodoncia', async (req, res) => {
  try {
    const updated = await Paciente.findByIdAndUpdate(
      req.params.id,
      { fichaOrtodoncia: req.body.fichaOrtodoncia },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('Error actualizando ficha ortodoncia:', err);
    res.status(500).send('Error actualizando ficha ortodoncia');
  }
});

module.exports = router;