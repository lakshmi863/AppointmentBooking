
import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
     name: { type: String, required: true },
     specialization: { type: String, default: 'General' },
     workingHours: {
     start: { type: String, required: true }, 
     end: { type: String, required: true } 
     }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', DoctorSchema);
export default Doctor;