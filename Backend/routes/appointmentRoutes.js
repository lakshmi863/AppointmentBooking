import express from 'express';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment, getUpcomingAppointments } from '../controllers/appointmentController.js';


const router = express.Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.get('/upcoming', getUpcomingAppointments);

export default router;
