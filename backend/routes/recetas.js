const express = require('express');
const router = express.Router();
const Receta = require('../models/Receta');

// POST - guardar nueva receta
router.post('/', async (req, res) => {
  try {
    console.log('📩 Datos recibidos para nueva receta:', req.body); // 👈 Muestra lo que llega
    const receta = new Receta(req.body);
    await receta.save();
    console.log('✅ Receta guardada:', receta); // 👈 Confirma que se guardó
    res.status(201).json(receta);
  } catch (err) {
    console.error('❌ Error al guardar receta:', err); // 👈 Muestra el error real
    res.status(500).json({ error: 'Error al guardar receta' });
  }
});

// GET - obtener recetas por paciente
router.get('/paciente/:id', async (req, res) => {
  try {
    const recetas = await Receta.find({ pacienteId: req.params.id });
    res.json(recetas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

// GET - obtener todas las recetas
router.get('/', async (req, res) => {
  try {
    const recetas = await Receta.find();
    res.json(recetas);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener recetas' });
  }
});

module.exports = router;
