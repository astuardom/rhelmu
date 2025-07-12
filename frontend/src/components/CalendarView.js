import React, { useState } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import SidePanel from './SidePanel';
import AppointmentModal from './AppointmentModal';

const CalendarView = ({ citas = [], pacientes = [], onAddAppointment = () => {}, onEditAppointment = () => {}, readOnly = false }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalMode, setModalMode] = useState('new'); // 'new' o 'edit'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [weekStart, setWeekStart] = useState(getStartOfWeek(new Date()));

  function getStartOfWeek(date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Lunes como inicio
    return new Date(date.setDate(diff));
  }

  const handleTimeBlockClick = (date, time) => {
    if (readOnly) return;
    setSelectedDate(new Date(`${date}T${time}`));
    setModalMode('new');
    setSelectedAppointment(null);
  };

  const handleAppointmentClick = (appointment) => {
    if (readOnly) return;
    setModalMode('edit');
    setSelectedAppointment(appointment);
    setSelectedDate(new Date(`${appointment.fecha}T${appointment.hora}`));
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedAppointment(null);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-3">
      <SidePanel
        citas={citas}
        pacientes={pacientes}
        currentDate={weekStart}
        onWeekChange={(offset) => {
          const nuevaFecha = new Date(weekStart);
          nuevaFecha.setDate(nuevaFecha.getDate() + offset * 7);
          setWeekStart(nuevaFecha);
        }}
      />
      </div>

      <div className="col-span-12 md:col-span-9">
        <div className="bg-white rounded-xl shadow p-4">
          <WeeklyCalendar
            citas={citas}
            pacientes={pacientes}
            weekStart={weekStart}
            onTimeBlockClick={handleTimeBlockClick}
            onAppointmentClick={handleAppointmentClick}
          />
        </div>
      </div>

      {selectedDate && (
        <AppointmentModal
          mode={modalMode}
          date={selectedDate}
          pacientes={pacientes}
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          onSave={(data) => {
            if (modalMode === 'new') onAddAppointment(data);
            else onEditAppointment(data);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};

export default CalendarView;
