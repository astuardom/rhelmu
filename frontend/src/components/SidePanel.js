import React from 'react';

const SidePanel = ({ currentDate, onWeekChange, citas = [], pacientes = [], onSelectDay }) => {
  const today = new Date();
  const current = currentDate || today;

  // Semana actual: lunes a domingo
  const startOfWeek = new Date(current);
  startOfWeek.setDate(current.getDate() - (current.getDay() === 0 ? 6 : current.getDay() - 1)); // Lunes

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

  const weekRange = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric'
  })}`;

  // Citas del día actual
  const citasHoy = citas.filter(cita => {
    if (!cita.fecha || typeof cita.fecha !== 'string') return false;
  
    const parts = cita.fecha.split('-');
    if (parts.length !== 3) return false;
  
    const [year, month, day] = parts.map(Number);
    const citaDate = new Date(year, month - 1, day);
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
    <aside className="bg-white rounded-2xl shadow-md p-5 border border-indigo-100 w-full md:w-72">
      <h2 className="font-bold text-indigo-800 text-lg mb-4">📅 Semana Actual</h2>

      {/* Navegación de semanas */}
      <div className="flex justify-between items-center text-sm mb-5">
        <button
          onClick={() => onWeekChange(-1)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 font-bold"
        >←</button>
        <span className="font-semibold text-indigo-700 text-sm">{weekRange}</span>
        <button
          onClick={() => onWeekChange(1)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 font-bold"
        >→</button>
      </div>

      {/* Botón de bloquear fechas */}
      <button
        onClick={() => alert("🔒 Próximamente podrás bloquear días específicos.")}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 mb-6"
      >
        🔒 Bloquear Fechas
      </button>

      {/* Lista de citas del día */}
      <h3 className="text-indigo-800 font-semibold text-sm mb-2">Citas Hoy ({today.toLocaleDateString('es-CL')})</h3>
      <ul className="text-sm space-y-2 max-h-72 overflow-y-auto pr-1">
        {citasHoy.length === 0 && <li className="text-gray-400">Sin citas programadas</li>}
        {citasHoy.map((cita, i) => {
          const paciente = pacientes.find(p => p._id === cita.pacienteId);
          return (
            <li key={i} className="flex flex-col border-l-4 pl-2 border-indigo-200">
              <span className={`text-xs font-semibold ${getColor(cita.estado)}`}>
                {cita.hora} • {cita.estado}
              </span>
              <span className="text-gray-800 text-sm truncate">{cita.paciente || 'Paciente'}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default SidePanel;
