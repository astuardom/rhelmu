import React from 'react';

const TreatmentItemForm = ({ newItem, onChange, onAdd }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Agregar Tratamiento</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="text-sm font-medium">Tratamiento*</label>
          <input
            type="text"
            name="tratamiento"
            value={newItem.tratamiento}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Ej: Limpieza"
            required
          />
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
