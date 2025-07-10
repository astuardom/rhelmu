// 📁 components/UserManager.jsx
import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;


const UserManager = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', correo: '', clave: '', rol: 'asistente' });

  useEffect(() => {
    fetch(`${API_URL}/api/usuarios`)
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al cargar usuarios', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_URL}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(nuevo => {
        setUsuarios(prev => [...prev, nuevo]);
        setFormData({ nombre: '', correo: '', clave: '', rol: 'asistente' });
      })
      .catch(err => console.error('Error al crear usuario', err));
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    fetch(`const API_URL = process.env.REACT_APP_API_URL;/api/usuarios/${id}`, { method: 'DELETE' })
      .then(() => setUsuarios(prev => prev.filter(u => u._id !== id)))
      .catch(err => console.error('Error al eliminar usuario', err));
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">👥 Gestión de Usuarios</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          name="clave"
          placeholder="Clave"
          value={formData.clave}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />

        <select name="rol" value={formData.rol} onChange={handleChange} className="border px-3 py-2 rounded">
          <option value="doctor">Doctor</option>
          <option value="contador">Contador</option>
          <option value="asistente">Asistente</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-4">
          ➕ Crear Usuario
        </button>
      </form>

      <table className="w-full text-sm text-left border">
        <thead>
          <tr className="bg-indigo-100">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user._id} className="border-t">
              <td className="px-4 py-2">{user.nombre}</td>
              <td className="px-4 py-2">{user.correo}</td>
              <td className="px-4 py-2 capitalize">{user.rol}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-600 hover:underline text-xs"
                >
                  🗑 Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
