import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { eachMinuteOfInterval, parseISO, format } from 'date-fns';

//  Get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

//  Add a new doctor
export const addDoctor = async (req, res) => {
  const { name, specialization, workingHours } = req.body;

  try {
    const newDoctor = new Doctor({ name, specialization, workingHours });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(400).json({ message: 'Error adding doctor', error: error.message });
  }
};

//  Get available slots for a doctor
export const getDoctorTimeSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  try {
    const doctor = await Doctor.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // Fetch existing appointments
    const appointments = await Appointment.find({
      doctorId: id,
      date,
    });

    // Generate all 30-minute slots based on working hours
    const allSlots = eachMinuteOfInterval(
      {
        start: parseISO(`${date}T${doctor.workingHours.start}`),
        end: parseISO(`${date}T${doctor.workingHours.end}`),
      },
      { step: 30 }
    );

    // Filter out booked slots
    const availableSlots = allSlots.filter(
      (slot) => !appointments.some(
        (appt) => format(new Date(`${date}T${appt.time}`), 'HH:mm') === format(slot, 'HH:mm')
      )
    ).map(slot => format(slot, 'HH:mm'));

    res.status(200).json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slots', error: error.message });
  }
};

//  Book an appointment
export const bookAppointment = async (req, res) => {
  const { doctorId, patientName, patientEmail, date, time } = req.body;

  try {
    // Check if the slot is already booked
    const existingAppointment = await Appointment.findOne({ doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    // Book the new appointment
    const appointment = new Appointment({ doctorId, patientName, patientEmail, date, time });
    await appointment.save();

    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(400).json({ message: 'Error booking appointment', error: error.message });
  }
};

//  Delete a doctor
export const deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(id);
    if (!deletedDoctor) return res.status(404).json({ message: 'Doctor not found' });

    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
};

//  Update doctor details
export const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { name, specialization, workingHours } = req.body;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { name, specialization, workingHours },
      { new: true }
    );

    if (!updatedDoctor) return res.status(404).json({ message: 'Doctor not found' });

    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating doctor', error: error.message });
  }
};
