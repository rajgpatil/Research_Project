import React, { useState } from "react";
import api from "../api";
import { getUser } from "../store/auth";

export default function Chat() {
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = getUser();

    const askAI = async () => {
        if (!question.trim()) return;
        try {
            setLoading(true);
            const { data } = await api.post("/ai/ask", { question, lang: "mr" });
            setMessages([...messages, { q: question, a: data.answer }]);
            setQuestion("");
        } catch (err) {
            setMessages([...messages, { q: question, a: "Error: " + (err.response?.data?.error || err.message) }]);
        } finally {
            setLoading(false);
        }
    };

    const startVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice input");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = "mr-IN";
        recognition.interimResults = true;
        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setQuestion(transcript);
        };
        recognition.start();
    };

    const speakMarathi = (text) => {
        // const utterance = new SpeechSynthesisUtterance(text);
        // utterance.lang = "mr-IN";
        // window.speechSynthesis.speak(utterance);


        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const marathiVoice =
            voices.find(v => v.lang === "mr-IN") ||
            voices.find(v => v.lang === "hi-IN") || // fallback to Hindi
            voices[0];
        utterance.voice = marathiVoice;
        utterance.lang = marathiVoice.lang;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    };

    const stopMarathi = () => {
        window.speechSynthesis.cancel();
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow relative">
            <h1 className="text-xl font-bold mb-4">Chat with AI (Marathi)</h1>

            {/* Chat history */}
            <div className="mb-28"> {/* space so sticky bar won’t overlap */}
                {messages.map((m, i) => (
                    <div key={i} className="bg-gray-100 p-3 rounded mb-3">
                        <p>
                            <strong>Q:</strong> {m.q}
                        </p>
                        <p className="mt-2">
                            <strong>A:</strong> {m.a}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => speakMarathi(m.a)}
                                className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
                            >
                                🔊 Speak
                            </button>
                            <button
                                onClick={stopMarathi}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                            >
                                ⏹ Stop
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky input bar (same width, bottom inside box) */}
            <div className="fixed bottom-0 left-0 right-0 flex justify-center">
                <div className="max-w-3xl w-full bg-white border-t p-4 flex gap-2 items-center shadow-lg">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="flex-1 border p-2 rounded resize-none"
                        rows="1"

                    />
                    <button
                        onClick={askAI}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        {loading ? "Thinking..." : "Ask"}
                    </button>
                    <button
                        onClick={startVoice}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Speak
                    </button>
                </div>
            </div>
        </div>
    );
}
