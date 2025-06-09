import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import meetingRoutes from './routes/meeting.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server default port
    'https://taskflow-client.vercel.app', // Your production frontend URL
  ],
  credentials: true,
}));
app.use(morgan('dev'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base route for API health check
app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running' });
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/meetings', meetingRoutes);

let serverInstance: any;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskm')
  .then(() => {
    serverInstance = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
});