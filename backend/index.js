import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import kbRoutes from './routes/knowledge.js';
import feedbackRoutes from './routes/feedback.js';


dotenv.config();
const app = express();


app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));


connectDB();


app.get('/', (req, res) => res.json({ ok: true, service: 'farmer-advisory' }));
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/knowledge', kbRoutes);
app.use('/api/feedback', feedbackRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));