import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const API_URL = process.env.REACT_APP_API_URL;

const TreatmentManager = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/tratamientos`)
      .then(res => res.json())
      .then(data => setTratamientos(data));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Selecciona un archivo CSV");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data
          .map(row => {
            const nombre = row["TRATAMIENTO"]?.toString().trim();
            const rawPrecio = row["PRECIO LISTA"]?.toString().replace(/[^\d]/g, '');
            if (!nombre || !rawPrecio) return null;
            return {
              nombre,
              precio: parseInt(rawPrecio)
            };
          })
          .filter(Boolean); // elimina nulos

        try {
          const res = await fetch(`${API_URL}/api/tratamientos/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          alert("✅ Datos importados correctamente");
          setTratamientos(result); // ← ahora contiene los tratamientos reales desde backend

        } catch (err) {
          console.error("❌ Error subiendo tratamientos:", err);
          alert("❌ Error al subir tratamientos");
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-indigo-800">Gestión de Tratamientos</h2>
      
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-3" />
      <button onClick={handleUpload} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
        Subir CSV
      </button>

      <table className="min-w-full mt-5 border">
        <thead>
          <tr className="bg-indigo-100">
            <th className="text-left p-2">Tratamiento</th>
            <th className="text-left p-2">Precio</th>
          </tr>
        </thead>
        <tbody>
          {tratamientos.map((t, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{t.nombre}</td>
              <td className="p-2">${t.precio.toLocaleString('es-CL')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TreatmentManager;
