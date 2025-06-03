"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReminderEmail = exports.createTaskEmail = exports.getEmailTransporter = exports.createProductionTransport = exports.createTestAccount = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const createTestAccount = async () => {
    const testAccount = await nodemailer_1.default.createTestAccount();
    console.log('Test Account Created:', {
        user: testAccount.user,
        pass: testAccount.pass
    });
    return nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};
exports.createTestAccount = createTestAccount;
const createProductionTransport = () => {
    return nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};
exports.createProductionTransport = createProductionTransport;
const getEmailTransporter = async () => {
    if (process.env.NODE_ENV === 'production') {
        return (0, exports.createProductionTransport)();
    }
    const testAccount = await (0, exports.createTestAccount)();
    console.log('Email preview available at Ethereal Email');
    return testAccount;
};
exports.getEmailTransporter = getEmailTransporter;
const formatDateTime = (date, time) => {
    const taskDate = new Date(date);
    const [hours, minutes] = time.split(':');
    const formattedTime = new Date(taskDate).setHours(parseInt(hours), parseInt(minutes));
    return new Date(formattedTime).toLocaleString();
};
const createTaskEmail = (taskData) => {
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
exports.createTaskEmail = createTaskEmail;
const createReminderEmail = (taskData) => {
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
exports.createReminderEmail = createReminderEmail;
//# sourceMappingURL=email.config.js.map