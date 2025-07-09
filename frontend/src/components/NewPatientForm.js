import React, { useState } from 'react';

const NewPatientForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    edad: '',
    genero: '',
    telefono: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      alert("Paciente creado");
      onCreated(data); // puedes actualizar la lista
    } catch (err) {
      console.error("Error al crear paciente:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded p-6">
      <h3 className="text-lg font-semibold">Registrar nuevo paciente</h3>
      <input name="nombre" placeholder="Nombre" onChange={handleChange} required className="w-full border p-2 rounded" />
      <input name="rut" placeholder="RUT" onChange={handleChange} required className="w-full border p-2 rounded" />
      <input name="edad" type="number" placeholder="Edad" onChange={handleChange} required className="w-full border p-2 rounded" />
      <input name="genero" placeholder="Género" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="telefono" placeholder="Teléfono" onChange={handleChange} className="w-full border p-2 rounded" />
      <input name="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar</button>
    </form>
  );
};

export default NewPatientForm;
