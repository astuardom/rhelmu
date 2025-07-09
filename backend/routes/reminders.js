const express = require('express');
const Reminder = require('../models/Reminder');
const router = express.Router();

router.get('/:patientId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ patientId: req.params.patientId }).sort({ date: 1, time: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener recordatorios' });
  }
});

router.post('/', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear recordatorio' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar recordatorio' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar recordatorio' });
  }
});

module.exports = router;
