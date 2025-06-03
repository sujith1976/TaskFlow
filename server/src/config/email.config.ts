import nodemailer from 'nodemailer';

// Create a test account for development
export const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log('Test Account Created:', {
    user: testAccount.user,
    pass: testAccount.pass
  });
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Production transporter (using environment variables)
export const createProductionTransport = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Get the appropriate transporter based on environment
export const getEmailTransporter = async () => {
  if (process.env.NODE_ENV === 'production') {
    return createProductionTransport();
  }
  // Always use Ethereal for development
  const testAccount = await createTestAccount();
  console.log('Email preview available at Ethereal Email');
  return testAccount;
};

// Format date and time
const formatDateTime = (date: Date, time: string) => {
  const taskDate = new Date(date);
  const [hours, minutes] = time.split(':');
  const formattedTime = new Date(taskDate).setHours(parseInt(hours), parseInt(minutes));
  return new Date(formattedTime).toLocaleString();
};

// Email templates
export const createTaskEmail = (taskData: any) => {
  const startDateTime = formatDateTime(taskData.date, taskData.startTime);
  const endDateTime = formatDateTime(taskData.date, taskData.endTime);

  return {
    subject: `New Task Created: ${taskData.title}`,
    html: `
      <h1>Task Details</h1>
      <p><strong>Title:</strong> ${taskData.title}</p>
      <p><strong>Description:</strong> ${taskData.description}</p>
      <p><strong>Date:</strong> ${new Date(taskData.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${taskData.startTime} - ${taskData.endTime}</p>
      <p><strong>Priority:</strong> ${taskData.priority}</p>
      <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
        <p style="margin: 0;"><strong>Start:</strong> ${startDateTime}</p>
        <p style="margin: 0;"><strong>End:</strong> ${endDateTime}</p>
      </div>
    `,
  };
};

export const createReminderEmail = (taskData: any) => {
  const startDateTime = formatDateTime(taskData.date, taskData.startTime);
  const endDateTime = formatDateTime(taskData.date, taskData.endTime);

  return {
    subject: `Reminder: Task "${taskData.title}" starts in 30 minutes`,
    html: `
      <h1>Task Reminder</h1>
      <p>Your task starts in 30 minutes:</p>
      <p><strong>Title:</strong> ${taskData.title}</p>
      <p><strong>Description:</strong> ${taskData.description}</p>
      <p><strong>Date:</strong> ${new Date(taskData.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${taskData.startTime} - ${taskData.endTime}</p>
      <p><strong>Priority:</strong> ${taskData.priority}</p>
      <div style="margin-top: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
        <p style="margin: 0;"><strong>Start:</strong> ${startDateTime}</p>
        <p style="margin: 0;"><strong>End:</strong> ${endDateTime}</p>
      </div>
    `,
  };
}; 