import React, { useState } from 'react';
import RecipeEditor from './RecipeEditor';
import RecetasDelPaciente from './RecetasDelPaciente';

const RecetasPacientePanel = ({ paciente }) => {
  const [vista, setVista] = useState('crear');
  const [recargar, setRecargar] = useState(false);

  const handleRecargar = () => {
    setRecargar(prev => !prev);
    setVista('ver');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setVista('crear')}
          className={`px-4 py-2 rounded font-semibold ${vista === 'crear' ? 'bg-purple-600 text-white' : 'border border-purple-600 text-purple-600 hover:bg-purple-50'}`}
        >
          Generar Receta
        </button>
        <button
          onClick={() => setVista('ver')}
          className={`px-4 py-2 rounded font-semibold ${vista === 'ver' ? 'bg-red-600 text-white' : 'border border-red-600 text-red-600 hover:bg-red-50'}`}
        >
          Ver Recetas
        </button>
      </div>

      {vista === 'crear' && (
        <RecipeEditor patient={paciente} onSaveRecipe={handleRecargar} />
      )}
      {vista === 'ver' && (
        <RecetasDelPaciente paciente={paciente} recargar={recargar} />
      )}
    </div>
  );
};

export default RecetasPacientePanel;
