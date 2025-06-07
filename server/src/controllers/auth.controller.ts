import { Request, Response } from 'express';
import User from '../models/user.model';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create user - password will be hashed by pre-save hook
    const user = new User({
      username,
      email,
      password
    });
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: user._id,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    try {
      // Find user by credentials
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Invalid login credentials' });
        return;
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid login credentials' });
        return;
      }

      // Generate token
      const token = user.generateAuthToken();

      res.json({
        message: 'Login successful',
        token,
        userId: user._id,
        user: {
          username: user.username,
          email: user.email
        }
      });
    } catch (error: any) {
      res.status(401).json({ message: 'Invalid login credentials' });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
