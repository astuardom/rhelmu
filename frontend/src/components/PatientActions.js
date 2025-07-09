import React from 'react';

const PatientActions = ({ patient, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar al paciente ${patient.nombre}?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/pacientes/${patient._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        onDelete(patient._id);
      } else {
        console.error("Error al eliminar:", await res.text());
      }
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
    }
  };

  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={() => onEdit(patient)}
        className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Editar
      </button>
      <button
        onClick={handleDelete}
        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
      >
        Eliminar
      </button>
    </div>
  );
};

export default PatientActions;
