import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  userId: string;
}

const taskSchema = new Schema({
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
    type: Date
  },
  endTime: {
    type: Date
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
  },  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Add validation for time slots
taskSchema.pre('save', async function(next) {
  if (this.startTime && this.endTime) {
    // Validate time sequence
    if (this.startTime >= this.endTime) {
      throw new Error('End time must be after start time');
    }
  }
  next();
});

export default mongoose.model<ITask>('Task', taskSchema);