const express = require('express');
const router = express.Router();
const { getAuthUrl, setClientCredentials } = require('../services/calendarService');

router.get('/connect', (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Authorization code missing.');
    }
    await setClientCredentials(code);
    res.send('<h1>🚀 Google Calendar Connected & Authorized Successfully!</h1><p>You can close this tab and proceed to book appointments.</p>');
  } catch (error) {
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
});

module.exports = router;