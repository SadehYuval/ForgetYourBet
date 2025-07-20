// src/routes/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed token' });

  try {
    const secret = process.env.JWT_SECRET || 'your_secret_here';
    const payload = jwt.verify(token, secret) as { userId: string };
    req.userId = payload.userId;  // attach userId to req object for handlers
    next(); // user is authenticated, continue
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
