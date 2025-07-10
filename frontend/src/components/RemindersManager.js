import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL;

const RemindersManager = ({ patient }) => {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    if (!patient?._id) return;
    fetch(`${API_URL}/api/recordatorios/${patient._id}`)
      .then(res => res.json())
      .then(data => setReminders(data))
      .catch(err => {
        console.error('Error al cargar recordatorios:', err);
        alert('Error al cargar recordatorios');
      });
  }, [patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReminder({ ...newReminder, [name]: value });
  };

  const addReminder = async () => {
    if (!newReminder.title || !newReminder.date || !newReminder.time || !patient?._id) {
      alert('Completa todos los campos y asegúrate de que el paciente esté cargado.');
      return;
    }

    const reminder = {
      ...newReminder,
      patientId: patient._id,
      completed: false
    };

    try {
      const res = await fetch(`${API_URL}/api/recordatorios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder)
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al guardar:', errorData);
        return alert('❌ Error al guardar recordatorio');
      }

      const data = await res.json();
      setReminders(prev => [...prev, data]);
      setNewReminder({ title: '', date: '', time: '' });
    } catch (err) {
      console.error('Error en la solicitud:', err);
      alert('Error al guardar recordatorio');
    }
  };

  const toggleComplete = async (reminder) => {
    try {
      const updated = await fetch(`${API_URL}/api/recordatorios/${reminder._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !reminder.completed })
      });
      const result = await updated.json();
      setReminders(prev => prev.map(r => r._id === result._id ? result : r));
    } catch (err) {
      console.error('Error al actualizar:', err);
      alert('Error al actualizar');
    }
  };

  const deleteReminder = async (id) => {
    try {
      await fetch(`${API_URL}/api/recordatorios/${id}`, {
        method: 'DELETE'
      });
      setReminders(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar');
    }
  };

  const sendReminderWhatsApp = (reminder) => {
    const numero = patient?.telefono?.replace(/[^0-9]/g, '');
    if (!numero) return alert('No hay número registrado');

    const mensaje = `🔔 Hola ${patient?.nombre}, le recordamos: ${reminder.title} el día ${reminder.date} a las ${reminder.time}.`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Recordatorios</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          name="title"
          value={newReminder.title}
          onChange={handleInputChange}
          placeholder="Título"
          className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          name="date"
          value={newReminder.date}
          onChange={handleInputChange}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="time"
          name="time"
          value={newReminder.time}
          onChange={handleInputChange}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        onClick={addReminder}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-6"
      >
        Agregar Recordatorio
      </button>

      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map(reminder => (
            <div key={reminder._id} className={`flex items-center p-3 border rounded-lg justify-between ${reminder.completed ? 'bg-green-50' : ''}`}>
              <div className="flex-1">
                <p className={`font-medium ${reminder.completed ? 'line-through text-gray-400' : ''}`}>{reminder.title}</p>
                <p className="text-sm text-gray-500">{reminder.date} a las {reminder.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleComplete(reminder)} title="Completado">✅</button>
                <button onClick={() => sendReminderWhatsApp(reminder)} title="Enviar WhatsApp">🟢</button>
                <button onClick={() => deleteReminder(reminder._id)} title="Eliminar" className="text-red-600">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No hay recordatorios programados</p>
      )}
    </div>
  );
};

export default RemindersManager;
