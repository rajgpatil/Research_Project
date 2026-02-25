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
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-4">Admin Panel</h1>
            <div className="space-y-3 mb-6">
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <button onClick={add} className="bg-green-600 text-white px-4 py-2 rounded">
                    Add Article
                </button>
            </div>


            <ul className="space-y-2">
                {articles.map((a) => (
                    <li key={a._id} className="border p-2 rounded flex justify-between items-center">
                        <div>
                            <strong>{a.title}</strong>
                            <p className="text-sm text-gray-600">{a.content}</p>
                        </div>
                        <button onClick={() => remove(a._id)} className="text-red-600">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}