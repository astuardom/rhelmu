import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const horas = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`); // Desde 08:00 a 17:00

const WeeklyCalendar = ({ onSelectSlot, citas = [] }) => {
  const [semanaInicio, setSemanaInicio] = useState(dayjs().startOf('week').add(1, 'day')); // lunes

  const obtenerBloques = (dia, hora) => {
    return citas.find(cita =>
      dayjs(cita.fecha).isSame(dia, 'day') &&
      dayjs(cita.fecha).hour() === parseInt(hora)
    );
  };

  const renderTabla = () => {
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-indigo-100">
            <th className="p-2 border border-gray-200">Hora</th>
            {diasSemana.map((dia, i) => {
              const fecha = semanaInicio.add(i, 'day');
              return (
                <th key={dia} className="p-2 border border-gray-200 text-sm">
                  {dia} <br />
                  <span className="text-gray-500 text-xs">{fecha.format('DD/MM')}</span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {horas.map(hora => (
            <tr key={hora}>
              <td className="p-2 text-sm text-gray-600 border border-gray-200">{hora}</td>
              {diasSemana.map((_, i) => {
                const fechaCompleta = semanaInicio.add(i, 'day').hour(parseInt(hora)).minute(0).second(0);
                const cita = obtenerBloques(fechaCompleta, hora);

                return (
                  <td
                    key={i}
                    className={`p-2 h-16 border border-gray-200 cursor-pointer text-xs text-center 
                      ${cita ? 'bg-green-200' : 'hover:bg-indigo-100'}
                    `}
                    onClick={() => {
                      if (!cita) onSelectSlot(fechaCompleta.toISOString());
                    }}
                  >
                    {cita ? `${cita.paciente?.nombre || 'Ocupado'}` : 'Disponible'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-white p-4 shadow rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <button
          className="text-indigo-600 hover:underline"
          onClick={() => setSemanaInicio(semanaInicio.subtract(7, 'day'))}
        >
          ← Semana anterior
        </button>
        <h2 className="text-lg font-semibold text-indigo-800">
          Semana del {semanaInicio.format('DD/MM/YYYY')} al {semanaInicio.add(6, 'day').format('DD/MM/YYYY')}
        </h2>
        <button
          className="text-indigo-600 hover:underline"
          onClick={() => setSemanaInicio(semanaInicio.add(7, 'day'))}
        >
          Semana siguiente →
        </button>
      </div>

      <div className="overflow-x-auto">{renderTabla()}</div>
    </div>
  );
};

export default WeeklyCalendar;
