import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/solid'; // si usas Heroicons

const PatientList = ({ patients, onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  const filteredPatients = patients.filter((p) =>
    `${p.nombre} ${p.apellido || ''} ${p.rut || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / patientsPerPage));
  const startIndex = (currentPage - 1) * patientsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + patientsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-indigo-800 mb-4">🧑‍⚕️ Listado de Pacientes</h3>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre o RUT..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* 🧾 Lista */}
      <ul className="divide-y divide-gray-200">
        {currentPatients.map((patient) => (
          <li
            key={patient._id}
            onClick={() => onSelectPatient(patient)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 cursor-pointer transition"
          >
            <UserIcon className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {patient.nombre} {patient.apellido || ''}
              </p>
              <p className="text-xs text-gray-500">{patient.rut}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* 🔁 Paginación */}
      <div className="flex justify-between items-center mt-5 text-sm text-gray-600">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
        >
          ◀ Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
        >
          Siguiente ▶
        </button>
      </div>
    </div>
  );
};

export default PatientList;
