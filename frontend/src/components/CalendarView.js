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
  const [appointmentData, setAppointmentData] = useState(null);

  const handleWeekChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const handleSelectSlot = (day, time) => {
    if (readOnly) return;
    setSelectedDay(day);
    setSelectedTime(time);
    setAppointmentData({
      pacienteId: '',
      fecha: day.toISOString().split('T')[0],
      hora: time,
      motivo: '',
      estado: 'pendiente',
    });
    setModalOpen(true);
  };

  const handleEditCita = (cita) => {
    if (readOnly) return;
    const [y, m, d] = cita.fecha.split('-').map(Number);
    const day = new Date(y, m - 1, d);
    setSelectedDay(day);
    setSelectedTime(cita.hora);
    setAppointmentData({ ...cita });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAppointmentData(null);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleSaveCita = () => {
    if (!appointmentData) return;
    if (appointmentData._id) {
      onEditAppointment(appointmentData);
    } else {
      onAddAppointment(appointmentData);
    }
    handleCloseModal();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Panel lateral izquierdo */}
      <div className="w-full md:w-64">
        <SidePanel
          currentDate={currentDate}
          onWeekChange={handleWeekChange}
          citas={citas}
          pacientes={pacientes}
          onSelectDay={setSelectedDay}
        />
      </div>

      {/* Calendario semanal */}
      <div className="flex-1 overflow-x-auto">
        <WeeklyCalendar
          weekStart={currentDate}
          citas={citas}
          pacientes={pacientes}
          onOpenModal={handleSelectSlot}
          onEditCita={handleEditCita}
        />
      </div>

      {/* Modal para agregar o editar cita */}
      {modalOpen && (
        <AppointmentModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCita}
          appointment={appointmentData}
          pacientes={pacientes}
          setAppointment={setAppointmentData}
        />
      )}
    </div>
  );
};

export default CalendarView;
