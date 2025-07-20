import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    
    const existing = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash: hashed });
    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    const user = await User.findOne({ email : emailOrUsername });
    if (!user) return res.status(400).json({ error: 'Invalid email' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, userId: user._id, username: user.username });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
