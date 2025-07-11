import React from 'react';

const LayoutHeader = ({ nombreUsuario = 'Usuario', onLogout, onToggleMenu }) => {
  const iniciales = nombreUsuario
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2); // Máximo 2 letras

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Botón hamburguesa solo visible en móviles */}
          <button
            onClick={onToggleMenu}
            className="block md:hidden text-2xl text-gray-600 focus:outline-none"
          >
            ☰
          </button>

          <div className="h-14 w-auto">
            <img
              src="/logo-rhelmu.png"
              alt="Ortodoncia RHELMÜ"
              className="h-full object-contain"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-gray-700 text-sm">
            👋 Bienvenido, <strong>{nombreUsuario}</strong>
          </span>
          <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {iniciales}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="ml-2 text-sm text-red-500 hover:underline"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;
