const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth'); // If you use auth protection

router.post('/book', appointmentController.bookAppointment);
router.post('/post-visit', appointmentController.addPostVisitSummary);

module.exports = router;