import "./AI.css";

import { useMemo, useState } from "react";

import AIHeader from "../../components/AI/AIHeader/AIHeader";
import AIChat from "../../components/AI/AIChat/AIChat";
import AIInput from "../../components/AI/AIInput/AIInput";
import AISuggestions from "../../components/AI/AISuggestions/AISuggestions";
import AIHistory from "../../components/AI/AIHistory/AIHistory";


const initialMessages = [];

const initialConversations = [];


function AI() {

    const [messages, setMessages] = useState(initialMessages);
    const [conversations, setConversations] = useState(
        initialConversations
    );


    const [historyOpen, setHistoryOpen] = useState(false);


    const subtitle = useMemo(() => {

        if (messages.length === 0) {
            return "Your intelligent assistant";
        }

        return `${messages.length} messages`;
    }, [messages.length]);


    const handleSend = (text) => {

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: text,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };


        setMessages((current) => [
            ...current,
            userMessage,
        ]);


        /*
         * Temporary AI response.
         * Later this will be connected to the real AI backend/API.
         */

        setTimeout(() => {

            const aiMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content:
                    "I'm ready to help. Your AI backend can be connected here.",
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };


            setMessages((current) => [
                ...current,
                aiMessage,
            ]);

        }, 500);
    };


    const handleSuggestion = (suggestion) => {

        if (!suggestion) return;

        const prompts = {
            code: "Help me write or fix some code.",
            ideas: "Give me some creative ideas.",
            write: "Help me write something.",
            learn: "Teach me something in a simple way.",
        };


        handleSend(
            prompts[suggestion.id] ||
            suggestion.title ||
            "Help me."
        );
    };


    const handleCopy = () => {
        // Copy callback reserved for future analytics/state.
    };


    const handleRegenerate = (message) => {

        if (!message) return;

        const regeneratedMessage = {
            id: Date.now(),
            role: "assistant",
            content:
                "Here is a regenerated response. The real AI response engine will be connected later.",
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };


        setMessages((current) => [
            ...current,
            regeneratedMessage,
        ]);
    };


    const handleNewChat = () => {

        setMessages([]);

        setHistoryOpen(false);
    };


    const handleHistorySelect = (conversation) => {

        if (!conversation) return;

        setMessages(conversation.messages || []);

        setHistoryOpen(false);
    };


    const handleDeleteConversation = (conversation) => {

        if (!conversation) return;

        setConversations((current) =>
            current.filter(
                (item) => item.id !== conversation.id
            )
        );
    };


    return (
        <main className="ai-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <AIHeader
                title="DevChat AI"
                subtitle={subtitle}
                onSearch={() => setHistoryOpen(true)}
                onMore={() => {}}
            />


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div className="ai-page__body">

                {/* CHAT */}
                <div className="ai-page__chat">

                    <AIChat
                        messages={messages}
                        onCopy={handleCopy}
                        onRegenerate={handleRegenerate}
                    />


                    {/* SUGGESTIONS */}
                    {messages.length === 0 && (
                        <AISuggestions
                            onSelect={handleSuggestion}
                        />
                    )}


                    {/* INPUT */}
                    <AIInput
                        onSend={handleSend}
                        onAttach={() => {}}
                        onVoice={() => {}}
                    />

                </div>


                {/* =================================================
                    HISTORY
                ================================================= */}

                {historyOpen && (
                    <aside className="ai-page__history">

                        <div className="ai-page__history-top">

                            <button
                                type="button"
                                onClick={() =>
                                    setHistoryOpen(false)
                                }
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                onClick={handleNewChat}
                            >
                                New Chat
                            </button>

                        </div>


                        <AIHistory
                            conversations={conversations}
                            onSelect={handleHistorySelect}
                            onDelete={
                                handleDeleteConversation
                            }
                            onMore={() => {}}
                        />

                    </aside>
                )}

            </div>

        </main>
    );
}


export default AI;