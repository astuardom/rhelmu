import React from 'react';

const AppointmentModal = ({ open, onClose, onSave, appointment, pacientes, setAppointment }) => {
  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (appointment.pacienteId && appointment.fecha && appointment.hora) {
      onSave();
    } else {
      alert("Completa todos los campos obligatorios");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow p-6 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">{appointment._id ? 'Editar Cita' : 'Nueva Cita'}</h3>
        <div className="space-y-3">
          <select
            name="pacienteId"
            value={appointment.pacienteId}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar Paciente</option>
            {pacientes.map(p => (
              <option key={p._id} value={p._id}>{p.nombre} {p.apellido}</option>
            ))}
          </select>

          <input
            type="date"
            name="fecha"
            value={appointment.fecha}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="time"
            name="hora"
            value={appointment.hora}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="motivo"
            placeholder="Motivo"
            value={appointment.motivo}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="estado"
            value={appointment.estado}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
