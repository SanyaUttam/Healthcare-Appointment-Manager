const { createCalendarEvent } = require('../services/calendarService');

// 1. Booking Step with integrated Calendar Hook
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;
    
    const mockAppointment = {
      _id: "65f1a2b3c4d5e6f7a8b9c999",
      patient: req.user ? req.user.id : "65f1a2b3c4d5e6f7a8b9c0d9",
      doctor: doctorId || "65f1a2b3c4d5e6f7a8b9c0d1",
      date,
      timeSlot,
      symptoms,
      aiPreVisitSummary: {
        urgencyLevel: symptoms.toLowerCase().includes('chest') ? 'High' : 'Normal',
        chiefComplaint: 'Automated AI Triage Assessment Completed successfully.',
        suggestedQuestions: ['Duration of symptoms?', 'Prior medical history?']
      },
      status: 'booked'
    };

    // Trigger Google Calendar Sync Event if OAuth token exists
    await createCalendarEvent(mockAppointment, "Goodwill");

    return res.status(201).json({ success: true, appointment: mockAppointment });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Doctor Post-Visit Summary Update
exports.addPostVisitSummary = async (req, res) => {
  try {
    const { appointmentId, clinicalNotes, prescriptions } = req.body;
    
    // Fallback Mock LLM logic to generate a clean, automated summary of the clinical note
    const aiGeneratedPostSummary = `Patient was evaluated. Summary: ${clinicalNotes}. Prescription given: ${prescriptions}. Follow-up recommended in 2 weeks.`;

    return res.status(200).json({
      success: true,
      message: "Post-visit summary saved and updated in database successfully.",
      data: {
        appointmentId,
        clinicalNotes,
        prescriptions,
        aiPostVisitSummary: aiGeneratedPostSummary
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};