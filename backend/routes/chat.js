import express from 'express';
import { requireAuth, ensureAuth } from '../middleware/auth.js';
import Chat from '../models/chat.js';

const router = express.Router();

// All chat routes require auth
router.use(requireAuth, ensureAuth);


// GET /api/chat — list all chats for user (no messages, for sidebar)
router.get('/', async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user.id })
            .select('_id title createdAt')
            .sort({ createdAt: -1 })
            .lean();
        res.json(chats);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// POST /api/chat — create new chat session
router.post('/', async (req, res) => {
    try {
        const { title, context } = req.body;
        const chat = await Chat.create({
            userId: req.user.id,
            title:  title || 'New Chat',
            context: context || {},
        });
        res.json(chat);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// GET /api/chat/:id — get single chat with full messages
router.get('/:id', async (req, res) => {
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
        if (!chat) return res.status(404).json({ error: 'Chat not found' });
        res.json(chat);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// POST /api/chat/:id/message — add user+ai message pair
router.post('/:id/message', async (req, res) => {
    try {
        const { userContent, aiContent } = req.body;
        const chat = await Chat.findOne({ _id: req.params.id, userId: req.user.id });
        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        chat.messages.push({ role: 'user', content: userContent });
        chat.messages.push({ role: 'ai',   content: aiContent });

        // Auto-title from first user message
        if (chat.messages.length <= 2) {
            chat.title = userContent.slice(0, 60);
        }

        await chat.save();
        res.json({ ok: true, messages: chat.messages });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// DELETE /api/chat/:id — delete a chat
router.delete('/:id', async (req, res) => {
    try {
        await Chat.deleteOne({ _id: req.params.id, userId: req.user.id });
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


export default router;
