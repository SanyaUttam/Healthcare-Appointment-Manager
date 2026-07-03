const express = require('express');
const router = express.Router();
const { createDoctorProfile, getAllDoctors, setDoctorLeave } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.post('/profile', protect, authorize('admin'), createDoctorProfile);
router.get('/', protect, getAllDoctors);
router.post('/:doctorId/leave', protect, authorize('admin', 'doctor'), setDoctorLeave);

module.exports = router;