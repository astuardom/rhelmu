import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FichaOrtodoncia = ({ data = [], onUpdate }) => {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ maloclusion: '', planTratamiento: '', duracion: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (Array.isArray(data)) {
      setLista(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    if (!form.maloclusion || !form.planTratamiento || !form.duracion) {
      alert('Todos los campos son obligatorios');
      return;
    }

    let nuevaLista;
    if (editId) {
      nuevaLista = lista.map(item => item.id === editId ? { ...item, ...form } : item);
    } else {
      nuevaLista = [...lista, { ...form, id: uuidv4() }];
    }

    setLista(nuevaLista);
    setForm({ maloclusion: '', planTratamiento: '', duracion: '' });
    setEditId(null);
    if (onUpdate) onUpdate(nuevaLista);
  };

  const handleEditar = (item) => {
    setForm({ maloclusion: item.maloclusion, planTratamiento: item.planTratamiento, duracion: item.duracion });
    setEditId(item.id);
  };

  const handleEliminar = (id) => {
    const nuevaLista = lista.filter(item => item.id !== id);
    setLista(nuevaLista);
    if (onUpdate) onUpdate(nuevaLista);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold">Ficha Ortodoncia</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Maloclusión</label>
          <input type="text" name="maloclusion" value={form.maloclusion} onChange={handleChange} className="w-full border rounded px-3 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Plan de Tratamiento</label>
          <input type="text" name="planTratamiento" value={form.planTratamiento} onChange={handleChange} className="w-full border rounded px-3 py-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Duración</label>
          <input type="text" name="duracion" value={form.duracion} onChange={handleChange} className="w-full border rounded px-3 py-1" />
        </div>
      </div>

      <div className="text-right">
        <button onClick={handleGuardar} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700">
          {editId ? 'Actualizar ficha' : 'Agregar ficha'}
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-semibold">Fichas Registradas</h3>
        {lista.length === 0 ? (
          <p className="text-sm text-gray-500">No hay fichas guardadas.</p>
        ) : (
          lista.map(item => (
            <div key={item.id} className="border p-3 rounded flex justify-between items-start">
              <div className="space-y-1 text-sm">
                <p><strong>Maloclusión:</strong> {item.maloclusion}</p>
                <p><strong>Tratamiento:</strong> {item.planTratamiento}</p>
                <p><strong>Duración:</strong> {item.duracion} meses</p>
              </div>
              <div className="flex flex-col space-y-1">
                <button onClick={() => handleEditar(item)} className="text-blue-600 hover:underline">Editar</button>
                <button onClick={() => handleEliminar(item.id)} className="text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FichaOrtodoncia;
