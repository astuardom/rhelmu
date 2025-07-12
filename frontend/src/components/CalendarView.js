import React, { useState } from 'react';
import WeeklyCalendar from './WeeklyCalendar';

const API_URL = process.env.REACT_APP_API_URL;

const estadoColors = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
};

const getBorderClass = (estado) => {
  switch (estado) {
    case 'pendiente': return 'border-yellow-400';
    case 'confirmada': return 'border-blue-400';
    case 'completada': return 'border-green-400';
    case 'cancelada': return 'border-red-400';
    default: return 'border-gray-300';
  }
};

const CalendarView = ({
  citas = [],
  pacientes = [],
  onAddAppointment = () => {},
  onEditAppointment = () => {},
  readOnly = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCitaId, setSelectedCitaId] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    fecha: '',
    hora: '09:00',
    pacienteId: '',
    motivo: '',
    estado: 'pendiente',
  });

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const today = new Date();

  const getCitasForDate = (fecha) => {
    return citas.filter(cita => {
      const [year, month, day] = cita.fecha.split('-');
      const citaDate = new Date(Number(year), Number(month) - 1, Number(day));
      return citaDate.toDateString() === fecha.toDateString();
    });
  };

  const getPacienteNombre = (id) => {
    const paciente = pacientes.find(p => p._id === id);
    return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente';
  };

  const openModalForNew = (fecha) => {
    if (readOnly) return;
    setSelectedDate(fecha);
    setIsEditing(false);
    setSelectedCitaId(null);
    setNewAppointment({
      fecha: fecha.toISOString().split('T')[0],
      hora: '09:00',
      pacienteId: '',
      motivo: '',
      estado: 'pendiente',
    });
    setShowModal(true);
  };

  const openModalForEdit = (cita) => {
    if (readOnly) return;
    setIsEditing(true);
    setSelectedDate(new Date(cita.fecha));
    setNewAppointment({ ...cita });
    setSelectedCitaId(cita._id);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      onEditAppointment({ ...newAppointment, _id: selectedCitaId });
    } else {
      onAddAppointment(newAppointment);
    }
    setShowModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-indigo-800">📅 Calendario de Citas</h2>
        <div className="flex space-x-2">
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="bg-gray-100 px-2 py-1 rounded">←</button>
          <span className="text-indigo-700 font-medium">{currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="bg-gray-100 px-2 py-1 rounded">→</button>
        </div>
      </div>

      <WeeklyCalendar
        citas={citas}
        onSelectSlot={(fecha) => openModalForNew(new Date(fecha))}
      />

      {showModal && !readOnly && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? 'Editar Cita' : `Nueva Cita - ${selectedDate.toLocaleDateString('es-ES')}`}
            </h3>
            <div className="space-y-3">
              <select
                name="pacienteId"
                value={newAppointment.pacienteId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Seleccionar Paciente</option>
                {pacientes.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.nombre} {p.apellido}
                  </option>
                ))}
              </select>

              <input
                name="motivo"
                placeholder="Motivo"
                value={newAppointment.motivo}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <input
                name="fecha"
                type="date"
                value={newAppointment.fecha}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <input
                name="hora"
                type="time"
                value={newAppointment.hora}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />

              <select
                name="estado"
                value={newAppointment.estado}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>

              <div className="flex justify-end space-x-2 pt-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">
                  Cancelar
                </button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {isEditing ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
