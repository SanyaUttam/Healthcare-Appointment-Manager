const nodemailer = require('nodemailer');

const failedEmailQueue = [];

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Healthcare Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    return true;
  } catch (error) {
    // If the transmission breaks, store the payload in a memory queue for automated retries
    failedEmailQueue.push({ to, subject, text, attempts: 1 });
    return false;
  }
};

// Background worker helper method to re-attempt dropped messages
exports.processEmailRetries = async () => {
  if (failedEmailQueue.length === 0) return;

  for (let i = failedEmailQueue.length - 1; i >= 0; i--) {
    const email = failedEmailQueue[i];
    try {
      await transporter.sendMail({
        from: `"Healthcare Portal" <${process.env.EMAIL_USER}>`,
        to: email.to,
        subject: email.subject,
        text: email.text
      });
      failedEmailQueue.splice(i, 1); // Remove on success
    } catch (err) {
      email.attempts += 1;
      if (email.attempts >= 3) {
        failedEmailQueue.splice(i, 1); // Drop if it fails 3 times to preserve execution stack
      }
    }
  }
};