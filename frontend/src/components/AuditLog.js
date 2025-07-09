import React, { useState, useEffect } from 'react';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulación de registro de auditoría
    const mockLogs = [
      {
        id: 1,
        action: 'Creación de paciente',
        user: 'Dr. García',
        target: 'Juan Pérez',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: 'Se registró nuevo paciente'
      },
      {
        id: 2,
        action: 'Actualización de cita',
        user: 'Asistente María',
        target: 'Cita #1234',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: 'Se cambió fecha de cita'
      }
    ];
    setLogs(mockLogs);
    setIsLoading(false);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Historial de Cambios</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map(log => (
            <div key={log.id} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{log.action}</p>
                  <p className="text-sm text-gray-600">{log.details}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{log.user}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm mt-1 text-gray-500">Objeto: {log.target}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditLog;