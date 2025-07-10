import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const RecipeEditor = ({ patient, onSaveRecipe }) => {
  const [recipe, setRecipe] = useState({
    id: Date.now(),
    fecha: new Date().toISOString().split('T')[0],
    pacienteId: patient?._id || '',
    medicamentos: [],
    indicaciones: '',
    profesional: 'Dr. Mauricio Hurtado Cáceres',
    vigencia: 30
  });

  const [newMed, setNewMed] = useState({
    nombre: '', dosis: '', frecuencia: '', duracion: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleMedChange = (e) => {
    const { name, value } = e.target;
    setNewMed(prev => ({ ...prev, [name]: value }));
  };

  const addMedication = () => {
    if (!newMed.nombre) return;
    setRecipe(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, { ...newMed, id: Date.now() }]
    }));
    setNewMed({ nombre: '', dosis: '', frecuencia: '', duracion: '' });
  };

  const removeMedication = (id) => {
    setRecipe(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter(m => m.id !== id)
    }));
  };

  const resetForm = () => {
    setRecipe({
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      pacienteId: patient._id,
      medicamentos: [],
      indicaciones: '',
      profesional: 'Dr. Mauricio Hurtado Cáceres',
      vigencia: 30
    });
  };

  const handleGuardar = () => {
    fetch(`${API_URL}/api/recetas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    })
      .then(res => res.json())
      .then(data => {
        resetForm();
        if (onSaveRecipe) onSaveRecipe(); // para recargar lista si es necesario
        alert('✅ Receta guardada correctamente');
      })
      .catch(() => alert('❌ Error al guardar la receta'));
  };
  

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Receta Médica</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="date" name="fecha" value={recipe.fecha} onChange={handleChange} className="border rounded px-3 py-2" />
        <input type="number" name="vigencia" value={recipe.vigencia} onChange={handleChange} className="border rounded px-3 py-2" />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        {['nombre', 'dosis', 'frecuencia', 'duracion'].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            value={newMed[field]}
            onChange={handleMedChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border rounded px-3 py-2"
          />
        ))}
      </div>

      <button onClick={addMedication} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Agregar Medicamento</button>

      <ul className="mt-4 list-disc pl-6 text-sm">
        {recipe.medicamentos.map(m => (
          <li key={m.id}>
            {m.nombre} - {m.dosis}, {m.frecuencia}, {m.duracion}
            <button onClick={() => removeMedication(m.id)} className="ml-2 text-red-600">Eliminar</button>
          </li>
        ))}
      </ul>

      <textarea
        className="w-full mt-4 border rounded px-3 py-2"
        placeholder="Indicaciones para el paciente..."
        name="indicaciones"
        value={recipe.indicaciones}
        onChange={handleChange}
      />

      <div className="mt-4 text-right">
        <button onClick={handleGuardar} className="bg-green-600 text-white px-4 py-2 rounded">Guardar Receta</button>
      </div>
    </div>
  );
};

export default RecipeEditor;
