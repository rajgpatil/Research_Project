import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { requireAuth, ensureAuth } from '../middleware/auth.js';
import Message from '../models/Message.js';
import { retrieveContext } from '../utils/rag.js';


const router = express.Router();
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';


function systemPrompt() {
  return (
    "तुम्ही एक 'कृषी सहाय्यक' आहात जो शेतकऱ्यांना मदत करण्यासाठी बनवलेला आहे. " +
    "शेतकरी कोणत्या भाषेत प्रश्न विचारतील, त्याच भाषेत उत्तर द्या. " +
    "नेहमी थेट, सोपी आणि उपयुक्त माहिती द्या. " +
    "अवघड शब्दांचा अर्थ स्पष्ट करू नका जोपर्यंत शेतकरी विचारत नाहीत. " +
    "धोकादायक रासायनिक उपाय सुचवू नका; शक्य तितके सुरक्षित आणि जैविक उपाय सुचवा. " +
    "जर खात्री नसेल तर फक्त 'मला नक्की माहित नाही' असे सांगा आणि सुरक्षित पद्धती सुचवा. " +
    "कधीही 'कृषी अधिकारी कडे जा' असे उत्तर देऊ नका."
  );
}


router.post('/ask', requireAuth, ensureAuth, async (req, res) => {
    try {
        const { question, lang = 'en' } = req.body;
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL });


        // RAG-lite context
        const { contextText, docsMeta } = await retrieveContext(question, lang);


        const prompt = `${systemPrompt(lang)}\n\nContext (from knowledge base):\n${contextText || 'No context found.'}\n\nUser question: ${question}\n\nProvide a concise, step-by-step answer.`;


        const result = await model.generateContent(prompt);
        const text = result.response.text();


        const saved = await Message.create({
            userId: req.user.id,
            question,
            answer: text,
            contextDocs: docsMeta
        });


        res.json({ answer: text, messageId: saved._id, contextDocs: docsMeta });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


export default router;