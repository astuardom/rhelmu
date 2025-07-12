import React, { useState } from 'react';
import AppointmentBlock from './AppointmentBlock';

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const horasBloques = Array.from({ length: 20 }, (_, i) => {
  const hora = 9 + Math.floor(i / 2);
  const minutos = i % 2 === 0 ? '00' : '30';
  return `${hora.toString().padStart(2, '0')}:${minutos}`;
});

const sumarDias = (fecha, dias) => {
  const nueva = new Date(fecha);
  nueva.setDate(nueva.getDate() + dias);
  return nueva;
};

const formatFecha = (fecha) => fecha.toISOString().split('T')[0];

const CalendarView = ({ citas = [], pacientes = [], readOnly = false }) => {
  const [inicioSemana, setInicioSemana] = useState(() => {
    const hoy = new Date();
    const dia = hoy.getDay();
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((dia + 6) % 7));
    return lunes;
  });

  const avanzarSemana = (num) => {
    const nueva = new Date(inicioSemana);
    nueva.setDate(nueva.getDate() + num * 7);
    setInicioSemana(nueva);
  };

  const citasPorDiaHora = (fechaStr, hora) => {
    return citas.filter(cita => cita.fecha === fechaStr && cita.hora === hora);
  };

  const getPacienteNombre = (id) => {
    const p = pacientes.find(p => p._id === id);
    return p ? `${p.nombre} ${p.apellido || ''}` : 'Paciente';
  };

  const finSemana = sumarDias(inicioSemana, 6);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => avanzarSemana(-1)} className="text-sm bg-gray-100 px-2 py-1 rounded">← Semana Anterior</button>
        <h2 className="text-lg font-bold text-indigo-800">
          Semana del {inicioSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} al {finSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => avanzarSemana(1)} className="text-sm bg-gray-100 px-2 py-1 rounded">Semana Siguiente →</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="w-20 p-2 bg-gray-50 border"></th>
              {diasSemana.map((dia, i) => (
                <th key={i} className="text-center bg-indigo-50 text-indigo-800 font-medium p-2 border">
                  {dia} <br /> {sumarDias(inicioSemana, i).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horasBloques.map((hora, hIdx) => (
              <tr key={hora}>
                <td className="text-sm text-gray-600 text-right pr-2 border bg-gray-50">{hora}</td>
                {diasSemana.map((_, dIdx) => {
                  const fechaActual = formatFecha(sumarDias(inicioSemana, dIdx));
                  const citasCelda = citasPorDiaHora(fechaActual, hora);
                  return (
                    <td key={dIdx} className="align-top border h-20">
                      <div className="p-1 space-y-1">
                        {citasCelda.map(cita => (
                          <AppointmentBlock
                            key={cita._id}
                            pacienteNombre={getPacienteNombre(cita.pacienteId)}
                            horaInicio={cita.hora}
                            horaFin={cita.hora} // Puedes mejorar esto en el futuro
                            estado={cita.estado}
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarView;
