import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";
import { getFarmerProfile, getLang } from "../store/farmerProfile";
import { t } from "../i18n/translations";

export default function Chat() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);   // { role: 'user'|'ai', content }
    const [loading, setLoading] = useState(false);
    const [chatId, setChatId] = useState(searchParams.get("chatId") || null);
    const bottomRef = useRef(null);

    const profile = getFarmerProfile();
    const lang = getLang();

    // ---------- Load existing chat on mount / chatId change ----------
    useEffect(() => {
        const id = searchParams.get("chatId");
        setChatId(id || null);
        if (id) {
            api.get(`/chat/${id}`)
                .then(({ data }) => {
                    setMessages(data.messages || []);
                })
                .catch(() => setMessages([]));
        } else {
            setMessages([]);
        }
    }, [searchParams.get("chatId")]);

    // Scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ---------- Ask AI ----------
    const askAI = async () => {
        if (!question.trim()) return;
        const q = question.trim();
        setQuestion("");
        setLoading(true);

        // Optimistic UI
        const optimisticMessages = [...messages, { role: "user", content: q }];
        setMessages(optimisticMessages);

        try {
            const { data } = await api.post("/ai/ask", {
                question: q,
                lang,
                context: profile || {},
            });
            const aiContent = data.answer;
            const finalMessages = [...optimisticMessages, { role: "ai", content: aiContent }];
            setMessages(finalMessages);

            // Persist: create chat if needed, else append messages
            let currentChatId = chatId;
            if (!currentChatId) {
                const { data: newChat } = await api.post("/chat", {
                    title: q.slice(0, 60),
                    context: profile || {},
                });
                currentChatId = newChat._id;
                setChatId(currentChatId);
                setSearchParams({ chatId: currentChatId });
            }

            await api.post(`/chat/${currentChatId}/message`, {
                userContent: q,
                aiContent,
            });
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "⚠️ Error: " + (err.response?.data?.error || err.message) },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // ---------- Voice input ----------
    const startVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { alert("Your browser does not support voice input"); return; }
        const recognition = new SpeechRecognition();
        const voiceLang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
        recognition.lang = voiceLang;
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

    // ---------- TTS ----------
    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const targetLang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
        const voice = voices.find(v => v.lang === targetLang)
                   || voices.find(v => v.lang === "hi-IN")
                   || voices[0];
        if (voice) { utterance.voice = voice; utterance.lang = voice.lang; }
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeech = () => window.speechSynthesis.cancel();

    // ---------- Render ----------
    const placeholder = t("askPlaceholder", lang);
    const askLabel = loading ? t("thinking", lang) : t("askButton", lang);

    return (
        <div className="flex flex-col h-full bg-[#f5f4f0]">
            {/* Header */}
            <div className="shrink-0 px-6 py-4 bg-white border-b border-[#e8e6e0] flex items-center gap-3">
                <div>
                    <h1 className="text-[15px] font-semibold text-[#1a1a1a] leading-tight">
                        {t("chatWithAI", lang)}
                    </h1>
                    {profile?.crop && (
                        <p className="text-[11px] text-[#8b8b8b] mt-0.5">
                            🌾 {profile.crop}
                            {profile.state ? ` · ${profile.state}` : ""}
                            {profile.farmerName ? ` · ${profile.farmerName}` : ""}
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center pb-20">
                        <div className="text-5xl mb-4">🌱</div>
                        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-2">{t("chatWithAI", lang)}</h2>
                        <p className="text-sm text-[#8b8b8b] max-w-xs">{placeholder}</p>
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            m.role === "user"
                                ? "bg-[#f0ece4] text-[#1a1a1a] rounded-tr-sm"
                                : "bg-white border border-[#e8e6e0] text-[#1a1a1a] rounded-tl-sm"
                        }`}>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                            {m.role === "ai" && (
                                <div className="flex gap-2 mt-3">
                                    <button
                                        onClick={() => speakText(m.content)}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-[#f5f4f0] border border-[#dbd8d0] text-[#5a5a5a] rounded-full hover:bg-[#ebe8e0] hover:text-[#1a1a1a] transition-colors duration-150"
                                    >
                                        {t("speak", lang)}
                                    </button>
                                    <button
                                        onClick={stopSpeech}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-[#f5f4f0] border border-[#dbd8d0] text-[#5a5a5a] rounded-full hover:bg-[#ebe8e0] hover:text-[#1a1a1a] transition-colors duration-150"
                                    >
                                        {t("stop", lang)}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-[#e8e6e0] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                            <div className="flex gap-1 items-center h-4">
                                <span className="w-2 h-2 bg-[#aaa] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-[#aaa] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-[#aaa] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Sticky input bar */}
            <div className="shrink-0 px-4 pb-4 pt-2 bg-gradient-to-t from-[#f5f4f0] to-transparent">
                <div className="bg-white border border-[#dbd8d0] rounded-2xl shadow-md flex items-end gap-2 px-4 py-3">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="flex-1 resize-none bg-transparent text-sm text-[#1a1a1a] placeholder-[#aaa] outline-none leading-relaxed max-h-36 scrollbar-thin"
                        rows="1"
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askAI(); }
                        }}
                    />
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={startVoice}
                            className="p-2 text-[#5a5a5a] hover:text-[#1a1a1a] hover:bg-[#f0ece4] rounded-xl transition-colors duration-150"
                            title="Voice input"
                        >
                            🎤
                        </button>
                        <button
                            onClick={askAI}
                            disabled={loading}
                            className="px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-xl hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        >
                            {askLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
