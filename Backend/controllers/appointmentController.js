import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js'; 

// Get all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctorId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, appointmentType, notes, date, time, duration } = req.body;

  
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: 'Invalid Doctor ID' });
    }

   
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }


    const newAppointment = new Appointment({
      doctorId,
      patientName,
      appointmentType,
      notes,
      date,
      time,
      duration,
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment created successfully' });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// Update an existing appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(' Error updating appointment:', error);
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting appointment with ID:", id); 

    if (!id) return res.status(400).json({ message: "Appointment ID is required." });

    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Appointment not found." });

    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get upcoming appointments
export const getUpcomingAppointments = async (req, res) => {
  try {
    const currentDate = new Date();
    const appointments = await Appointment.find({ date: { $gte: currentDate } }).populate('doctorId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming appointments', error });
  }
};
