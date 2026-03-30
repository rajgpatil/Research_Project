import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

export default function ChatLayout() {
    const [searchParams] = useSearchParams();
    const [chatKey, setChatKey] = useState(0); // force Chat remount on "New Chat"
    const activeChatId = searchParams.get("chatId");

    const handleNewChat = () => {
        // Increment key to remount Chat with a blank state
        setChatKey((k) => k + 1);
    };

    return (
        <div className="flex h-screen bg-[#f5f4f0] overflow-hidden">
            <Sidebar activeChatId={activeChatId} onNewChat={handleNewChat} />
            {/* Main content — shifts right of sidebar */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <Chat key={chatKey} />
            </main>
        </div>
    );
}
