import express from "express";
import Feedback from "../models/feedback.js";
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();


// Submit feedback
router.post("/", authMiddleware, async (req, res) => {
    try {
        const feedback = new Feedback({
            user: req.user.id,
            query: req.body.query,
            answer: req.body.answer,
            rating: req.body.rating,
        });
        await feedback.save();
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


export default router;