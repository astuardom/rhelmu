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

  const handleUpdate = async (id, nombre, precio) => {
    try {
      const res = await fetch(`${API_URL}/api/tratamientos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio })
      });
      const updated = await res.json();
      setTratamientos(prev => prev.map(t => (t._id === id ? updated : t)));
      alert("✅ Tratamiento actualizado");
    } catch (err) {
      alert("❌ Error al actualizar tratamiento");
    }
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este tratamiento?")) return;
  
    try {
      await fetch(`${API_URL}/api/tratamientos/${id}`, {
        method: "DELETE"
      });
      setTratamientos(prev => prev.filter(t => t._id !== id));
      alert("🗑️ Tratamiento eliminado");
    } catch (err) {
      alert("❌ Error al eliminar tratamiento");
    }
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
  <tr key={t._id || i} className="border-t">
    <td className="p-2">
      <input
        type="text"
        value={t.nombre}
        onChange={(e) => {
          const nombre = e.target.value;
          setTratamientos(prev => {
            const copia = [...prev];
            copia[i].nombre = nombre;
            return copia;
          });
        }}
        className="border px-2 py-1 rounded w-full"
      />
    </td>
    <td className="p-2">
      <input
        type="number"
        value={t.precio}
        onChange={(e) => {
          const precio = parseInt(e.target.value);
          setTratamientos(prev => {
            const copia = [...prev];
            copia[i].precio = precio;
            return copia;
          });
        }}
              className="border px-2 py-1 rounded w-full"
            />
          </td>
          <td className="p-2 flex gap-2">
            <button
              onClick={() => handleUpdate(t._id, t.nombre, t.precio)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => handleDelete(t._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      ))}

        </tbody>
      </table>
    </div>
  );
};

export default TreatmentManager;
