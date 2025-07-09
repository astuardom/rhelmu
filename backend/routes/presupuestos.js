const express = require('express');
const router = express.Router();
const Presupuesto = require('../models/Presupuesto');

// POST - Guardar nuevo presupuesto
router.post('/', async (req, res) => {
  try {
    const nuevoPresupuesto = new Presupuesto(req.body);
    const guardado = await nuevoPresupuesto.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error al guardar presupuesto:", error);
    res.status(500).json({ mensaje: "Error al guardar presupuesto" });
  }
});

// GET - Obtener todos los presupuestos
router.get('/', async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find();
    res.json(presupuestos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener presupuestos" });
  }
});

// PUT - Actualizar un presupuesto existente
router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Presupuesto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar presupuesto:", error);
    res.status(500).json({ mensaje: "Error actualizando presupuesto" });
  }
});


module.exports = router;
