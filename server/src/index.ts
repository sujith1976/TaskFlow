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
// Configure CORS based on environment
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://taskflow-client.vercel.app', 'https://task-flow-5pe9.vercel.app']
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours in seconds
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

// Handle pre-flight requests
app.options('*', cors());

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

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Handle 404 routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

let serverInstance: any;

// MongoDB connection
// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskm');
    console.log('Connected to MongoDB');

    serverInstance = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Environment:', process.env.NODE_ENV || 'development');
    });

    serverInstance.on('error', (error: Error) => {
      console.error('Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
});