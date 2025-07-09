import React from 'react';

const AssistantView = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Vista Asistente</h2>
      <p className="text-gray-600">
        Esta vista muestra solo la información y funciones permitidas para asistentes médicos.
      </p>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800">Funciones disponibles:</h3>
        <ul className="list-disc list-inside mt-2 text-blue-700">
          <li>Agendar citas</li>
          <li>Ver información básica de pacientes</li>
          <li>Generar reportes básicos</li>
        </ul>
      </div>
    </div>
  );
};

export default AssistantView;