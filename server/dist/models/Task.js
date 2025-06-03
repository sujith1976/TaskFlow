"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Start time must be in HH:mm format'
        }
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'End time must be in HH:mm format'
        }
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'completed'],
        default: 'todo'
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
taskSchema.pre('save', function (next) {
    const task = this;
    const startHour = parseInt(task.startTime.split(':')[0]);
    const startMinute = parseInt(task.startTime.split(':')[1]);
    const endHour = parseInt(task.endTime.split(':')[0]);
    const endMinute = parseInt(task.endTime.split(':')[1]);
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
        next(new Error('End time must be after start time'));
    }
    else {
        task.updatedAt = new Date();
        next();
    }
});
taskSchema.pre('save', async function (next) {
    const task = this;
    const startOfDay = new Date(task.date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(task.date);
    endOfDay.setHours(23, 59, 59, 999);
    const conflictingTasks = await mongoose_1.default.model('Task').find({
        _id: { $ne: task._id },
        userId: task.userId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });
    for (const existingTask of conflictingTasks) {
        const newTaskStart = timeToMinutes(task.startTime);
        const newTaskEnd = timeToMinutes(task.endTime);
        const existingTaskStart = timeToMinutes(existingTask.startTime);
        const existingTaskEnd = timeToMinutes(existingTask.endTime);
        if ((newTaskStart >= existingTaskStart && newTaskStart < existingTaskEnd) ||
            (newTaskEnd > existingTaskStart && newTaskEnd <= existingTaskEnd) ||
            (newTaskStart <= existingTaskStart && newTaskEnd >= existingTaskEnd)) {
            next(new Error(`Time slot conflicts with existing task: ${existingTask.title}`));
            return;
        }
    }
    next();
});
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
exports.Task = mongoose_1.default.model('Task', taskSchema);
//# sourceMappingURL=Task.js.map