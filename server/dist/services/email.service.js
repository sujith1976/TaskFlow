"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupScheduledTasks = exports.cancelScheduledReminder = exports.scheduleReminderEmail = exports.sendTaskCreationEmail = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const email_config_1 = require("../config/email.config");
const scheduledTasks = {};
const sendTaskCreationEmail = async (taskData, userEmail) => {
    try {
        const transporter = await (0, email_config_1.getEmailTransporter)();
        const emailContent = (0, email_config_1.createTaskEmail)(taskData);
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER || '"TaskFlow" <noreply@taskflow.com>',
            to: userEmail,
            subject: emailContent.subject,
            html: emailContent.html,
        });
        console.log('Task creation email sent:', info.messageId);
        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(info));
        }
        return info;
    }
    catch (error) {
        console.error('Error sending task creation email:', error);
        throw error;
    }
};
exports.sendTaskCreationEmail = sendTaskCreationEmail;
const scheduleReminderEmail = async (taskData, userEmail) => {
    const taskId = taskData._id.toString();
    const taskDate = new Date(taskData.date);
    const [hours, minutes] = taskData.startTime.split(':').map(Number);
    const reminderTime = new Date(taskDate);
    reminderTime.setHours(hours, minutes - 30, 0, 0);
    if (scheduledTasks[taskId]) {
        scheduledTasks[taskId].stop();
        delete scheduledTasks[taskId];
    }
    if (reminderTime > new Date()) {
        const cronSchedule = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;
        scheduledTasks[taskId] = node_cron_1.default.schedule(cronSchedule, async () => {
            try {
                const transporter = await (0, email_config_1.getEmailTransporter)();
                const emailContent = (0, email_config_1.createReminderEmail)(taskData);
                const info = await transporter.sendMail({
                    from: process.env.EMAIL_USER || '"TaskFlow" <noreply@taskflow.com>',
                    to: userEmail,
                    subject: emailContent.subject,
                    html: emailContent.html,
                });
                console.log('Reminder email sent:', info.messageId);
                scheduledTasks[taskId].stop();
                delete scheduledTasks[taskId];
            }
            catch (error) {
                console.error('Error sending reminder email:', error);
            }
        });
        console.log(`Reminder scheduled for task ${taskId} at ${reminderTime}`);
    }
};
exports.scheduleReminderEmail = scheduleReminderEmail;
const cancelScheduledReminder = (taskId) => {
    if (scheduledTasks[taskId]) {
        scheduledTasks[taskId].stop();
        delete scheduledTasks[taskId];
        console.log(`Reminder cancelled for task ${taskId}`);
    }
};
exports.cancelScheduledReminder = cancelScheduledReminder;
const cleanupScheduledTasks = () => {
    Object.values(scheduledTasks).forEach(task => task.stop());
    Object.keys(scheduledTasks).forEach(key => delete scheduledTasks[key]);
};
exports.cleanupScheduledTasks = cleanupScheduledTasks;
//# sourceMappingURL=email.service.js.map