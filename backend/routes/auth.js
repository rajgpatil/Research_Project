import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';


const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { name, email, password, adminCode } = req.body;
        const role = adminCode === 'ADMIN123' ? 'admin' : 'user';
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Email in use' });
        const user = await User.create({ name, email, password, role });
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token, user: { id: user._id, name, email, role } });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        const ok = await user.comparePassword(password);
        if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// Get current user (optional)
router.get('/me', requireAuth, async (req, res) => {
    if (!req.user) return res.json({ user: null });
    const u = await User.findById(req.user.id).select('_id name email role createdAt');
    res.json({ user: u });
});


export default router;