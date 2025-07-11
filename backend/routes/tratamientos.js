const express = require('express');
const router = express.Router();
const Tratamiento = require('../models/Tratamiento');

// Obtener todos
router.get('/', async (req, res) => {
  const tratamientos = await Tratamiento.find();
  res.json(tratamientos);
});

// Subir CSV (parseado desde frontend)
router.post('/import', async (req, res) => {
  const tratamientos = req.body; // Array [{ nombre, precio }]
  try {
    await Tratamiento.deleteMany(); // Limpiar si deseas reemplazar
    await Tratamiento.insertMany(tratamientos);
    const all = await Tratamiento.find(); // ← traer todos los tratamientos
    res.json(all); // ← devolver todos al frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un tratamiento por ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Tratamiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un tratamiento por ID
router.delete('/:id', async (req, res) => {
  try {
    await Tratamiento.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
