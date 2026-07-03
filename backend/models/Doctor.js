const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Links directly to the base User credential profile
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  workingHours: {
    start: { type: String, required: true, default: "09:00" }, // 24-hour format (HH:MM)
    end: { type: String, required: true, default: "17:00" }
  },
  slotDuration: {
    type: Number, // Slot duration measured in minutes
    required: true,
    default: 30
  },
  leaveDays: [{
    type: String // Dates stored as flat ISO strings "YYYY-MM-DD" for exact calendar matching
  }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);

