const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.getAuthUrl = () => {
  const scopes = ['https://www.googleapis.com/auth/calendar.events'];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};

exports.setClientCredentials = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

exports.createCalendarEvent = async (appointment, doctorName) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const startDateTime = `${appointment.date}T${appointment.timeSlot}:00`;
    const endDateTime = `${appointment.date}T${parseInt(appointment.timeSlot.split(':')[0]) + 1}:${appointment.timeSlot.split(':')[1]}:00`;

    const event = {
      summary: `Medical Consultation with Dr. ${doctorName}`,
      description: `Symptoms reported: ${appointment.symptoms}\n\nAI Urgency Assessment: ${appointment.aiPreVisitSummary.urgencyLevel}`,
      start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
      end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    return response.data.id;
  } catch (error) {
    return null;
  }
};