import React, { useState, useEffect } from 'react';
import LayoutHeader from './components/LayoutHeader';
import PatientList from './components/PatientList';
import PatientDetailView from './components/PatientDetailView';
import PatientForm from './components/PatientForm';
import CalendarView from './components/CalendarView';
import AssistantView from './components/AssistantView';
import BudgetView from './components/BudgetView';
import DashboardCard from './components/DashboardCard';
import InventoryManager from './components/InventoryManager';
import ReportsView from './components/ReportsView';
import WeeklyAppointments from './components/WeeklyAppointments';
import UserManager from './components/UserManager';
import Login from './components/Login';

const API_URL = process.env.REACT_APP_API_URL;

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  useEffect(() => {
    const storedRol = localStorage.getItem('rol');
    const storedNombre = localStorage.getItem('nombre');
    if (storedRol && storedNombre) {
      setUser({ rol: storedRol, nombre: storedNombre });
    }
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/pacientes`)
      .then(res => res.json())
      .then(data => {
        setPacientes(data);
        if (data.length > 0) setSelectedPatient(data[0]);
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/citas`)
      .then(res => res.json())
      .then(data => setCitas(data));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/recetas`)
      .then(res => res.json())
      .then(data => setRecetas(data));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/presupuestos`)
      .then(res => res.json())
      .then(data => setPresupuestos(data))
      .catch(err => console.error("❌ Error al cargar presupuestos:", err));
  }, []);

  useEffect(() => {
    const editar = e => {
      setEditingPatient(e.detail);
      setEditMode(true);
      setShowPatientForm(true);
    };
    const eliminar = e => {
      const id = e.detail;
      setPacientes(prev => prev.filter(p => p._id !== id));
      setSelectedPatient(null);
    };
    const actualizar = e => {
      const updated = e.detail;
      setPacientes(prev => prev.map(p => (p._id === updated._id ? updated : p)));
      setSelectedPatient(updated);
    };

    window.addEventListener("editarPaciente", editar);
    window.addEventListener("eliminarPaciente", eliminar);
    window.addEventListener("actualizarPaciente", actualizar);

    return () => {
      window.removeEventListener("editarPaciente", editar);
      window.removeEventListener("eliminarPaciente", eliminar);
      window.removeEventListener("actualizarPaciente", actualizar);
    };
  }, []);

  if (!user) {
    return <Login onLogin={(u) => {
      setUser(u);
      localStorage.setItem('rol', u.rol);
      localStorage.setItem('nombre', u.nombre);
    }} />;
  }

  const isAdmin = user.rol === 'admin';
  const isAsistente = user.rol === 'asistente';
  const isDoctorOrContador = user.rol === 'doctor' || user.rol === 'contador';

  const handleAddAppointment = async (nuevaCita) => {
    try {
      const res = await fetch(`${API_URL}/api/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCita)
      });
      const data = await res.json();
      setCitas(prev => [...prev, data]);
      alert("✅ Cita creada correctamente");
    } catch (err) {
      console.error("❌ Error al crear cita:", err);
      alert("Error al guardar la cita");
    }
  };

  const handleEditAppointment = async (citaEditada) => {
    try {
      const res = await fetch(`${API_URL}/api/citas/${citaEditada._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(citaEditada)
      });
      const data = await res.json();
      setCitas(prev => prev.map(c => (c._id === data._id ? data : c)));
      alert("✅ Cita actualizada correctamente");
    } catch (err) {
      console.error("❌ Error al actualizar cita:", err);
      alert("Error al editar la cita");
    }
  };

  const renderSidebar = () => (
    <div className="space-y-2 text-sm">
      <button onClick={() => { setCurrentView('dashboard'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 flex items-center space-x-2">
        <span className="text-xl">📊</span>
        <span className="hidden md:inline">Dashboard</span>
      </button>
      {(isAdmin || isDoctorOrContador || isAsistente) && (
        <>
          <button onClick={() => { setCurrentView('pacientes'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 flex items-center space-x-2">
            <span className="text-xl">🧑‍⚕️</span>
            <span className="hidden md:inline">Pacientes</span>
          </button>
          <button onClick={() => { setCurrentView('calendario'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 flex items-center space-x-2">
            <span className="text-xl">📅</span>
            <span className="hidden md:inline">Calendario</span>
          </button>
        </>
      )}
      {(isAdmin || isDoctorOrContador) && (
        <>
          <button onClick={() => { setCurrentView('presupuestos'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 flex items-center space-x-2">
            <span className="text-xl">💰</span>
            <span className="hidden md:inline">Presupuestos</span>
          </button>
          <button onClick={() => { setCurrentView('inventario'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 flex items-center space-x-2">
            <span className="text-xl">📦</span>
            <span className="hidden md:inline">Inventario</span>
          </button>
          <button onClick={() => { setCurrentView('reportes'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 flex items-center space-x-2">
            <span className="text-xl">📈</span>
            <span className="hidden md:inline">Reportes</span>
          </button>
        </>
      )}
      {isAdmin && (
        <button onClick={() => { setCurrentView('configuracion'); setShowMobileMenu(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-indigo-100 flex items-center space-x-2">
          <span className="text-xl">⚙️</span>
          <span className="hidden md:inline">Configuración</span>
        </button>
      )}
      <button onClick={logout} className="w-full text-left px-4 py-2 mt-2 rounded-lg text-red-500 hover:bg-red-100 flex items-center space-x-2">
        <span className="text-xl">🚪</span>
        <span className="hidden md:inline">Cerrar sesión</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-indigo-50">
      <LayoutHeader
        nombreUsuario={user.nombre}
        onLogout={logout}
        onToggleMenu={() => setShowMobileMenu(!showMobileMenu)}
      />

      {/* Menú lateral móvil */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-white z-50 p-6 shadow-lg">
          <button onClick={() => setShowMobileMenu(false)} className="text-right w-full text-red-500 mb-4">✖ Cerrar</button>
          {renderSidebar()}
        </div>
      )}

      {/* Layout con Sidebar y contenido */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        {/* Menú lateral desktop */}
        <div className="hidden md:block col-span-12 md:col-span-3">
          <div className="bg-white rounded-2xl shadow-md p-5 border border-indigo-100">
            <h2 className="font-bold mb-4 text-indigo-800 uppercase tracking-wide text-sm">Menú Principal</h2>
            {renderSidebar()}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="col-span-12 md:col-span-9 space-y-6">
          {currentView === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Pacientes" value={pacientes.length} color="indigo" trend="+3 hoy" />
                <DashboardCard title="Citas" value={citas.length} color="green" trend="+2 esta semana" />
                <DashboardCard title="Presupuestos" value={presupuestos.length} color="purple" trend="+1 este mes" />
                <DashboardCard title="Recetas" value={recetas.length} color="yellow" trend="+5" />
              </div>
              <WeeklyAppointments citas={citas} pacientes={pacientes} />
            </>
          )}

          {currentView === 'pacientes' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-indigo-800">Pacientes</h2>
                {(isAdmin || isDoctorOrContador || isAsistente) && (
                  <button onClick={() => { setShowPatientForm(true); setEditMode(false); setEditingPatient(null); }} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    ➕ Agregar Paciente
                  </button>
                )}
              </div>

              {showPatientForm ? (
                <PatientForm
                  onSave={(savedPatient) => {
                    if (editMode) {
                      setPacientes(prev => prev.map(p => (p._id === savedPatient._id ? savedPatient : p)));
                      alert("✅ Paciente actualizado con éxito");
                    } else {
                      setPacientes(prev => [...prev, savedPatient]);
                      alert("✅ Paciente creado con éxito");
                    }
                    setShowPatientForm(false);
                    setEditMode(false);
                    setEditingPatient(null);
                    setSelectedPatient(savedPatient);
                  }}
                  onCancel={() => setShowPatientForm(false)}
                  patient={editingPatient}
                />
              ) : (
                <>
                  <PatientList patients={pacientes} onSelectPatient={setSelectedPatient} />
                  {selectedPatient && (
                    <PatientDetailView
                      patient={selectedPatient}
                      onUpdateHistorial={(historial) => {
                        setPacientes(prev =>
                          prev.map(p =>
                            p._id === selectedPatient._id ? { ...p, historial } : p
                          )
                        );
                        setSelectedPatient(prev => ({ ...prev, historial }));
                      }}
                      readOnly={isAsistente}
                    />
                  )}
                </>
              )}
            </>
          )}

          {currentView === 'calendario' && (
            <CalendarView
              citas={citas}
              pacientes={pacientes}
              readOnly={isAsistente}
              onAddAppointment={handleAddAppointment}
              onEditAppointment={handleEditAppointment}
            />
          )}

          {currentView === 'presupuestos' && !isAsistente && <BudgetView presupuestos={presupuestos} setPresupuestos={setPresupuestos} pacientes={pacientes} />}
          {currentView === 'inventario' && !isAsistente && <InventoryManager />}
          {currentView === 'reportes' && <ReportsView />}
          {currentView === 'configuracion' && isAdmin && <UserManager />}
          {currentView === 'asistente' && <AssistantView />}
        </div>
      </div>
    </div>
  );
};

export default App;
