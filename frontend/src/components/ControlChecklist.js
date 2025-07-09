import React, { useState, useEffect } from 'react';

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const ControlChecklist = ({ controles = [], onUpdate }) => {
  const [localControles, setLocalControles] = useState([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const existingYear = controles.find(c => c.year === currentYear);
    if (!existingYear) {
      const newControles = [
        ...controles,
        {
          year: currentYear,
          months: monthNames.map(m => ({ month: m, attended: false }))
        }
      ];
      setLocalControles(newControles);
      onUpdate(newControles);
    } else {
      setLocalControles(controles);
    }
  }, [controles, onUpdate, currentYear]);

  const toggleCheck = async (year, monthName) => {
    const updated = localControles.map(control => {
      if (control.year === year) {
        return {
          ...control,
          months: control.months.map(m => m.month === monthName ? { ...m, attended: !m.attended } : m)
        };
      }
      return control;
    });
    setLocalControles(updated);
    await onUpdate(updated);
    alert('✅ Control actualizado con éxito');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Historial de Controles</h3>
      {localControles
        .filter(control => control.year === currentYear)
        .map(control => (
          <div key={control.year} className="mb-6">
            <h4 className="text-md font-semibold mb-2">Año {control.year}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {control.months.map(month => (
                <div key={month.month} className="flex items-center space-x-2">
                  <span className="text-sm w-20">{month.month}</span>
                  <button
                    onClick={() => toggleCheck(control.year, month.month)}
                    className={`px-2 py-1 rounded text-xs ${month.attended ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    {month.attended ? 'Asistió' : 'No asistió'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ControlChecklist;
