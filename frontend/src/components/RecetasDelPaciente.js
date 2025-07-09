import React, { useEffect, useState } from 'react';
import CertificadoCompleto from './CertificadoCompleto';

const RecetasDelPaciente = ({ paciente, recargar }) => {
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  useEffect(() => {
    if (!paciente?._id) return;
    fetch(`const API_URL = process.env.REACT_APP_API_URL;/api/recetas/paciente/${paciente._id}`)
      .then(res => res.json())
      .then(data => setRecetas(data))
      .catch(() => alert('❌ Error al cargar recetas'));
  }, [paciente, recargar]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recetas del paciente</h2>

      {recetas.length === 0 ? (
        <p className="text-gray-500">No hay recetas registradas.</p>
      ) : (
        recetas.map((receta) => {
          const fechaCreacion = new Date(receta.fecha).toLocaleDateString('es-CL');
          const isVisible = recetaSeleccionada?.id === receta._id;

          return (
            <div key={receta._id} className="mb-6 border p-4 rounded shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">
                  Receta creada el <strong>{fechaCreacion}</strong>
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      setRecetaSeleccionada(
                        isVisible ? null : { id: receta._id, data: receta }
                      )
                    }
                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                  >
                    {isVisible ? 'Ocultar' : 'Ver Receta'}
                  </button>
                </div>
              </div>

              {isVisible && (
                <div className="mt-4">
                  <CertificadoCompleto receta={receta} paciente={paciente} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecetasDelPaciente;
