import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Appointment from '../Appointment/Appointment';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/doctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchSlots = async (doctorId, date) => {
    try {
      const response = await axios.get(`http://localhost:5000/doctors/${doctorId}/slots?date=${date}`);
      setSlots(response.data);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleSlotSelect = (e) => {
    const slot = e.target.value;
    setSelectedSlot(slot);

    if (selectedDoctor && selectedDate && slot) {
      setShowAppointmentForm(true);
    } else {
      console.warn('Please select all fields before booking.');
    }
  };

  return (
    <div>
      <h2>Select a Doctor</h2>
      <label>Doctor:</label>
      <select
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(e.target.value)}
        required
      >
        <option value="">-- Select Doctor --</option>
        {doctors.map((doctor) => (
          <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
        ))}
      </select>

      {selectedDoctor && (
        <>
          <label>Date:</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              fetchSlots(selectedDoctor, e.target.value);
              setShowAppointmentForm(false);
            }}
            required
          />

          {slots.length > 0 && (
            <>
              <label>Available Slots:</label>
              <select
                value={selectedSlot}
                onChange={handleSlotSelect}
                required
              >
                <option value="">-- Select Slot --</option>
                {slots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>
            </>
          )}

          {showAppointmentForm && (
            <Appointment
              doctorId={selectedDoctor}
              date={selectedDate}
              time={selectedSlot}
              onClose={() => setShowAppointmentForm(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DoctorsList;
