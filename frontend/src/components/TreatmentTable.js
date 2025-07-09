import React from 'react';

const TreatmentTable = ({ items, onRemove }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Tratamientos</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Tratamiento</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Diente</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Cantidad</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Precio</th>
            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-2">{item.tratamiento}</td>
              <td className="px-6 py-2">{item.diente || '-'}</td>
              <td className="px-6 py-2">{item.cantidad}</td>
              <td className="px-6 py-2">${item.precio.toLocaleString('es-CL')}</td>
              <td className="px-6 py-2">${item.subtotal.toLocaleString('es-CL')}</td>
              <td className="px-6 py-2">
                <button
                  onClick={() => onRemove(index)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreatmentTable;
