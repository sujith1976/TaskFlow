import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { Document } from 'mongoose';

interface AuthRequest extends Request {
  token?: string;
  user?: {
    _id: string;
    email: string;
    username: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your_jwt_secret') as { userId: string }; // In production, use environment variable
    const user = await User.findOne({ _id: decoded.userId }) as (Document & IUser) | null;

    if (!user) {
      throw new Error('User not found');
    }

    const userObj = user.toObject();
    req.token = token;
    req.user = {
      _id: userObj._id.toString(),
      email: userObj.email,
      username: userObj.username
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 