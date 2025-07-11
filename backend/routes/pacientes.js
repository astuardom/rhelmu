const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');

// Obtener todos los pacientes
router.get('/', async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

// Crear nuevo paciente
router.post('/', async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    await paciente.save();
    res.status(201).json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Editar paciente completo
router.put('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar odontograma
router.patch('/:id/odontograma', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });

    paciente.odontograma = req.body.odontograma;
    await paciente.save();
    res.json(paciente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Actualizar historial de controles
router.patch('/:id/controles', async (req, res) => {
  try {
    const { controles } = req.body;

    if (!Array.isArray(controles)) {
      return res.status(400).json({ error: 'Formato inválido: controles debe ser un arreglo' });
    }

    // Validación estructura de controles
    for (const c of controles) {
      if (typeof c.year !== 'number' || !Array.isArray(c.months)) {
        return res.status(400).json({ error: 'Estructura incorrecta en controles' });
      }
      for (const m of c.months) {
        if (typeof m.month !== 'string' || typeof m.attended !== 'boolean') {
          return res.status(400).json({ error: 'Datos inválidos en meses de control' });
        }
      }
    }

    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    paciente.controles = controles;
    await paciente.save();

    res.status(200).json(paciente);
  } catch (err) {
    console.error('❌ Error en PATCH /pacientes/:id/controles:', err);
    res.status(500).json({ error: 'Error interno al actualizar controles' });
  }
});

// Eliminar paciente
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
