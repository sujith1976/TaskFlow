import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import User from '../models/user.model';

const router = express.Router();

// Add CORS headers middleware for auth routes
router.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Routes
// Support both /register and /signup for backward compatibility
router.post('/register', handleRegistration);
router.post('/signup', handleRegistration);

// Extract registration logic to a reusable function
async function handleRegistration(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email, username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { username, email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Invalid input data' });
  }
}

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

export default router;