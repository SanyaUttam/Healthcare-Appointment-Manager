const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ensure these functions match the exported keys perfectly
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;