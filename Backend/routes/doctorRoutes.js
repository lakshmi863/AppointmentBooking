import express from 'express';
import {
  getAllDoctors,
  addDoctor,
  getDoctorTimeSlots,
  bookAppointment,
  deleteDoctor,
  updateDoctor
} from '../controllers/doctorController.js';

const router = express.Router();

//  Get all doctors
router.get('/', getAllDoctors);

//  Add a new doctor
router.post('/', addDoctor);

//  Get available time slots for a doctor
router.get('/:id/slots', getDoctorTimeSlots);

//  Book an appointment
router.post('/appointments/book', bookAppointment);

//  Delete a doctor
router.delete('/:id', deleteDoctor);

//  Update doctor details
router.put('/:id', updateDoctor);

export default router;
