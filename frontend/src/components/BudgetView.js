// ✅ BudgetView.js
import React, { useState } from 'react';
import BudgetEditor from './BudgetEditor';

const BudgetView = ({ presupuestos, setPresupuestos, pacientes }) => {
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showBudgetEditor, setShowBudgetEditor] = useState(false);

  const handleConfirmarPresupuesto = (budget) => {
    const paciente = budget.paciente;

    fetch("http://localhost:5000/api/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: paciente.nombre,
        rut: paciente.rut,
        email: paciente.email,
        telefono: paciente.telefono,
        odontograma: budget.items.map(i => i.diente).filter(Boolean)
      })
    })
      .then(res => res.json())
      .then(() => {
        fetch(`http://localhost:5000/api/presupuestos/${budget._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...budget, estado: 'confirmado', confirmado: true })
        })
          .then(res => res.json())
          .then(updated => {
            setPresupuestos(prev =>
              prev.map(p => (p._id === updated._id ? updated : p))
            );
            alert("✅ Presupuesto confirmado y paciente registrado");
          });
      })
      .catch(err => {
        console.error("❌ Error confirmando presupuesto:", err);
        alert("Error al confirmar presupuesto");
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Presupuestos Dentales</h2>
        <button
          onClick={() => {
            setSelectedBudget(null);
            setShowBudgetEditor(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Nuevo Presupuesto
        </button>
      </div>

      {presupuestos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-500">No hay presupuestos registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presupuestos.map(budget => (
                <tr key={budget._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {budget.paciente?.nombre} {budget.paciente?.apellido || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(budget.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${budget.items?.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      budget.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      budget.estado === 'confirmado' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {budget.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => {
                        setSelectedBudget(budget);
                        setShowBudgetEditor(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleConfirmarPresupuesto(budget)}
                      className="text-green-600 hover:text-green-900 ml-3"
                    >
                      Confirmar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showBudgetEditor && (
        <BudgetEditor
          initialPatient={selectedBudget?.paciente}
          budgetToEdit={selectedBudget}
          onAddBudget={(presupuesto) => {
            fetch("http://localhost:5000/api/presupuestos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(presupuesto)
            })
              .then(res => res.json())
              .then(data => {
                setPresupuestos(prev => [...prev, data]);
                setShowBudgetEditor(false);
                alert("✅ Presupuesto guardado correctamente");
              });
          }}
          onUpdateBudget={(presupuesto) => {
            fetch(`http://localhost:5000/api/presupuestos/${presupuesto._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(presupuesto)
            })
              .then(res => res.json())
              .then(data => {
                setPresupuestos(prev => prev.map(p => p._id === data._id ? data : p));
                setSelectedBudget(null); // 🔁 Limpia el presupuesto seleccionado
                setShowBudgetEditor(false); // 🔁 Cierra el editor
                alert("✅ Presupuesto actualizado correctamente");
              });
          }}
          
        />
      )}
    </div>
  );
};

export default BudgetView;
