import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Appointment from '../Appointment/Appointment';
import './AppointmentList.css'
const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    console.log('Deleting appointment with ID:', id);

    if (!id) {
      alert('Invalid appointment ID');
      return;
    }

    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setIsDeleting(true);
      try {
        await axios.delete(`http://localhost:5000/appointments/${id}`);
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
      } catch (err) {
        console.error('Error deleting appointment:', err);
        alert('Failed to delete the appointment.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>

     

      {appointments.length === 0 ? (
        <p>No upcoming appointments.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="border p-4 rounded shadow">
              <p><strong>Patient:</strong> {appointment.patientName}</p>
              <p><strong>Type:</strong> {appointment.appointmentType}</p>
              <p><strong>Date:</strong> {appointment.date}</p>
              <p><strong>Time:</strong> {appointment.time}</p>
              <p><strong>Duration:</strong> {appointment.duration} min</p>

              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(appointment)}
                  className="px-4 py-2 bg-yellow-400 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(appointment?.id)}
                  className={`px-4 py-2 ${isDeleting ? 'bg-gray-400' : 'bg-red-500'} text-white rounded`}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Cancel'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <Appointment
          existingAppointment={selectedAppointment}
          onClose={() => {
            setShowForm(false);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
};

export default AppointmentList;
