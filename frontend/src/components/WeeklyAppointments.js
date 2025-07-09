import React, { useState, useEffect } from 'react';

const WeeklyAppointments = ({ citas = [], pacientes = [] }) => {
  const [citasSemana, setCitasSemana] = useState([]);

  useEffect(() => {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  
    // Establece lunes como inicio de semana
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
    inicioSemana.setHours(0, 0, 0, 0);
  
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);
  
    console.log('Inicio de semana:', inicioSemana.toISOString());
    console.log('Fin de semana:', finSemana.toISOString());
  
    const filtradas = citas
      .filter(cita => {
        if (!cita.fecha) return false;
        const [year, month, day] = cita.fecha.split('-').map(Number);
        const fechaCita = new Date(year, month - 1, day);
        fechaCita.setHours(0, 0, 0, 0);
  
        return (
          fechaCita >= inicioSemana &&
          fechaCita <= finSemana &&
          ['pendiente', 'confirmada'].includes(cita.estado)
        );
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
    setCitasSemana(filtradas);
  }, [citas]);
  
  
  const getPacienteNombre = (id) => {
    const paciente = pacientes.find(p => p._id === id);
    return paciente ? `${paciente.nombre.split(' ')[0]} ${paciente.apellido?.split(' ')[0] || ''}` : 'Paciente';
  };

  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
    return fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
  };

  const badgeColor = (estado) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'confirmada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // 🎨 Colores cíclicos para diferenciar citas visualmente
  const bgColorVariants = [
    'bg-indigo-50', 'bg-purple-50', 'bg-green-50', 'bg-pink-50',
    'bg-blue-50', 'bg-orange-50', 'bg-teal-50', 'bg-rose-50'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Citas Programadas de la Semana</h3>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {citasSemana.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No hay citas pendientes para los próximos 7 días.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {citasSemana.map((cita, i) => (
            <div key={cita._id} className={`p-4 rounded-xl ${bgColorVariants[i % bgColorVariants.length]} shadow-sm`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{getPacienteNombre(cita.pacienteId)}</p>
                  <p className="text-sm text-gray-600">{cita.motivo}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {formatFecha(cita.fecha)} • {cita.hora}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor(cita.estado)}`}>
                      {cita.estado}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyAppointments;
