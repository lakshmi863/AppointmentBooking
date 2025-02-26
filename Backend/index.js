import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/dataBase.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB

connectDB();

// Routes
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);

// Root Route
app.get('/', (req, res) => res.send('Appointment Booking System API Running'));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
