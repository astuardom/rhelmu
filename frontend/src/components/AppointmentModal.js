import React from 'react';

const AppointmentModal = ({ open, onClose, onSave, appointment, setAppointment }) => {
  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (appointment.paciente && appointment.fecha && appointment.hora) {
      onSave();
    } else {
      alert("⚠️ Completa todos los campos obligatorios.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in">
        <h2 className="text-xl font-bold text-indigo-700 mb-4">
          {appointment._id ? 'Editar Cita' : 'Nueva Cita'}
        </h2>

        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Paciente</span>
            <input
              name="paciente"
              value={appointment.paciente || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nombre del paciente"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Fecha</span>
            <input
              type="date"
              name="fecha"
              value={appointment.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Hora</span>
            <input
              type="time"
              name="hora"
              value={appointment.hora}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Motivo</span>
            <input
              name="motivo"
              value={appointment.motivo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Motivo de la cita"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Estado</span>
            <select
              name="estado"
              value={appointment.estado}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end mt-6 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
