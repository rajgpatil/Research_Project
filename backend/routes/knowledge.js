import express from "express";
import Knowledge from "../models/knowledge.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";


const router = express.Router();


// Get all knowledge articles
router.get("/", async (req, res) => {
    const articles = await Knowledge.find().sort({ createdAt: -1 });
    res.json(articles);
});


// Add article (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const article = new Knowledge(req.body);
        await article.save();
        res.json(article);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


export default router;