import React from 'react';

const estadoColors = {
  pendiente: 'bg-yellow-400',
  confirmada: 'bg-blue-500',
  completada: 'bg-green-500',
  cancelada: 'bg-red-400'
};

const AppointmentBlock = ({ cita, paciente }) => {
  const color = estadoColors[cita.estado] || 'bg-gray-400';

  return (
    <div
      className={`rounded-md px-2 py-1 text-xs font-semibold text-white shadow-sm cursor-pointer ${color} truncate`}
      title={`${paciente?.nombre || 'Paciente'} - ${cita.hora} | ${cita.motivo || ''}`}
    >
      <div className="truncate">{paciente?.nombre || 'Paciente'}</div>
      <div className="text-[10px] font-normal">{cita.hora}</div>
    </div>
  );
};

export default AppointmentBlock;
