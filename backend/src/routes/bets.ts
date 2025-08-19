import express from 'express';
import { Bet } from '../models/Bet.js';
import { authMiddleware } from './authMiddleware.js';

const router = express.Router();

// Create a new bet (personal or group)
router.post('/place-bet', authMiddleware, async (req, res) => {
  const data = req.body;

  if (!['personal', 'group'].includes(data.type)) {
    return res.status(400).json({ error: 'Invalid bet type' });
  }

  // Simple validation examples:
  if (data.type === 'personal') {
    data.placedBy = req.userId;
    if (!data.description || !data.amount || !data.deadline) {
      return res.status(400).json({ error: 'Missing fields for personal bet' });
    }
  } else if (data.type === 'group') {
    if (!data.group || !data.participants || data.participants.length === 0 || !data.description || !data.amount || !data.deadline) {
      return res.status(400).json({ error: 'Missing fields for group bet' });
    }
  }
  
  try {
    const bet = new Bet(data);
    await bet.save();
    res.status(201).json(bet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/personal-bets', authMiddleware ,async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bets = await Bet.find({ type: 'personal', placedBy: userId, status: 'active' })
      .populate('placedBy', 'email username')
      .lean();

    res.status(200).json(bets);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

router.get('/group-bets', authMiddleware, async (req, res) => {
  try {
    const group = req.query.group as string;
    const userId = req.userId;

    if (!group) return res.status(400).json({ error: 'Group is required' });
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const bets = await Bet.find({
      type: 'group',
      group,
      status: 'active',
      authorized: userId, // Only bets where user is authorized
    })
      .populate('placedBy', 'email username')
      .populate('group', 'name description')
      .lean();

    res.status(200).json(bets);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});


export default router;
