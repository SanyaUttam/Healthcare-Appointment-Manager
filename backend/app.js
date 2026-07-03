const express = require("express");
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve all static files (CSS, JS) from the public folder automatically
app.use(express.static(path.join(__dirname, 'public')));

// Mount API Routing Modules
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/calendar', require('./routes/calendarRoutes'));

// Explicit Multi-Page Navigation Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/patient", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'patient.html'));
});

app.get("/doctor", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctor.html'));
});

module.exports = app;