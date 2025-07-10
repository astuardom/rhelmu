import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

// Colores por estado
const estadoColors = {
  pendiente: 'bg-yellow-200 text-yellow-800',
  confirmada: 'bg-blue-200 text-blue-800',
  completada: 'bg-green-200 text-green-800',
  cancelada: 'bg-red-200 text-red-800',
};

// Colores alternativos aleatorios
const getRandomColor = (id) => {
  const colors = ['bg-pink-100', 'bg-purple-100', 'bg-indigo-100', 'bg-orange-100', 'bg-teal-100'];
  const index = id ? id.toString().charCodeAt(0) % colors.length : 0;
  return colors[index];
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

      <div className="grid grid-cols-7 text-sm text-center mb-2 font-medium text-indigo-600">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {[...Array(startDay).fill(null), ...Array(daysInMonth).fill(0).map((_, i) => i + 1)].map((day, index) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day || 1);
          const citasDia = getCitasForDate(date);
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div
              key={index}
              className={`p-2 border rounded-lg ${day ? 'cursor-pointer hover:bg-indigo-50' : 'opacity-0'}`}
              onClick={() => day && openModalForNew(date)}
            >
              {day && (
                <>
                  <div className={`text-xs font-bold ${isToday ? 'text-blue-600' : ''}`}>{day}</div>
                  {citasDia.length > 0 && (
                    <div className="mt-1 space-y-1">
                      {citasDia.slice(0, 3).map((cita) => (
                        <div
                          key={cita._id || cita.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModalForEdit(cita);
                          }}
                          className={`text-[10px] truncate px-1 py-0.5 rounded ${getRandomColor(cita._id)} ${estadoColors[cita.estado] || ''}`}
                        >
                          {getPacienteNombre(cita.pacienteId)} ({cita.hora})
                        </div>
                      ))}
                      {citasDia.length > 3 && (
                        <div className="text-[10px] text-gray-400">+{citasDia.length - 3} más</div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

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

        {/* Nuevo campo para modificar la fecha */}
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
