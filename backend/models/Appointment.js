const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: String, // Represented as "YYYY-MM-DD" for fast indexing and conflict evaluation
    required: true
  },
  timeSlot: {
    type: String, // Specific appointment hour segment: "10:30"
    required: true
  },
  symptoms: {
    type: String,
    required: [true, 'Symptoms description is required']
  },
  // AI-Powered Pre-Visit Assessment Fields
  aiPreVisitSummary: {
    urgencyLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    chiefComplaint: { type: String },
    suggestedQuestions: [{ type: String }]
  },
  // Clinical Notes & AI Post-Visit Guidance
  clinicalNotes: { type: String },
  prescription: { type: String },
  aiPostVisitSummary: { type: String }, // Patient-friendly converted text layout
  
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled'],
    default: 'booked'
  },
  googleCalendarEventId: { type: String } // Caches sync reference for real-time updates/deletions
}, { timestamps: true });

// Enforce a strict compound index preventing overlapping bookings for the exact same slot with a doctor
AppointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);