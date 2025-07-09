const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Image = require('../models/Image');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST - subir imagen
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const nuevaImagen = new Image({
      patientId: req.body.patientId,
      url: `/uploads/${req.file.filename}`,
      tipo: req.body.tipo || 'clínica',
      fecha: new Date(),
      notas: req.body.notas || ''
    });
    await nuevaImagen.save();
    res.status(201).json(nuevaImagen);
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la imagen' });
  }
});

// GET - obtener todas las imágenes de un paciente
router.get('/paciente/:patientId', async (req, res) => {
  try {
    const imagenes = await Image.find({ patientId: req.params.patientId });
    res.json(imagenes);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener imágenes del paciente' });
  }
});


// PUT - actualizar imagen
router.put('/:id', async (req, res) => {
  try {
    const imagen = await Image.findByIdAndUpdate(req.params.id, {
      tipo: req.body.tipo,
      notas: req.body.notas
    }, { new: true });
    res.json(imagen);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la imagen' });
  }
});

// DELETE - eliminar imagen
router.delete('/:id', async (req, res) => {
    try {
      const imagen = await Image.findById(req.params.id);
      if (!imagen) return res.status(404).json({ error: 'No encontrada' });
  
      const filePath = path.resolve(__dirname, '..', imagen.url.replace(/^\\|\\|^\//, ''));
      console.log('🔍 Eliminando imagen en:', filePath);
  
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn('⚠️ Archivo físico no encontrado en el sistema de archivos');
      }
  
      await imagen.deleteOne();
  
      res.json({ message: '✅ Imagen eliminada' });
    } catch (err) {
      console.error('❌ Error al eliminar imagen:', err);
      res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
  });
  

module.exports = router;
