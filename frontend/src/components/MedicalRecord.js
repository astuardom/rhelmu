
import React from 'react';

const MedicalRecord = ({ patient }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Historial Clínico</h3>
      {(patient.historial || []).map((item, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">{item.fecha}</p>
          <p className="font-medium">{item.diagnostico}</p>
          <p>{item.tratamiento}</p>
          <p className="text-sm text-gray-600 italic">{item.observaciones}</p>
        </div>
      ))}
    </div>
  );
};

export default MedicalRecord;
