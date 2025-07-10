import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

// Función para validar RUT chileno
const validarRut = (rut) => {
  if (!rut || typeof rut !== 'string') return false;
  const clean = rut.replace(/\./g, '').replace('-', '');
  if (clean.length < 8) return false;

  const cuerpo = clean.slice(0, -1);
  let dv = clean.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvCalculado;
};

const PatientForm = ({ onSave, onCancel, patient }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    fechaNacimiento: '',
    edad: '',
    genero: '',
    telefono: '',
    email: '',
    tieneConvenio: false,
    promocionDescuento: ''
  });

  const [rutValido, setRutValido] = useState(true);

  useEffect(() => {
    if (patient) {
      setFormData({
        ...patient,
        fechaNacimiento: patient.fechaNacimiento?.split('T')[0] || '',
        tieneConvenio: patient.tieneConvenio || false,
        promocionDescuento: patient.promocionDescuento || ''
      });
    }
  }, [patient]);

  const calcularEdad = (fechaNacimientoStr) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimientoStr);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'fechaNacimiento') {
      const edadCalculada = calcularEdad(value);
      setFormData(prev => ({ ...prev, fechaNacimiento: value, edad: edadCalculada }));
    } else if (name === 'rut') {
      setRutValido(validarRut(value));
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarRut(formData.rut)) {
      setRutValido(false);
      return;
    }

    const url = patient?._id
      ? `${API_URL}/api/pacientes/${patient._id}`
      : `${API_URL}/api/pacientes`;
    const method = patient?._id ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      onSave(data);
    } catch (err) {
      console.error("❌ Error al guardar paciente:", err);
      alert("Error al guardar paciente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold">{patient ? 'Editar Paciente' : 'Nuevo Paciente'}</h3>

      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre"
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="rut"
        value={formData.rut}
        onChange={handleChange}
        placeholder="RUT"
        className={`w-full border p-2 rounded ${!rutValido ? 'border-red-500' : ''}`}
        required
      />
      {!rutValido && (
        <p className="text-red-500 text-sm -mt-2">⚠️ El RUT ingresado no es válido.</p>
      )}

      <label className="block text-sm text-gray-600">Fecha de Nacimiento</label>
      <input
        name="fechaNacimiento"
        type="date"
        value={formData.fechaNacimiento}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input
        name="edad"
        type="number"
        value={formData.edad}
        placeholder="Edad"
        className="w-full border p-2 rounded bg-gray-100"
        readOnly
      />

      <label className="block text-sm text-gray-600">Género</label>
      <select
        name="genero"
        value={formData.genero}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Seleccionar género</option>
        <option value="Femenino">Femenino</option>
        <option value="Masculino">Masculino</option>
      </select>

      <input
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="Teléfono"
        className="w-full border p-2 rounded"
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border p-2 rounded"
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="tieneConvenio"
          checked={formData.tieneConvenio}
          onChange={handleChange}
        />
        <span>Tiene Convenio</span>
      </label>

      <input
        name="promocionDescuento"
        value={formData.promocionDescuento}
        onChange={handleChange}
        placeholder="Promoción o Descuento"
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default PatientForm;
