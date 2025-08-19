import express from 'express';
import { Group } from '../models/Group.js';
import { authMiddleware } from './authMiddleware.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/search-users', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query as { query: string };
    
    const user = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('username email').limit(1);

    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;