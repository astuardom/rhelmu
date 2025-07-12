import React from 'react';
import AppointmentBlock from './AppointmentBlock';

const horas = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const WeeklyCalendar = ({ currentDate, citas, pacientes, onSelectSlot, onEditCita }) => {
  const getFecha = (diaOffset) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + 1 + diaOffset); // Lunes como inicio
    return date;
  };

  const getCitasPorDiaHora = (fecha, hora) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return citas.filter(c => c.fecha === fechaStr && c.hora === hora);
  };

  return (
    <div className="overflow-x-auto border rounded-xl shadow-md bg-white">
      <table className="min-w-full table-fixed border-collapse">
        <thead className="bg-indigo-100">
          <tr>
            <th className="w-20 border border-gray-300 p-2 text-xs text-left">Hora</th>
            {diasSemana.map((dia, i) => {
              const fecha = getFecha(i);
              return (
                <th key={i} className="border border-gray-300 p-2 text-xs text-center">
                  {dia}<br />
                  <span className="text-[11px] text-gray-600">{fecha.getDate()}/{fecha.getMonth() + 1}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora, rowIndex) => (
            <tr key={rowIndex} className="even:bg-gray-50">
              <td className="border border-gray-300 p-2 text-[11px] font-semibold text-gray-600">{hora}</td>
              {diasSemana.map((_, colIndex) => {
                const fecha = getFecha(colIndex);
                const citasBloque = getCitasPorDiaHora(fecha, hora);
                return (
                  <td
                    key={colIndex}
                    className="border border-gray-300 p-1 h-20 relative hover:bg-indigo-50 cursor-pointer"
                    onClick={() => onSelectSlot(fecha, hora)}
                  >
                    {citasBloque.map((cita, i) => (
                      <div key={i} onClick={(e) => { e.stopPropagation(); onEditCita(cita); }}>
                        <AppointmentBlock
                          cita={cita}
                          paciente={pacientes.find(p => p._id === cita.pacienteId)}
                        />
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyCalendar;
