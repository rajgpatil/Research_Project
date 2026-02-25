import Article from '../models/Article.js';
import Knowledge from "../models/knowledge.js";

// Very simple RAG-lite: text index search, score by basic frequency
export async function retrieveContext(query, lang = 'en', limit = 3) {
    const terms = query
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean);


    const articles = await Article.find({ lang }).lean();
    const scored = articles
        .map((a) => {
            const text = `${a.title} ${a.body}`.toLowerCase();
            let score = 0;
            for (const t of terms) if (text.includes(t)) score += 1;
            return { id: String(a._id), title: a.title, score, body: a.body };
        })
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);


    const contextText = scored.map((s, i) => `Doc ${i + 1}: ${s.title}\n${s.body}`).join('\n\n');
    return { contextText, docsMeta: scored.map(({ id, title, score }) => ({ id, title, score })) };
}

// Very basic keyword retriever (replace with vector DB later)
export const getContext = async (question) => {
const keywords = question.split(" ").slice(0, 3).join(" ");
const articles = await Knowledge.find({
$text: { $search: keywords }
}).limit(3);


return articles.map(a => a.content).join("\n---\n");
};