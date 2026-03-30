import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import { getFarmerProfile, getLang } from "../store/farmerProfile";
import { getUser, logout } from "../store/auth";
import { t } from "../i18n/translations";

export default function Sidebar({ activeChatId, onNewChat }) {
    const [chats, setChats] = useState([]);
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const user = getUser();
    const profile = getFarmerProfile();
    const lang = getLang();

    const loadChats = async () => {
        try {
            const { data } = await api.get("/chat");
            setChats(data);
        } catch {
            // silently fail (unauthenticated etc.)
        }
    };

    useEffect(() => { loadChats(); }, [activeChatId]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await api.delete(`/chat/${id}`);
        setChats((prev) => prev.filter((c) => c._id !== id));
        if (activeChatId === id) onNewChat();
    };

    const handleSelect = (id) => {
        navigate(`/?chatId=${id}`);
    };

    const handleNewChat = () => {
        navigate("/");
        onNewChat();
    };

    return (
        <>
            {/* Mobile toggle button */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="md:hidden fixed top-3 left-3 z-50 p-2 bg-white border border-[#e8e6e0] rounded-xl shadow-sm text-[#5a5a5a]"
                aria-label="Toggle sidebar"
            >
                ☰
            </button>

            {/* Sidebar panel */}
            <aside className={`
                flex flex-col bg-white border-r border-[#e8e6e0]
                transition-all duration-300 ease-in-out
                fixed md:relative inset-y-0 left-0 z-40
                ${open ? "w-64" : "w-0 overflow-hidden"}
                md:w-64 md:overflow-visible
            `}>
                {/* Header */}
                <div className="flex items-center justify-between px-4 h-14 border-b border-[#e8e6e0] shrink-0">
                    <span className="font-semibold text-[15px] tracking-wide text-[#8b5a2b]">KRUSHIMITRA</span>
                    <button
                        onClick={() => setOpen(false)}
                        className="md:hidden text-[#aaa] hover:text-[#1a1a1a] text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* New Chat */}
                <div className="px-3 pt-3 pb-2 shrink-0">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-[#1a1a1a] text-white rounded-xl hover:bg-[#333] transition-colors duration-150"
                    >
                        <span className="text-base">✏️</span>
                        <span>{t("newChat", lang)}</span>
                    </button>
                </div>

                {/* Chat list */}
                <div className="flex-1 overflow-y-auto px-2 scrollbar-thin">
                    {chats.length > 0 ? (
                        <>
                            <p className="px-2 py-1.5 text-[10px] uppercase tracking-widest text-[#aaa] font-semibold">
                                {t("chatHistory", lang)}
                            </p>
                            <ul className="space-y-0.5">
                                {chats.map((c) => (
                                    <li key={c._id}>
                                        <button
                                            onClick={() => handleSelect(c._id)}
                                            className={`group w-full text-left flex items-start gap-2 px-3 py-2.5 rounded-xl transition-colors duration-100 ${
                                                activeChatId === c._id
                                                    ? "bg-[#f0ece4] text-[#1a1a1a]"
                                                    : "hover:bg-[#f5f4f0] text-[#3a3a3a]"
                                            }`}
                                        >
                                            <span className="flex-1 min-w-0">
                                                <span className="block text-sm truncate">{c.title || t("newChat", lang)}</span>
                                                <span className="block text-[11px] text-[#aaa] mt-0.5">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </span>
                                            </span>
                                            <button
                                                onClick={(e) => handleDelete(e, c._id)}
                                                className="opacity-0 group-hover:opacity-100 text-[#aaa] hover:text-red-500 text-xs shrink-0 mt-0.5 transition-opacity duration-150 px-1"
                                                title={t("deleteChat", lang)}
                                            >
                                                🗑
                                            </button>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="px-4 py-6 text-xs text-[#aaa] text-center">{t("noChats", lang)}</p>
                    )}
                </div>

                {/* Footer: user info + logout */}
                <div className="px-4 py-3 border-t border-[#e8e6e0] shrink-0">
                    {profile && (
                        <p className="text-[11px] text-[#8b8b8b] mb-1 truncate">
                            🌾 {profile.crop} · {profile.state}
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#5a5a5a] truncate">{user?.email}</span>
                        <button
                            onClick={logout}
                            className="text-xs text-[#5a5a5a] hover:text-[#1a1a1a] transition-colors duration-150 ml-2 shrink-0"
                        >
                            {t("logout", lang)}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile overlay */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
                    onClick={() => setOpen(false)}
                />
            )}
        </>
    );
}
