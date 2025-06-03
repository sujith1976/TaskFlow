"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTaskReminder = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const date_fns_1 = require("date-fns");
const createTestAccount = async () => {
    const testAccount = await nodemailer_1.default.createTestAccount();
    return nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
};
const createProductionTransport = () => {
    return nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};
const sendTaskReminder = async (userEmail, taskTitle, startTime) => {
    try {
        const transporter = process.env.NODE_ENV === 'production'
            ? createProductionTransport()
            : await createTestAccount();
        const formattedTime = (0, date_fns_1.format)(startTime, 'PPpp');
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
            console.log('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
        }
        return info;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
exports.sendTaskReminder = sendTaskReminder;
//# sourceMappingURL=email.js.map