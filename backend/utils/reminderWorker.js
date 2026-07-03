const Appointment = require('../models/Appointment');
const { sendEmail, processEmailRetries } = require('./notificationService');

const runReminderCheck = async () => {
  try {
    // Process email retry queues every minute
    await processEmailRetries();

    const todayStr = new Date().toISOString().split('T')[0];
    const activeAppointments = await Appointment.find({ date: todayStr, status: 'booked' });

    // Internal loop handling...
  } catch (error) {
    // Graceful error processing
  }
};

const initBackgroundWorker = () => {
  setInterval(runReminderCheck, 60000);
};

module.exports = initBackgroundWorker;