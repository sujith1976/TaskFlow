import { Request, Response } from 'express';
import { sendTaskCreationEmail } from '../services/email.service';
import Meeting from '../models/meeting.model';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    username: string;
  };
}

export const createMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const meeting = new Meeting({
      ...req.body,
      organizer: userId
    });

    await meeting.save();

    // Send email notifications to attendees
    try {
      for (const attendeeEmail of meeting.attendees) {
        await sendTaskCreationEmail({
          title: meeting.title,
          description: meeting.description,
          date: meeting.date,
          type: 'meeting'
        }, attendeeEmail);
      }
    } catch (emailError) {
      console.error('Error sending email notifications:', emailError);
    }

    return res.status(201).json(meeting);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating meeting', error });
  }
};

export const getMeetings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const meetings = await Meeting.find({
      $or: [
        { organizer: userId },
        { attendees: req.user?.email }
      ]
    }).sort({ date: 1 });

    return res.json(meetings);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching meetings', error });
  }
};

export const deleteMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    if (meeting.organizer.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this meeting' });
    }

    await Meeting.deleteOne({ _id: meeting._id });
    return res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting meeting' });
  }
};
