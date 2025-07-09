
import React, { useState } from 'react';

const HistorialClinicoForm = ({ historial, onSave }) => {
  const [registros, setRegistros] = useState(historial);

  const handleChange = (index, field, value) => {
    const actualizados = [...registros];
    actualizados[index][field] = value;
    setRegistros(actualizados);
  };

  const agregarRegistro = () => {
    setRegistros(prev => [
      ...prev,
      { fecha: '', diagnostico: '', tratamiento: '', procedimiento: '', observaciones: '' }
    ]);
  };

  const eliminarRegistro = (index) => {
    const actualizados = registros.filter((_, i) => i !== index);
    setRegistros(actualizados);
    onSave(actualizados); // Guardado automático al eliminar
  };

  return (
    <div className="space-y-4">
      {registros.map((item, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-lg space-y-2">
          <input
            type="date"
            value={item.fecha}
            onChange={e => handleChange(index, 'fecha', e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Diagnóstico"
            value={item.diagnostico}
            onChange={e => handleChange(index, 'diagnostico', e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Tratamiento"
            value={item.tratamiento}
            onChange={e => handleChange(index, 'tratamiento', e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Procedimiento"
            value={item.procedimiento}
            onChange={e => handleChange(index, 'procedimiento', e.target.value)}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Observaciones"
            value={item.observaciones}
            onChange={e => handleChange(index, 'observaciones', e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={() => eliminarRegistro(index)}
            className="text-red-600 text-sm underline"
          >
            Eliminar registro
          </button>
        </div>
      ))}
      <div className="flex justify-between">
        <button
          onClick={agregarRegistro}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Añadir Registro
        </button>
        <button
          onClick={() => onSave(registros)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar Historial
        </button>
      </div>
    </div>
  );
};

export default HistorialClinicoForm;
