import "./AIMessage.css";

import {
    Bot,
    User,
    Copy,
    RotateCcw,
    Check,
} from "lucide-react";

import { useState } from "react";


function AIMessage({
    message = {},
    onCopy,
    onRegenerate,
}) {

    const [copied, setCopied] = useState(false);

    const {
        id,
        role = "assistant",
        content = "",
        time = "",
    } = message;

    const isUser = role === "user";


    const handleCopy = async () => {

        try {
            await navigator.clipboard.writeText(content);

            setCopied(true);

            if (onCopy) {
                onCopy(message);
            }

            setTimeout(() => {
                setCopied(false);
            }, 1500);

        } catch {
            // Clipboard unavailable
        }
    };


    return (
        <article
            className={`ai-message ${
                isUser
                    ? "ai-message--user"
                    : "ai-message--assistant"
            }`}
            data-message-id={id}
        >

            {/* AVATAR */}
            <div className="ai-message__avatar">

                {isUser ? (
                    <User size={17} />
                ) : (
                    <Bot size={17} />
                )}

            </div>


            {/* CONTENT */}
            <div className="ai-message__body">

                <div className="ai-message__top">

                    <span className="ai-message__name">
                        {isUser ? "You" : "DevChat AI"}
                    </span>

                    {time && (
                        <span className="ai-message__time">
                            {time}
                        </span>
                    )}

                </div>


                <div className="ai-message__content">
                    {content}
                </div>


                {/* ACTIONS */}
                {!isUser && (
                    <div className="ai-message__actions">

                        <button
                            type="button"
                            onClick={handleCopy}
                            aria-label="Copy response"
                        >
                            {copied ? (
                                <Check size={14} />
                            ) : (
                                <Copy size={14} />
                            )}

                            <span>
                                {copied ? "Copied" : "Copy"}
                            </span>
                        </button>


                        <button
                            type="button"
                            onClick={() => {
                                if (onRegenerate) {
                                    onRegenerate(message);
                                }
                            }}
                            aria-label="Regenerate response"
                        >
                            <RotateCcw size={14} />

                            <span>
                                Regenerate
                            </span>
                        </button>

                    </div>
                )}

            </div>

        </article>
    );
}


export default AIMessage;