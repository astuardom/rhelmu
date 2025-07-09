import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exit, setExit] = useState(false); // 👈 Nueva animación de salida

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, clave })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

      // Animación de salida
      setExit(true);
      setTimeout(() => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.usuario.rol);
        localStorage.setItem('nombre', data.usuario.nombre);
        onLogin({ rol: data.usuario.rol, nombre: data.usuario.nombre });
      }, 600); // espera 600ms antes de entrar
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-indigo-50 px-4 transition-all duration-500 ${exit ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-sm animate-fade-in border border-indigo-100"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo-rhelmu.png" alt="Logo Rhelmu" className="h-20 object-contain" />
        </div>

        <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-6">Bienvenido</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg transition font-semibold flex justify-center items-center ${
            loading
              ? 'bg-indigo-400 cursor-not-allowed text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Ingresando...
            </>
          ) : (
            'Ingresar'
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
