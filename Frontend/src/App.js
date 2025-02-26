import React, { useState } from 'react';
import DoctorsList from './components/DoctorsList/DoctorsList';
import Appointment from './components/Appointment/Appointment';
import AppointmentList from './components/AppointmentList/AppointmentList';
import './App.css';
const App = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorId: '',
    selectedDate: '',
    selectedSlot: ''
  });
  const [showAppointmentList, setShowAppointmentList] = useState(false); // ➔ NEW State

  // Handle doctor selection
  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    console.log('Selected Doctor:', doctor);
  };

  // Open appointment form with slot details
  const handleSlotClick = (doctorId, selectedDate, selectedSlot) => {
    setAppointmentDetails({ doctorId, selectedDate, selectedSlot });
    setShowAppointmentForm(true);
  };

  // Close the appointment form
  const closeAppointmentForm = () => setShowAppointmentForm(false);

  return (
    <div className="App p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Appointment Booking System</h1>

      {/* Toggle Appointment List */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowAppointmentList(!showAppointmentList)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showAppointmentList ? 'Hide Appointments' : 'View Appointments'}
        </button>
      </div>

      {/* Appointment List Component */}
      {showAppointmentList && <AppointmentList />}

      {/* Doctor List Component */}
      <DoctorsList onSelectDoctor={handleSelectDoctor} onSlotClick={handleSlotClick} />

      {/* Selected Doctor Details */}
      {selectedDoctor && (
        <div className="selected-doctor-details mt-4 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold">Selected Doctor:</h2>
          <p><strong>Name:</strong> {selectedDoctor.name}</p>
          <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentForm && (
        <Appointment
          doctorId={appointmentDetails.doctorId}
          selectedDate={appointmentDetails.selectedDate}
          selectedSlot={appointmentDetails.selectedSlot}
          onClose={closeAppointmentForm}
          onBookingSuccess={closeAppointmentForm}
        />
      )}
    </div>
  );
};

export default App;
