"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeeting = exports.getMeetings = exports.createMeeting = void 0;
const email_service_1 = require("../services/email.service");
const meeting_model_1 = __importDefault(require("../models/meeting.model"));
const createMeeting = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const meeting = new meeting_model_1.default({
            ...req.body,
            organizer: userId
        });
        await meeting.save();
        try {
            for (const attendeeEmail of meeting.attendees) {
                await (0, email_service_1.sendTaskCreationEmail)({
                    title: meeting.title,
                    description: meeting.description,
                    date: meeting.date,
                    type: 'meeting'
                }, attendeeEmail);
            }
        }
        catch (emailError) {
            console.error('Error sending email notifications:', emailError);
        }
        return res.status(201).json(meeting);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error creating meeting', error });
    }
};
exports.createMeeting = createMeeting;
const getMeetings = async (req, res) => {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const meetings = await meeting_model_1.default.find({
            $or: [
                { organizer: userId },
                { attendees: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email }
            ]
        }).sort({ date: 1 });
        return res.json(meetings);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error fetching meetings', error });
    }
};
exports.getMeetings = getMeetings;
const deleteMeeting = async (req, res) => {
    var _a;
    try {
        const meeting = await meeting_model_1.default.findById(req.params.id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        if (meeting.organizer.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to delete this meeting' });
        }
        await meeting_model_1.default.deleteOne({ _id: meeting._id });
        return res.json({ message: 'Meeting deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error deleting meeting' });
    }
};
exports.deleteMeeting = deleteMeeting;
//# sourceMappingURL=meeting.controller.js.map