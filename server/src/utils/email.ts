import nodemailer from 'nodemailer';
import { format } from 'date-fns';

// Create a test account using Ethereal for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Create production transporter when SMTP settings are available
const createProductionTransport = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendTaskReminder = async (userEmail: string, taskTitle: string, startTime: Date) => {
  try {
    const transporter = process.env.NODE_ENV === 'production' 
      ? createProductionTransport()
      : await createTestAccount();

    const formattedTime = format(startTime, 'PPpp');
    
    const info = await transporter.sendMail({
      from: '"TaskFlow" <notifications@taskflow.com>',
      to: userEmail,
      subject: `Reminder: Task "${taskTitle}" starts soon`,
      html: `
        <h2>Task Reminder</h2>
        <p>Your task "${taskTitle}" is scheduled to start at ${formattedTime}.</p>
        <p>This is a reminder to help you stay on track with your tasks.</p>
        <br>
        <p>Best regards,</p>
        <p>TaskFlow Team</p>
      `
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 