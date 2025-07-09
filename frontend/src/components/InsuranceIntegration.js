import React, { useState } from 'react';

const InsuranceIntegration = () => {
  const [insurances, setInsurances] = useState([]);
  const [newInsurance, setNewInsurance] = useState({
    nombre: '',
    plan: '',
    numeroAfiliado: '',
    vigencia: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInsurance(prev => ({ ...prev, [name]: value }));
  };

  const addInsurance = () => {
    if (!newInsurance.nombre) return;
    setInsurances([...insurances, { ...newInsurance, id: Date.now() }]);
    setNewInsurance({
      nombre: '',
      plan: '',
      numeroAfiliado: '',
      vigencia: ''
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Integración con Aseguradoras</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aseguradora</label>
          <input
            type="text"
            name="nombre"
            value={newInsurance.nombre}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <input
            type="text"
            name="plan"
            value={newInsurance.plan}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Afiliado</label>
          <input
            type="text"
            name="numeroAfiliado"
            value={newInsurance.numeroAfiliado}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vigencia</label>
          <input
            type="date"
            name="vigencia"
            value={newInsurance.vigencia}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <button
        onClick={addInsurance}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Agregar Aseguradora
      </button>

      {insurances.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aseguradora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Afiliado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vigencia</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insurances.map(ins => (
                <tr key={ins.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ins.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ins.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ins.numeroAfiliado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ins.vigencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InsuranceIntegration;