import React, { useState, useEffect } from "react";
import api from "../api";


export default function Knowledge() {
    const [articles, setArticles] = useState([]);


    const load = async () => {
        const { data } = await api.get("/knowledge");
        setArticles(Array.isArray(data) ? data : data.items || []);
    };


    useEffect(() => { load(); }, []);


    return (
        <div className="flex-1 px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-xl font-semibold text-[#1a1a1a] mb-6">Knowledge Base</h1>
                <ul className="space-y-3">
                    {articles.length > 0 ? articles.map((a) => (
                        <li
                            key={a._id}
                            className="bg-white border border-[#e8e6e0] rounded-2xl px-5 py-4 shadow-sm"
                        >
                            <h2 className="text-sm font-semibold text-[#1a1a1a]">{a.title}</h2>
                            <p className="text-xs text-[#8b8b8b] mt-1 leading-relaxed">{a.content}</p>
                        </li>
                    )) : null}
                </ul>
            </div>
        </div>
    );
}