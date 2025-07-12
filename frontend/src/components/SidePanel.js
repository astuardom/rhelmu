import React from 'react';

const SidePanel = ({ currentDate, onWeekChange, citas = [], pacientes = [], onSelectDay }) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Lunes

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

  const weekRange = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric'
  })}`;

  const citasHoy = citas.filter(cita => {
    const [year, month, day] = cita.fecha.split('-');
    const citaDate = new Date(Number(year), Number(month) - 1, Number(day));
    const today = new Date();
    return citaDate.toDateString() === today.toDateString();
  });

  const getColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'text-yellow-600';
      case 'confirmada': return 'text-blue-600';
      case 'completada': return 'text-green-600';
      case 'cancelada': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-indigo-100 w-full md:w-64">
      <h2 className="font-bold text-indigo-800 text-lg mb-3">📅 Semana</h2>
      <div className="flex justify-between items-center text-sm mb-4">
        <button
          onClick={() => onWeekChange(-1)}
          className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
        >←</button>
        <span className="font-medium text-indigo-700">{weekRange}</span>
        <button
          onClick={() => onWeekChange(1)}
          className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
        >→</button>
      </div>

      <button
        onClick={() => alert("⚠️ Funcionalidad próximamente")}
        className="w-full bg-indigo-600 text-white py-2 rounded text-sm font-medium hover:bg-indigo-700 mb-4"
      >
        🔒 Bloquear Fechas
      </button>

      <h3 className="text-indigo-800 font-semibold text-sm mb-2">Hoy ({new Date().toLocaleDateString('es-CL')})</h3>
      <ul className="text-sm space-y-2 max-h-72 overflow-y-auto">
        {citasHoy.length === 0 && <li className="text-gray-500">No hay citas hoy</li>}
        {citasHoy.map((cita, i) => {
          const paciente = pacientes.find(p => p._id === cita.pacienteId);
          return (
            <li key={i} className="flex justify-between">
              <span className={`${getColor(cita.estado)} font-medium`}>{cita.hora}</span>
              <span className="truncate ml-2">{paciente?.nombre || 'Paciente'} ({cita.estado})</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidePanel;
