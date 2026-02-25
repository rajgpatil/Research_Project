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
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Knowledge Base</h1>
            <ul className="space-y-3">
                {articles.length > 0 ? articles.map((a) => (
                    <li key={a._id} className="border p-3 rounded">
                        <h2 className="font-semibold">{a.title}</h2>
                        <p className="text-sm text-gray-600 mt-1">{a.content}</p>
                    </li>
                )) : null}
            </ul>
        </div>
    );
}