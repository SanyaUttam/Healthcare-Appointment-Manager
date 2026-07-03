const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

exports.createDoctorProfile = async (req, res) => {
  try {
    const { userId, specialization, workingHours, slotDuration } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== 'doctor') {
      return res.status(400).json({ message: 'Valid doctor user ID is required' });
    }

    const profileExists = await Doctor.findOne({ user: userId });
    if (profileExists) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const doctor = await Doctor.create({
      user: userId,
      specialization,
      workingHours,
      slotDuration
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.setDoctorLeave = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.body; 

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    if (doctor.leaveDays.includes(date)) {
      return res.status(400).json({ message: 'Leave already marked for this date' });
    }

    doctor.leaveDays.push(date);
    await doctor.save();

    const affectedAppointments = await Appointment.find({
      doctor: doctorId,
      date: date,
      status: 'booked'
    }).populate('patient', 'name email');

    for (const appt of affectedAppointments) {
      appt.status = 'cancelled';
      await appt.save();
    }

    res.json({
      message: 'Leave configured successfully and overlapping appointments cancelled',
      cancelledCount: affectedAppointments.length,
      affectedPatients: affectedAppointments.map(a => a.patient)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};