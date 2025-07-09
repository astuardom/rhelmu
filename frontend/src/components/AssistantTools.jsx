// 📁 components/AssistantTools.jsx
import React from 'react';

const AssistantTools = ({ paciente, recetas }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4 text-indigo-800">🛠 Herramientas para Asistentes</h2>

      {paciente ? (
        <>
          <div className="mb-4">
            <p><strong>Paciente seleccionado:</strong> {paciente.nombre}</p>
            <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${paciente.telefono}`} target="_blank" rel="noreferrer" className="text-green-600">Enviar mensaje</a></p>
            <p><strong>Aseguradora:</strong> {paciente.aseguradora || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">📋 Recetas del paciente</h3>
            <ul className="list-disc pl-6">
              {recetas.filter(r => r.pacienteId === paciente._id).map(r => (
                <li key={r._id}>{r.medicamento} - {r.dosis}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Selecciona un paciente para ver detalles.</p>
      )}
    </div>
  );
};

export default AssistantTools;
