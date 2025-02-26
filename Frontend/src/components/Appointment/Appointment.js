import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';

const Appointment = ({
  doctorId: initialDoctorId = 'defaultDoctorId',
  date = new Date().toISOString().split('T')[0],
  time = '09:00',
  onClose,
  existingAppointment,
}) => {
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [doctors, setDoctors] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');

  // 🟡 Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    };

    fetchDoctors();
  }, []);

  // 🟡 Pre-fill form when editing
  useEffect(() => {
    console.log('Existing Appointment:', existingAppointment); // 🟢 Debug log

    if (existingAppointment) {
      setDoctorId(existingAppointment.doctorId || 'defaultDoctorId');
      setPatientName(existingAppointment.patientName || '');
      setAppointmentType(existingAppointment.appointmentType || '');
      setNotes(existingAppointment.notes || '');
      setDuration(existingAppointment.duration || '');
    }
  }, [existingAppointment]);

  // ✅ Handle Form Submission (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      doctorId === 'defaultDoctorId' ||
      !patientName ||
      !appointmentType ||
      !date ||
      !time ||
      !duration
    ) {
      setError('Please fill in all required fields and select a valid doctor.');
      return;
    }

    const payload = {
      doctorId,
      patientName,
      appointmentType,
      notes,
      date,
      time,
      duration,
    };

    console.log('Payload:', payload);

    try {
      let response;

      if (existingAppointment && existingAppointment._id) {
        // ✅ Update existing appointment
        response = await axios.put(
          `http://localhost:5000/appointments/${existingAppointment._id}`,
          payload
        );
      } else {
        // ✅ Create new appointment
        response = await axios.post('http://localhost:5000/appointments', payload);
      }

      if (response.status === 200 || response.status === 201) {
        alert(`Appointment ${existingAppointment ? 'updated' : 'booked'} successfully!`);
        onClose();
      }
    } catch (err) {
      console.error('Error:', err.response);
      setError('Failed to submit the form. Please try again.');
    }
  };

  // 🗑️ Handle Delete Appointment
  const handleDelete = async () => {
    console.log("Existing Appointment Before Deletion:", existingAppointment);
  
    if (!existingAppointment || !existingAppointment._id) {
      console.error('Error: Appointment ID is missing.', existingAppointment);
      setError('Cannot delete: Missing Appointment ID.');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/appointments/${existingAppointment._id}`);
      alert('Appointment deleted successfully');
      onClose();
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError('Failed to delete the appointment. Please try again.');
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">
          {existingAppointment ? 'Edit Appointment' : 'Book Appointment'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Doctor Selection */}
          <div className="mb-3">
            <label className="block font-medium">Select Doctor</label>
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="defaultDoctorId">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Name */}
          <div className="mb-3">
            <label className="block font-medium">Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Appointment Type */}
          <div className="mb-3">
            <label className="block font-medium">Appointment Type</label>
            <select
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          {/* Duration */}
          <div className="mb-3">
            <label className="block font-medium">Duration (in minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter duration"
              min="1"
            />
          </div>

          {/* Notes */}
          <div className="mb-3">
            <label className="block font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Additional notes (optional)"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>

            {existingAppointment && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {existingAppointment ? 'Update' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
