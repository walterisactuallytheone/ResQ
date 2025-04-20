const Appointment = require('../models/Appointment');
const Medication = require('../models/Medication');
const User = require('../models/User');
const emailService = require('./emailService');

/**
 * Reminder service for scheduling and sending reminders
 */
class ReminderService {
  /**
   * Initialize reminder service
   */
  constructor() {
    this.checkIntervalMinutes = 1; // Changed from 5 to 1 minute for more frequent checking
    this.isRunning = false;
  }

  /**
   * Start the reminder scheduler
   */
  startScheduler() {
    if (this.isRunning) return;
    
    console.log('Starting reminder scheduler service...');
    
    // Run immediately on startup
    this.checkReminders();
    
    // Then run at regular intervals
    this.intervalId = setInterval(() => {
      this.checkReminders();
    }, this.checkIntervalMinutes * 60 * 1000);
    
    this.isRunning = true;
    console.log(`Reminder scheduler is running. Checking every ${this.checkIntervalMinutes} minutes.`);
  }

  /**
   * Stop the reminder scheduler
   */
  stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isRunning = false;
      console.log('Reminder scheduler stopped.');
    }
  }

  /**
   * Check for appointments and medications that need reminders
   */
  async checkReminders() {
    try {
      console.log('Checking for reminders at:', new Date().toISOString());
      
      await this.checkAppointmentReminders();
      await this.checkMedicationReminders();
      
    } catch (error) {
      console.error('Error checking reminders:', error);
    }
  }

  /**
   * Check for upcoming appointments and send reminders
   */
  async checkAppointmentReminders() {
    try {
      const now = new Date();
      
      // Find all appointments - we'll manually filter based on timing instead of using date range
      const appointments = await Appointment.find({
        // Only find appointments where at least one reminder hasn't been sent yet
        $or: [
          { 'emailNotifications.dayBefore.sent': { $ne: true } },
          { 'emailNotifications.hourBefore.sent': { $ne: true } },
          { 'emailNotifications.atTime.sent': { $ne: true } }
        ]
      });
      
      console.log(`Checking ${appointments.length} appointment(s) for reminders`);
      
      for (const appointment of appointments) {
        const user = await User.findById(appointment.user);
        if (!user) {
          console.log(`Skipping appointment ${appointment._id}: user not found`);
          continue;
        }
        
        // Construct full appointment date/time
        const appointmentDateTime = new Date(appointment.appointmentDate);
        
        // Extract hours and minutes from the appointmentTime string (assumed format: "HH:MM")
        const [hours, minutes] = appointment.appointmentTime.split(':').map(Number);
        appointmentDateTime.setHours(hours, minutes, 0, 0);
        
        console.log(`Checking appointment for ${user.email}: ${appointment.doctorName}, ${appointmentDateTime.toLocaleString()}`);
        
        // Day-before reminder
        if (appointment.reminderPreferences.reminderDay && 
            !appointment.emailNotifications?.dayBefore?.sent) {
          
          // Calculate one day before in minutes
          const oneDayInMinutes = 24 * 60;
          const timeDiffMinutes = Math.abs((now - appointmentDateTime) / (1000 * 60));
          
          console.log(`Day-before reminder check: minutes diff = ${timeDiffMinutes}`);
          
          // Check if we're within a 30-minute window of the 24-hour mark before the appointment
          if (Math.abs(timeDiffMinutes - oneDayInMinutes) <= 30) {
            console.log(`Sending day-before reminder for appointment with Dr. ${appointment.doctorName}`);
            const result = await emailService.sendAppointmentReminder(appointment, user, 'day');
            
            // Update appointment with email notification status
            if (result.success) {
              await Appointment.findByIdAndUpdate(appointment._id, {
                'emailNotifications.dayBefore.sent': true,
                'emailNotifications.dayBefore.sentAt': new Date()
              });
              console.log(`✓ Day-before reminder email sent for appointment ${appointment._id}`);
            } else {
              // Store error information
              await Appointment.findByIdAndUpdate(appointment._id, {
                'emailNotifications.dayBefore.error': result.error || 'Unknown error',
                'emailNotifications.dayBefore.errorAt': new Date()
              });
              console.log(`✗ Failed to send day-before reminder for appointment ${appointment._id}: ${result.error || 'Unknown error'}`);
            }
          }
        }
        
        // Hour-before reminder
        if (appointment.reminderPreferences.reminderHour && 
            !appointment.emailNotifications?.hourBefore?.sent) {
          
          // Calculate one hour before in minutes
          const oneHourInMinutes = 60;
          const timeDiffMinutes = Math.abs((now - appointmentDateTime) / (1000 * 60));
          
          console.log(`Hour-before reminder check: minutes diff = ${timeDiffMinutes}`);
          
          // Check if we're within a 5-minute window of the 1-hour mark before the appointment
          if (Math.abs(timeDiffMinutes - oneHourInMinutes) <= 5) {
            console.log(`Sending hour-before reminder for appointment with Dr. ${appointment.doctorName}`);
            const result = await emailService.sendAppointmentReminder(appointment, user, 'hour');
            
            // Update appointment with email notification status
            if (result.success) {
              await Appointment.findByIdAndUpdate(appointment._id, {
                'emailNotifications.hourBefore.sent': true,
                'emailNotifications.hourBefore.sentAt': new Date()
              });
              console.log(`✓ Hour-before reminder email sent for appointment ${appointment._id}`);
            } else {
              // Store error information
              await Appointment.findByIdAndUpdate(appointment._id, {
                'emailNotifications.hourBefore.error': result.error || 'Unknown error',
                'emailNotifications.hourBefore.errorAt': new Date()
              });
              console.log(`✗ Failed to send hour-before reminder for appointment ${appointment._id}: ${result.error || 'Unknown error'}`);
            }
          }
        }
        
        // At-time reminder
        if (appointment.reminderPreferences.reminderAtTime && 
            !appointment.emailNotifications?.atTime?.sent) {
          
          // Calculate time difference in minutes
          const timeDiffMinutes = Math.abs((now - appointmentDateTime) / (1000 * 60));
          
          console.log(`At-time reminder check: minutes diff = ${timeDiffMinutes}`);
          
          // Increased window to 5 minutes for more reliable delivery
          if (timeDiffMinutes <= 5) {
            console.log(`Sending at-time reminder for appointment with Dr. ${appointment.doctorName}`);
            const result = await emailService.sendAppointmentReminder(appointment, user, 'at-time');
            
            // Update appointment with email notification status
            if (result.success) {
              await Appointment.findByIdAndUpdate(appointment._id, {
                'emailNotifications.atTime.sent': true,
                'emailNotifications.atTime.sentAt': new Date()
              });
              console.log(`✓ At-time reminder email sent for appointment ${appointment._id}`);
            } else {
              // Store error information
              await Appointment.findByIdAndUpdate(appointment._id, {
                'emailNotifications.atTime.error': result.error || 'Unknown error',
                'emailNotifications.atTime.errorAt': new Date()
              });
              console.log(`✗ Failed to send at-time reminder for appointment ${appointment._id}: ${result.error || 'Unknown error'}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking appointment reminders:', error);
    }
  }

  /**
   * Check for medications and send reminders
   */
  async checkMedicationReminders() {
    try {
      const now = new Date();
      
      // Find active medications (current date is between start and end date)
      const activeMedications = await Medication.find({
        startDate: { $lte: now },
        $or: [
          { endDate: null },
          { endDate: { $gte: now } }
        ]
      });
      
      for (const medication of activeMedications) {
        const user = await User.findById(medication.user);
        if (!user) continue;
        
        // Current time in hours and minutes
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Get the email notifications - handle both Map and plain object
        const getNotification = (time) => {
          const notifications = medication.emailNotifications;
          if (!notifications) return null;
          
          if (notifications instanceof Map) {
            return notifications.get(time);
          } else {
            return notifications[time];
          }
        };
        
        // Set notification status - handle both Map and plain object
        const setNotification = async (time, type, value, error = null) => {
          const updateObj = {};
          updateObj[`emailNotifications.${time}.${type}`] = value;
          
          if (value === true) {
            updateObj[`emailNotifications.${time}.${type}SentAt`] = new Date();
            console.log(`${type} reminder email marked as sent for medication ${medication._id} at ${time}`);
          } else if (error) {
            updateObj[`emailNotifications.${time}.${type}Error`] = error;
            updateObj[`emailNotifications.${time}.${type}ErrorAt`] = new Date();
            console.log(`${type} reminder email marked as failed for medication ${medication._id} at ${time}: ${error}`);
          }
          
          await Medication.findByIdAndUpdate(medication._id, updateObj);
        };
        
        // Check each medication time
        for (const timeStr of medication.medicationTimes) {
          const [hours, minutes] = timeStr.split(':').map(Number);
          
          // Get notification status for this time
          const timeNotification = getNotification(timeStr) || {
            atTimeSent: false,
            beforeSent: false
          };
          
          // At-time reminder (send exactly at the medication time)
          if (medication.reminderPreferences.reminderAtTime && !timeNotification.atTimeSent) {
            // Check if current time is within a 1-minute window of the medication time
            // This is more precise than the previous approach
            const medicationDateTime = new Date();
            medicationDateTime.setHours(hours, minutes, 0, 0);
            
            // Get time difference in minutes
            const timeDiffMinutes = Math.abs((now - medicationDateTime) / (1000 * 60));
            
            // If we're within 1 minute of the target time
            if (timeDiffMinutes <= 1) {
              console.log(`Sending at-time reminder for ${medication.medicationName} at ${timeStr}`);
              const result = await emailService.sendMedicationReminder(medication, user, 'at-time', timeStr);
              
              // Update medication with email notification status
              if (result.success) {
                await setNotification(timeStr, 'atTimeSent', true);
              } else {
                await setNotification(timeStr, 'atTimeSent', false, result.error || 'Unknown error');
              }
            }
          }
          
          // Before reminder (send 15 minutes before medication time)
          if (medication.reminderPreferences.reminderBefore && !timeNotification.beforeSent) {
            let reminderTime = new Date();
            reminderTime.setHours(hours, minutes, 0, 0);
            reminderTime.setMinutes(reminderTime.getMinutes() - 15);
            
            // Get time difference in minutes
            const timeDiffMinutes = Math.abs((now - reminderTime) / (1000 * 60));
            
            // If we're within 1 minute of the target reminder time (15 min before)
            if (timeDiffMinutes <= 1) {
              console.log(`Sending before-time reminder for ${medication.medicationName} at ${timeStr}`);
              const result = await emailService.sendMedicationReminder(medication, user, 'before', timeStr);
              
              // Update medication with email notification status
              if (result.success) {
                await setNotification(timeStr, 'beforeSent', true);
              } else {
                await setNotification(timeStr, 'beforeSent', false, result.error || 'Unknown error');
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking medication reminders:', error);
    }
  }
  
  /**
   * Send test email
   * @param {String} email - Recipient email
   * @returns {Promise} - Email sending result
   */
  async sendTestEmail(email) {
    const subject = 'Test Reminder from ResQ Health';
    const message = `
      <h2>Test Reminder</h2>
      <p>This is a test reminder from ResQ Health. If you received this email, your reminder system is working correctly!</p>
      <p>Thank you for using ResQ Health Services!</p>
    `;
    
    return emailService.sendEmail(email, subject, message);
  }
}

module.exports = new ReminderService(); 