import express from 'express';
import { Group } from '../models/Group.js';
import { authMiddleware } from './authMiddleware.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/group', authMiddleware, async (req, res) => {
  try {
    const groupId = req.query.groupId as string;
    if (!groupId) {
      return res.status(400).json({ error: 'groupId is required' });
    }

    const group = await Group.findById(groupId)
      .populate('members.user', 'username email')
      .lean();

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

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

router.post('/:groupId/add-member', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const requesterId = req.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isRequesterMember = group.members.some(
      member => member.user && member.user.toString() === requesterId
    );
    if (!isRequesterMember) {
      return res.status(403).json({ error: 'You must be a member to add users' });
    }

    const isAlreadyMember = group.members.some(
      member => member.user && member.user.toString() === userId
    );
    if (isAlreadyMember) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    group.members.push({ user: userId, balance: 0 });
    await group.save();

    await group.populate('members.user', 'username email');
    
    res.json({ message: 'User added successfully', group });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:groupId/remove-member/:userId', authMiddleware, async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const requesterId = req.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isRequesterMember = group.members.some(
      member => member.user && member.user.toString() === requesterId
    );
    if (!isRequesterMember) {
      return res.status(403).json({ error: 'You must be a member to remove users' });
    }

    group.members.pull({ user: userId });
    await group.save();

    await group.populate('members.user', 'username email');
    
    res.json({ message: 'User removed successfully', group });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;