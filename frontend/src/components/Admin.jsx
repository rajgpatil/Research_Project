import React, { useState, useEffect } from "react";

import api from "../api";


export default function Admin() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [articles, setArticles] = useState([]);
    const load = async () => {
        const { data } = await api.get("/knowledge");
        setArticles(data);
    };


    const add = async () => {
        await api.post("/knowledge", { title, content });
        setTitle("");
        setContent("");
        load();
    };


    const remove = async (id) => {
        await api.delete(`/knowledge/${id}`);
        load();
    };


    useEffect(() => { load(); }, []);


    return (
        <div className="flex-1 px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <h1 className="text-xl font-semibold text-[#1a1a1a] mb-6">Admin Panel</h1>

                {/* Add article form */}
                <div className="bg-white border border-[#e8e6e0] rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-sm font-semibold text-[#5a5a5a] uppercase tracking-wider mb-4">Add Article</h2>
                    <div className="space-y-3">
                        <input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-[#dbd8d0] bg-[#f9f8f5] text-sm text-[#1a1a1a] placeholder-[#aaa] px-4 py-2.5 rounded-xl outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10 transition"
                        />
                        <textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full border border-[#dbd8d0] bg-[#f9f8f5] text-sm text-[#1a1a1a] placeholder-[#aaa] px-4 py-2.5 rounded-xl outline-none focus:border-[#1a1a1a] focus:ring-2 focus:ring-[#1a1a1a]/10 transition resize-none"
                            rows="4"
                        />
                        <button
                            onClick={add}
                            className="px-5 py-2.5 bg-[#1a1a1a] text-white text-sm font-medium rounded-xl hover:bg-[#333] transition-colors duration-150"
                        >
                            Add Article
                        </button>
                    </div>
                </div>

                {/* Article list */}
                <ul className="space-y-3">
                    {articles.map((a) => (
                        <li
                            key={a._id}
                            className="bg-white border border-[#e8e6e0] rounded-2xl px-5 py-4 flex justify-between items-start shadow-sm"
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <p className="text-sm font-semibold text-[#1a1a1a] truncate">{a.title}</p>
                                <p className="text-xs text-[#8b8b8b] mt-1 line-clamp-2">{a.content}</p>
                            </div>
                            <button
                                onClick={() => remove(a._id)}
                                className="text-xs text-red-500 hover:text-red-700 shrink-0 transition-colors duration-150"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}