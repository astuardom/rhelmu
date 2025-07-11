import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

const TreatmentItemForm = ({ newItem, onChange, onAdd }) => {
  const [tratamientosBD, setTratamientosBD] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/tratamientos`)
      .then(res => res.json())
      .then(data => setTratamientosBD(data));
  }, []);

  const handleSelectTratamiento = (e) => {
    const selectedNombre = e.target.value;
    const tratamiento = tratamientosBD.find(t => t.nombre === selectedNombre);
    onChange({
      target: {
        name: 'tratamiento',
        value: selectedNombre
      }
    });
    if (tratamiento) {
      onChange({
        target: {
          name: 'precio',
          value: tratamiento.precio
        }
      });
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Agregar Tratamiento</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div>
          <label className="text-sm font-medium">Tratamiento*</label>
          <select
            name="tratamiento"
            value={newItem.tratamiento}
            onChange={handleSelectTratamiento}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Seleccione...</option>
            {tratamientosBD.map((t, i) => (
              <option key={i} value={t.nombre}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Diente</label>
          <input
            type="text"
            name="diente"
            value={newItem.diente}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Ej: 11, 12"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Cantidad*</label>
          <input
            type="number"
            name="cantidad"
            value={newItem.cantidad}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg"
            min="1"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Precio*</label>
          <input
            type="number"
            name="precio"
            value={newItem.precio}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg"
            min="0"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Descuento (%)</label>
          <input
            type="number"
            name="descuento"
            value={newItem.descuento || 0}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg"
            min="0"
            max="100"
            placeholder="Ej: 10"
          />
        </div>
      </div>

      <button
        onClick={onAdd}
        className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        disabled={!newItem.tratamiento || newItem.precio <= 0}
      >
        Agregar Tratamiento
      </button>
    </div>
  );
};

export default TreatmentItemForm;
