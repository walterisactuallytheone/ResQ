const sgMail = require('@sendgrid/mail');

/**
 * Email Service for sending notifications
 */
class EmailService {
  constructor() {
    // Set SendGrid API key
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log('SendGrid API key set');
    } else {
      console.warn('SendGrid API key not found in environment variables');
    }
  }

  /**
   * Send appointment reminder email
   * @param {Object} appointment - Appointment data
   * @param {Object} user - User data
   * @param {String} timeframe - Time before appointment ('day', 'hour', or 'at-time')
   * @returns {Promise} - Email sending result
   */
  async sendAppointmentReminder(appointment, user, timeframe) {
    let timeframeText;
    if (timeframe === 'day') {
      timeframeText = 'tomorrow';
    } else if (timeframe === 'hour') {
      timeframeText = 'in an hour';
    } else if (timeframe === 'at-time') {
      timeframeText = 'now';
    } else {
      timeframeText = 'soon';
    }
    
    const subject = `Reminder: Appointment with Dr. ${appointment.doctorName} ${timeframeText}`;
    
    let introMessage;
    if (timeframe === 'at-time') {
      introMessage = `<p>Your appointment is starting now:</p>`;
    } else {
      introMessage = `<p>This is a reminder about your upcoming appointment:</p>`;
    }
    
    const message = `
      <h2>Appointment Reminder</h2>
      <p>Hello ${user.firstName},</p>
      ${introMessage}
      <ul>
        <li><strong>Doctor:</strong> Dr. ${appointment.doctorName}</li>
        <li><strong>Speciality:</strong> ${appointment.speciality}</li>
        <li><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${appointment.appointmentTime}</li>
        <li><strong>Location:</strong> ${appointment.location}</li>
      </ul>
      ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      <p>Thank you for using ResQ Health Services!</p>
    `;

    return this.sendEmail(user.email, subject, message);
  }

  /**
   * Send medication reminder email
   * @param {Object} medication - Medication data
   * @param {Object} user - User data
   * @param {String} timeframe - Time for medication ('at-time' or 'before')
   * @param {String} time - Specific time for medication
   * @returns {Promise} - Email sending result
   */
  async sendMedicationReminder(medication, user, timeframe, time) {
    const subject = `Reminder: Time to take ${medication.medicationName}`;
    
    const message = `
      <h2>Medication Reminder</h2>
      <p>Hello ${user.firstName},</p>
      <p>${timeframe === 'at-time' ? 
        `It's time to take your medication:` : 
        `Reminder to take your medication soon:`}</p>
      <ul>
        <li><strong>Medication:</strong> ${medication.medicationName}</li>
        <li><strong>Dosage:</strong> ${medication.dosage}</li>
        <li><strong>Time:</strong> ${time}</li>
      </ul>
      ${medication.instructions ? `<p><strong>Instructions:</strong> ${medication.instructions}</p>` : ''}
      <p>Thank you for using ResQ Health Services!</p>
    `;

    return this.sendEmail(user.email, subject, message);
  }

  /**
   * Send email
   * @param {String} to - Recipient email
   * @param {String} subject - Email subject
   * @param {String} message - Email message
   * @returns {Promise} - Email sending result
   */
  async sendEmail(to, subject, message) {
    console.log(`📧 Attempting to send email: ${subject} to ${to}`);
    
    // For development/testing purposes: if SendGrid is not configured, log the email and return success
    // This allows the app to function without actual email sending during development
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.log('🔔 Development mode: SENDGRID_API_KEY not found. Simulating email success.');
      console.log('📧 Would have sent email:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message.substring(0, 100)}...`);
      
      // Return success for development purposes
      return { 
        success: true, 
        sent: true, 
        dev_mode: true, 
        message: 'Email sending simulated in development mode' 
      };
    }

    // Only do actual API call if we have a proper API key
    try {
      sgMail.setApiKey(apiKey);
      
      // Use the verified FROM_EMAIL from environment variables
      // This is critical - SendGrid requires the from email to be verified
      const fromEmail = process.env.FROM_EMAIL;
      if (!fromEmail) {
        throw new Error('FROM_EMAIL environment variable is missing');
      }
      
      const msg = {
        to,
        from: fromEmail,
        subject,
        html: message,
      };
      
      console.log('📧 Sending email with SendGrid...');
      const response = await sgMail.send(msg);
      console.log('📧 Email sent successfully:', response[0].statusCode);
      return { success: true, sent: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
      console.error('❌ Error sending email:', error);
      if (error.response) {
        console.error('❌ SendGrid API response error:', {
          status: error.response.status,
          body: error.response.body,
          headers: error.response.headers
        });
      }
      
      // Log detailed error information to help with debugging
      console.error('❌ Email sending error details:');
      console.error(`Recipient: ${to}`);
      console.error(`Subject: ${subject}`);
      console.error(`API Key valid: ${!!apiKey}`);
      
      return { 
        success: false, 
        sent: false, 
        error: error.message, 
        details: error.response ? {
          status: error.response.status,
          body: error.response.body
        } : undefined
      };
    }
  }
}

module.exports = new EmailService(); 