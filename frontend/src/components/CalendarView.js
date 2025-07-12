import React, { useState } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import SidePanel from './SidePanel';
import AppointmentModal from './AppointmentModal';

const CalendarView = ({
  citas = [],
  pacientes = [],
  onAddAppointment = () => {},
  onEditAppointment = () => {},
  readOnly = false,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [editingCita, setEditingCita] = useState(null);

  const handleWeekChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const handleSelectSlot = (day, time) => {
    if (readOnly) return;
    setSelectedDay(day);
    setSelectedTime(time);
    setEditingCita(null);
    setModalOpen(true);
  };

  const handleEditCita = (cita) => {
    if (readOnly) return;
    setEditingCita(cita);
    const [year, month, day] = cita.fecha.split('-').map(Number);
    setSelectedDay(new Date(year, month - 1, day));
    setSelectedTime(cita.hora);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCita(null);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleSaveCita = (cita) => {
    if (editingCita) {
      onEditAppointment({ ...cita, _id: editingCita._id });
    } else {
      onAddAppointment(cita);
    }
    handleCloseModal();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64">
        <SidePanel
          currentDate={currentDate}
          onWeekChange={handleWeekChange}
          citas={citas}
          pacientes={pacientes}
          onSelectDay={setSelectedDay}
        />
      </div>

      <div className="flex-1">
        <WeeklyCalendar
          currentDate={currentDate}
          citas={citas}
          pacientes={pacientes}
          onSelectSlot={handleSelectSlot}
          onEditCita={handleEditCita}
        />
      </div>

      {modalOpen && (
        <AppointmentModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCita}
          pacientes={pacientes}
          defaultDate={selectedDay}
          defaultTime={selectedTime}
          initialData={editingCita}
        />
      )}
    </div>
  );
};

export default CalendarView;
