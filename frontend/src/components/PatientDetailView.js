import React, { useState } from 'react';
import RecetasDelPaciente from './RecetasDelPaciente';
import MedicalRecord from './MedicalRecord';
import FichaOrtodoncia from './FichaOrtodoncia';
import ImageManager from './ImageManager';
import InsuranceIntegration from './InsuranceIntegration';
import WhatsAppIntegration from './WhatsAppIntegration';
import RemindersManager from './RemindersManager';
import RecipeEditor from './RecipeEditor';
import Odontograma from './Odontograma';
import ControlChecklist from './ControlChecklist';
import HistorialClinicoForm from './HistorialClinicoForm';

const API_URL = process.env.REACT_APP_API_URL;

const PatientDetailView = ({ patient, onUpdateHistorial }) => {
  const [showRecipeEditor, setShowRecipeEditor] = useState(false);
  const [showRecetas, setShowRecetas] = useState(false);
  const [recargarRecetas, setRecargarRecetas] = useState(false);
  const [editingHistorial, setEditingHistorial] = useState(false);

  const userRol = localStorage.getItem('rol');
  if (!patient) return null;

  const handleEditar = () => {
    window.dispatchEvent(new CustomEvent("editarPaciente", { detail: patient }));
  };

  const handleEliminar = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) {
      fetch(`${API_URL}/api/pacientes/${patient._id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) {
            window.dispatchEvent(new CustomEvent("eliminarPaciente", { detail: patient._id }));
            alert("✅ Paciente eliminado con éxito");
          } else {
            alert("❌ Error al eliminar paciente");
          }
        })
        .catch(err => {
          console.error("❌ Error eliminando paciente:", err);
        });
    }
  };

  const handleHistorialSave = async (updatedHistorial) => {
    const res = await fetch(`${API_URL}/api/pacientes/${patient._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...patient, historial: updatedHistorial })
    });
    const updated = await res.json();
    onUpdateHistorial(updated.historial);
    setEditingHistorial(false);
  };

  const handleControlUpdate = async (updatedControles) => {
    try {
      if (!Array.isArray(updatedControles)) {
        throw new Error("Los controles enviados no son válidos");
      }
  
      const res = await fetch(`${API_URL}/api/pacientes/${patient._id}/controles`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ controles: updatedControles })
      });
  
      if (!res.ok) {
        const errorResponse = await res.json();
        throw new Error(errorResponse?.error || 'Error al actualizar controles');
      }
  
      const updated = await res.json();
      window.dispatchEvent(new CustomEvent("actualizarPaciente", { detail: updated }));
  
      alert("✅ Controles guardados correctamente");
    } catch (err) {
      console.error('❌ Error actualizando controles:', err);
      alert("❌ Error al guardar controles: " + err.message);
    }
  };
  
  

  const handleOdontogramaUpdate = async (updatedOdontograma) => {
    try {
      const res = await fetch(`${API_URL}/api/pacientes/${patient._id}/odontograma`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ odontograma: updatedOdontograma })
      });
      if (!res.ok) throw new Error('Error al actualizar odontograma');
      const updated = await res.json();
      window.dispatchEvent(new CustomEvent("actualizarPaciente", { detail: updated }));
    } catch (err) {
      console.error('❌ Error actualizando odontograma:', err);
    }
  };

  const handleFichaOrtodonciaUpdate = async (updatedFicha) => {
    try {
      const res = await fetch(`${API_URL}/api/pacientes/${patient._id}/ficha-ortodoncia`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fichaOrtodoncia: updatedFicha })
      });
      if (!res.ok) throw new Error('Error al guardar ficha ortodoncia');
      const updated = await res.json();
      window.dispatchEvent(new CustomEvent("actualizarPaciente", { detail: updated }));
      console.log('✅ Ficha ortodoncia actualizada:', updated);
    } catch (err) {
      console.error('❌ Error guardando ficha ortodoncia:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Datos del paciente */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-2xl font-bold text-indigo-800">
            👤 Detalle de {patient.nombre}
          </h2>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <button
              onClick={handleEditar}
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded transition"
            >
              ✏️ Editar
            </button>
            <button
              onClick={handleEliminar}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition"
            >
              🗑️ Eliminar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong className="text-indigo-600">🆔 RUT:</strong> {patient.rut}</div>
          <div><strong className="text-indigo-600">🎂 Edad:</strong> {patient.edad}</div>
          <div><strong className="text-indigo-600">📧 Correo:</strong> {patient.correo}</div>
          <div><strong className="text-indigo-600">📞 Teléfono:</strong> {patient.telefono}</div>
        </div>
      </div>

      {/* Historial, controles, etc. */}
      {userRol !== 'asistente' && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">🗂️ Historial Clínico</h3>
            <button
              className="text-blue-600 text-sm underline"
              onClick={() => setEditingHistorial(!editingHistorial)}
            >
              {editingHistorial ? "Cerrar editor" : "Editar Historial"}
            </button>
          </div>

          {editingHistorial ? (
            <HistorialClinicoForm
              historial={patient.historial || []}
              onSave={handleHistorialSave}
            />
          ) : (
            <MedicalRecord patient={patient} />
          )}

          <Odontograma data={patient.odontograma} onUpdate={handleOdontogramaUpdate} />
          <ControlChecklist controles={patient.controles || []} onUpdate={handleControlUpdate} />
          <FichaOrtodoncia data={patient.fichaOrtodoncia} onUpdate={handleFichaOrtodonciaUpdate} />
        </>
      )}

      {/* Siempre visibles */}
      <ImageManager patientId={patient._id} />
      <InsuranceIntegration patientId={patient._id} />
      <WhatsAppIntegration patient={patient} />
      <RemindersManager patient={patient} />

      {/* Recetas */}
      <div className="flex gap-4 mb-2">
        <button
          onClick={() => {
            setShowRecipeEditor(true);
            setShowRecetas(false);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          📝 Generar Receta
        </button>
        <button
          onClick={() => {
            setShowRecetas(true);
            setShowRecipeEditor(false);
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          📄 Ver Recetas
        </button>
      </div>

      {showRecipeEditor && (
        <RecipeEditor
          patient={patient}
          onSaveRecipe={() => {
            setShowRecipeEditor(false);
            setShowRecetas(true);
            setRecargarRecetas(prev => !prev);
          }}
        />
      )}

      {showRecetas && <RecetasDelPaciente paciente={patient} />}
    </div>
  );
};

export default PatientDetailView;
