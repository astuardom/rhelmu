import React from 'react';

const estadoColors = {
  pendiente: 'bg-yellow-500',
  confirmada: 'bg-blue-500',
  completada: 'bg-green-500',
  cancelada: 'bg-red-500',
};

const AppointmentBlock = ({ paciente, horaInicio, horaFin, estado, onClick }) => {
  const color = estadoColors[estado] || 'bg-gray-400';

  return (
    <div
      className={`rounded px-2 py-1 text-xs font-medium text-white cursor-pointer ${color}`}
      onClick={onClick}
    >
      <div className="truncate">{paciente}</div>
      <div className="text-[10px]">{horaInicio} - {horaFin}</div>
    </div>
  );
};

export default AppointmentBlock;
