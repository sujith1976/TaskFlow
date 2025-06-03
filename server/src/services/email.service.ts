import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { getEmailTransporter, createTaskEmail, createReminderEmail } from '../config/email.config';

// Store scheduled tasks
const scheduledTasks: { [key: string]: ReturnType<typeof cron.schedule> } = {};

export const sendTaskCreationEmail = async (taskData: any, userEmail: string) => {
  try {
    const transporter = await getEmailTransporter();
    const emailContent = createTaskEmail(taskData);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || '"TaskFlow" <noreply@taskflow.com>',
      to: userEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Task creation email sent:', info.messageId);
    
    // If using Ethereal (development), log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending task creation email:', error);
    throw error;
  }
};

export const scheduleReminderEmail = async (taskData: any, userEmail: string) => {
  const taskId = taskData._id.toString();
  const taskDate = new Date(taskData.date);
  const [hours, minutes] = taskData.startTime.split(':').map(Number);
  
  // Set reminder time to 30 minutes before task start
  const reminderTime = new Date(taskDate);
  reminderTime.setHours(hours, minutes - 30, 0, 0);
  
  // Cancel existing reminder if any
  if (scheduledTasks[taskId]) {
    scheduledTasks[taskId].stop();
    delete scheduledTasks[taskId];
  }

  // Only schedule if the reminder time is in the future
  if (reminderTime > new Date()) {
    const cronSchedule = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;
    
    scheduledTasks[taskId] = cron.schedule(cronSchedule, async () => {
      try {
        const transporter = await getEmailTransporter();
        const emailContent = createReminderEmail(taskData);

        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER || '"TaskFlow" <noreply@taskflow.com>',
          to: userEmail,
          subject: emailContent.subject,
          html: emailContent.html,
        });

        console.log('Reminder email sent:', info.messageId);
        
        // Clean up the scheduled task
        scheduledTasks[taskId].stop();
        delete scheduledTasks[taskId];
      } catch (error) {
        console.error('Error sending reminder email:', error);
      }
    });

    console.log(`Reminder scheduled for task ${taskId} at ${reminderTime}`);
  }
};

export const cancelScheduledReminder = (taskId: string) => {
  if (scheduledTasks[taskId]) {
    scheduledTasks[taskId].stop();
    delete scheduledTasks[taskId];
    console.log(`Reminder cancelled for task ${taskId}`);
  }
};

// Function to clean up all scheduled tasks (useful for graceful shutdown)
export const cleanupScheduledTasks = () => {
  Object.values(scheduledTasks).forEach(task => task.stop());
  Object.keys(scheduledTasks).forEach(key => delete scheduledTasks[key]);
}; 