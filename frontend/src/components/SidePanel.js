import React from 'react';

const estadoColor = {
  pendiente: 'text-yellow-600',
  confirmada: 'text-blue-600',
  completada: 'text-green-600',
  cancelada: 'text-red-600',
};

const SidePanel = ({
  fechaActual,
  onBloquearFechas = () => {},
  onPeriodoChange = () => {},
  citasDelDia = [],
}) => {
  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="bg-white border rounded-xl shadow p-4 w-full md:w-72 animate-fade-in">
      <h3 className="text-indigo-800 font-bold text-lg mb-4">📌 Panel de Control</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ver por:</label>
        <select
          onChange={(e) => onPeriodoChange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-indigo-500"
        >
          <option value="semana">Semana actual</option>
          <option value="mes">Mes completo</option>
        </select>
      </div>

      <button
        onClick={onBloquearFechas}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full text-sm font-semibold transition"
      >
        🔒 Bloquear Fechas
      </button>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">
          Citas para: <br /><span className="text-indigo-600">{formatearFecha(fechaActual)}</span>
        </h4>
        {citasDelDia.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No hay citas hoy.</p>
        ) : (
          <ul className="divide-y text-sm">
            {citasDelDia.map((cita, index) => (
              <li key={index} className="py-2">
                <span className={`block font-medium ${estadoColor[cita.estado] || 'text-gray-600'}`}>
                  {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                </span>
                <span className="text-gray-700 text-xs">
                  {cita.nombrePaciente || 'Paciente'} - {cita.hora}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
