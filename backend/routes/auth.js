const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const JWT_SECRET = 'secreto_super_seguro'; // Idealmente en .env

// Login con nombre
router.post('/login', async (req, res) => {
  const { nombre, clave } = req.body;

  try {
    const user = await Usuario.findOne({ nombre });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(clave, user.clave);
    if (!valid) return res.status(401).json({ error: 'Clave incorrecta' });

    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, { expiresIn: '2h' });
    res.json({
      token,
      usuario: { nombre: user.nombre, rol: user.rol }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
