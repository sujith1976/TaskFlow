import mongoose, { Document, Schema } from 'mongoose';

interface IInterviewee {
  name: string;
  email: string;
  phone: string;
  role: string;
  company?: string;
}

interface IMeeting extends Document {
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  meetingType: 'online' | 'in-person' | 'hybrid' | 'interview';
  location: string;
  attendees: string[];
  organizer: mongoose.Types.ObjectId;
  interviewee?: IInterviewee;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  meetingType: {
    type: String,
    enum: ['online', 'in-person', 'hybrid', 'interview'],
    default: 'online',
  },
  location: {
    type: String,
    required: function(this: IMeeting) { return this.meetingType !== 'interview'; }
  },
  attendees: [{
    type: String,
    validate: {
      validator: function(email: string) {
        return /\S+@\S+\.\S+/.test(email);
      },
      message: 'Invalid email format'
    }
  }],
  interviewee: {
    name: {
      type: String,
      required: function(this: IMeeting) { return this.meetingType === 'interview'; }
    },
    email: {
      type: String,
      required: function(this: IMeeting) { return this.meetingType === 'interview'; },
      validate: {
        validator: function(email: string) {
          return /\S+@\S+\.\S+/.test(email);
        },
        message: 'Invalid email format'
      }
    },
    phone: {
      type: String,
      required: function(this: IMeeting) { return this.meetingType === 'interview'; }
    },
    role: {
      type: String,
      required: function(this: IMeeting) { return this.meetingType === 'interview'; }
    },
    company: String
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IMeeting>('Meeting', meetingSchema);
