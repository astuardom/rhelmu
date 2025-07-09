
import React, { useState, useEffect } from 'react';

const Odontograma = ({ data = [], onUpdate }) => {
  const [odontograma, setOdontograma] = useState([]);
  const [activeTooth, setActiveTooth] = useState(null);
  const [formData, setFormData] = useState({
    estado: 'sano',
    tratamiento: '',
    notas: ''
  });

  const toothStates = [
    { value: 'sano', label: 'Sano', color: 'bg-white' },
    { value: 'caries', label: 'Caries', color: 'bg-yellow-300' },
    { value: 'obturado', label: 'Obturado', color: 'bg-blue-300' },
    { value: 'extraido', label: 'Extraído', color: 'bg-gray-300' },
    { value: 'endodoncia', label: 'Endodoncia', color: 'bg-purple-300' },
    { value: 'corona', label: 'Corona', color: 'bg-green-300' },
    { value: 'implante', label: 'Implante', color: 'bg-red-300' }
  ];

  const toFDI = (numero) => {
    const mapa = [
      "1.8", "1.7", "1.6", "1.5", "1.4", "1.3", "1.2", "1.1",
      "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8",
      "4.8", "4.7", "4.6", "4.5", "4.4", "4.3", "4.2", "4.1",
      "3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8"
    ];
    return mapa[numero - 1] || numero;
  };

  useEffect(() => {
    const inicial = Array.from({ length: 32 }).map((_, i) => {
      return data.find(t => t.numero === i + 1) || {
        numero: i + 1,
        estado: 'sano',
        tratamiento: '',
        notas: ''
      };
    });
    setOdontograma(inicial);
  }, [data]);

  const handleToothClick = (tooth) => {
    setActiveTooth(tooth);
    setFormData({
      estado: tooth.estado,
      tratamiento: tooth.tratamiento,
      notas: tooth.notas
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    const updated = odontograma.map((tooth) =>
      tooth.numero === activeTooth.numero ? { ...tooth, ...formData } : tooth
    );
    setOdontograma(updated);
    onUpdate(updated);
    setActiveTooth(null);
  };

  const getToothColor = (state) => {
    const stateObj = toothStates.find((s) => s.value === state);
    return stateObj ? stateObj.color : 'bg-white';
  };

  const renderRow = (indices) => (
    <div className="grid grid-cols-8 gap-2 mb-1">
      {indices.map(i => {
        const tooth = odontograma[i];
        return tooth ? (
          <div
            key={tooth.numero}
            onClick={() => handleToothClick(tooth)}
            className={`h-10 border border-gray-300 rounded-full flex items-center justify-center cursor-pointer transition-colors ${getToothColor(tooth.estado)} ${activeTooth?.numero === tooth.numero ? 'ring-2 ring-blue-500' : ''}`}
            title={`${tooth.numero}/${toFDI(tooth.numero)}`}
          >
            {`${tooth.numero}/${toFDI(tooth.numero)}`}
          </div>
        ) : (
          <div
            key={`empty-${i}`}
            className="h-10 border border-dashed border-gray-200 rounded-full bg-gray-50"
          />
        );
      })}
    </div>
  );

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Odontograma (FDI)</h3>
      {renderRow([0, 1, 2, 3, 4, 5, 6, 7])}
      {renderRow([8, 9, 10, 11, 12, 13, 14, 15])}
      <div className="h-4" />
      {renderRow([16, 17, 18, 19, 20, 21, 22, 23])}
      {renderRow([24, 25, 26, 27, 28, 29, 30, 31])}

      {activeTooth && (
        <div className="bg-gray-50 p-4 rounded-lg shadow mt-4">
          <h4 className="font-medium mb-4">Editar Pieza {`${activeTooth.numero}/${toFDI(activeTooth.numero)}`}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                {toothStates.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tratamiento</label>
              <input
                name="tratamiento"
                value={formData.tratamiento}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="Ej: Obturación, Endodoncia..."
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notas</label>
            <textarea
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows="3"
              placeholder="Detalles adicionales..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setActiveTooth(null)}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={saveChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Odontograma;
