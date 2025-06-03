"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTask = exports.getTasks = exports.deleteTask = exports.updateTask = exports.createTask = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const email_1 = require("../utils/email");
const createTask = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = req.user._id;
        const userEmail = req.user.email;
        const taskData = { ...req.body, userId };
        const task = new task_model_1.default(taskData);
        await task.save();
        if (task.startTime) {
            const reminderTime = new Date(task.startTime);
            reminderTime.setMinutes(reminderTime.getMinutes() - 30);
            (0, email_1.sendTaskReminder)(userEmail, task.title, task.startTime);
        }
        return res.status(201).json(task);
    }
    catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Error creating task' });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = req.user._id;
        const userEmail = req.user.email;
        const taskId = req.params.id;
        const task = await task_model_1.default.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const updatedTask = await task_model_1.default.findByIdAndUpdate(taskId, { ...req.body }, { new: true });
        if (updatedTask && updatedTask.startTime && task.startTime !== updatedTask.startTime) {
            const reminderTime = new Date(updatedTask.startTime);
            reminderTime.setMinutes(reminderTime.getMinutes() - 30);
            (0, email_1.sendTaskReminder)(userEmail, updatedTask.title, updatedTask.startTime);
        }
        return res.json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Error updating task' });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = req.user._id;
        const taskId = req.params.id;
        const task = await task_model_1.default.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task_model_1.default.findByIdAndDelete(taskId);
        return res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task' });
    }
};
exports.deleteTask = deleteTask;
const getTasks = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = req.user._id;
        const tasks = await task_model_1.default.find({ userId })
            .sort({ date: 'asc' })
            .select('-__v');
        const groupedTasks = tasks.reduce((acc, task) => {
            const date = new Date(task.date).toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(task);
            return acc;
        }, {});
        return res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Error fetching tasks' });
    }
};
exports.getTasks = getTasks;
const getTask = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = req.user._id;
        const taskId = req.params.id;
        const task = await task_model_1.default.findOne({ _id: taskId, userId })
            .select('-__v');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.json(task);
    }
    catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({ message: 'Error fetching task' });
    }
};
exports.getTask = getTask;
//# sourceMappingURL=task.controller.js.map