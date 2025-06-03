import { Request, Response } from 'express';
import Task from '../models/task.model';
import { sendTaskReminder } from '../utils/email';

// Extend Request type to include user
interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
  };
}

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user._id;
    const userEmail = req.user.email;
    const taskData = { ...req.body, userId };

    const task = new Task(taskData);
    await task.save();

    // Schedule reminder if startTime is set
    if (task.startTime) {
      const reminderTime = new Date(task.startTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - 30);
      sendTaskReminder(userEmail, task.title, task.startTime);
    }

    return res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user._id;
    const userEmail = req.user.email;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { ...req.body },
      { new: true }
    );

    // Update reminder if startTime is changed
    if (updatedTask && updatedTask.startTime && task.startTime !== updatedTask.startTime) {
      const reminderTime = new Date(updatedTask.startTime);
      reminderTime.setMinutes(reminderTime.getMinutes() - 30);
      sendTaskReminder(userEmail, updatedTask.title, updatedTask.startTime);
    }

    return res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user._id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(taskId);
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user._id;
    
    const tasks = await Task.find({ userId })
      .sort({ date: 'asc' })
      .select('-__v');
    
    // Group tasks by date
    const groupedTasks = tasks.reduce((acc: { [key: string]: any[] }, task) => {
      const date = new Date(task.date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {});

    return res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = req.user._id;
    const taskId = req.params.id;

    const task = await Task.findOne({ _id: taskId, userId })
      .select('-__v');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Error fetching task' });
  }
}; 