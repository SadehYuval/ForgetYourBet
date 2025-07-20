import express from 'express';
import { Group } from '../models/Group.js';
import { authMiddleware } from './authMiddleware.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/my-groups', authMiddleware, async (req, res) => {
    try{
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const groups = await Group.find({ 'members.user': userId })
            .populate('members.user', 'username email')
            .lean();
        res.status(200).json(groups);

    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }

});

router.post('/create-group', authMiddleware, async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const group = new Group({
            name,
            description,
            members: [{ user: userId, balance: 0 }]
        });

        await group.save();

        res.status(201).json(group);
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
});

export default router;