import React from 'react';

const PatientInfoCard = ({ patient, onChange }) => {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nombre del Paciente*</label>
        <input
          type="text"
          name="nombre"
          value={patient.nombre}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={patient.email}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={patient.telefono}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  );
};

export default PatientInfoCard;
