import React, { useState, useEffect } from 'react';
import SidePanel from './SidePanel';
import AppointmentBlock from './AppointmentBlock';

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const horas = Array.from({ length: 20 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
});

const sumarMinutos = (hora, minutos) => {
  const [h, m] = hora.split(':').map(Number);
  const date = new Date();
  date.setHours(h);
  date.setMinutes(m + minutos);
  return date.toTimeString().substring(0, 5);
};

const CalendarView = ({ citas = [], pacientes = [], readOnly = false, onAddAppointment = () => {}, onEditAppointment = () => {} }) => {
  const [fechaActual, setFechaActual] = useState(new Date());

  const obtenerInicioSemana = (fecha) => {
    const d = new Date(fecha);
    const dia = d.getDay();
    const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const inicioSemana = obtenerInicioSemana(fechaActual);

  const citasSemana = citas.map(c => {
    const fecha = new Date(c.fecha);
    return {
      ...c,
      dia: diasSemana[fecha.getDay() - 1],
      hora: c.hora,
      pacienteNombre: pacientes.find(p => p._id === c.pacienteId)?.nombre || 'Paciente'
    };
  });

  const handlePeriodoChange = (periodo) => {
    if (periodo === 'mes') {
      alert("🚧 Vista mensual en desarrollo. Por ahora sólo vista semanal.");
    }
  };

  const handleBloquearFechas = () => {
    alert("🚧 Funcionalidad de bloqueo aún no implementada.");
  };

  const citasDelDia = citasSemana.filter(c => {
    const fecha = new Date(c.fecha);
    return fecha.toDateString() === fechaActual.toDateString();
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
      <SidePanel
        fechaActual={fechaActual}
        citasDelDia={citasDelDia}
        onBloquearFechas={handleBloquearFechas}
        onPeriodoChange={handlePeriodoChange}
      />

      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-800">Calendario Semanal</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setFechaActual(new Date(fechaActual.setDate(fechaActual.getDate() - 7)))} className="px-2 py-1 bg-gray-100 rounded">←</button>
            <span className="text-sm text-indigo-700 font-medium">
              {inicioSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })} - {
                new Date(inicioSemana.getFullYear(), inicioSemana.getMonth(), inicioSemana.getDate() + 6)
                  .toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
              }
            </span>
            <button onClick={() => setFechaActual(new Date(fechaActual.setDate(fechaActual.getDate() + 7)))} className="px-2 py-1 bg-gray-100 rounded">→</button>
          </div>
        </div>

        <div className="grid grid-cols-8 border-t border-l text-xs">
          <div className="col-span-1 border-b border-r bg-gray-100 px-2 py-1">Hora</div>
          {diasSemana.map(d => (
            <div key={d} className="border-b border-r px-2 py-1 text-center font-semibold bg-indigo-50">{d}</div>
          ))}

          {horas.map(hora => (
            <React.Fragment key={hora}>
              <div className="border-b border-r bg-gray-50 px-2 py-2 text-sm font-medium">{hora}</div>
              {diasSemana.map(dia => (
                <div key={`${dia}-${hora}`} className="border-b border-r h-20 p-1">
                  {citasSemana
                    .filter(c => c.dia === dia && c.hora === hora)
                    .map((cita, i) => (
                      <AppointmentBlock
                        key={i}
                        paciente={cita.pacienteNombre}
                        horaInicio={cita.hora}
                        horaFin={sumarMinutos(cita.hora, 30)}
                        estado={cita.estado}
                        onClick={() => !readOnly && onEditAppointment(cita)}
                      />
                    ))}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;