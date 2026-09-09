 
import "./StarredMessages.css";

import {
    Star,
    X,
    Trash2
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

function StarredMessages({ onClose }) {

    const {
        messages,
        starredMessages,
        toggleStarMessage
    } = useChat();


    // =====================================================
    // SAFETY
    // =====================================================

    const allMessages = Array.isArray(messages)
        ? messages
        : [];

    const starredIds = Array.isArray(starredMessages)
        ? starredMessages
        : [];


    // =====================================================
    // GET STARRED MESSAGES
    // =====================================================

    const starred = allMessages.filter(message =>
        starredIds.includes(message?.id)
    );


    // =====================================================
    // OPEN MESSAGE
    // =====================================================

    function openMessage(messageId) {

        if (!messageId) {
            return;
        }

        const element = document.getElementById(
            `message-${messageId}`
        );

        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        element.classList.add(
            "starred-message-highlight"
        );

        window.setTimeout(() => {

            element.classList.remove(
                "starred-message-highlight"
            );

        }, 1600);

        if (typeof onClose === "function") {
            onClose();
        }

    }


    // =====================================================
    // REMOVE STAR
    // =====================================================

    function removeStar(messageId) {

        if (!messageId) {
            return;
        }

        toggleStarMessage(messageId);

    }


    // =====================================================
    // MESSAGE PREVIEW
    // =====================================================

    function getPreview(message) {

        if (!message) {
            return "Message";
        }

        if (
            typeof message.text === "string" &&
            message.text.trim()
        ) {
            return message.text;
        }

        if (message.image) {
            return "📷 Image";
        }

        if (message.video) {
            return "🎥 Video";
        }

        if (message.file) {
            return "📎 File";
        }

        if (message.audio) {
            return "🎤 Voice message";
        }

        return "Message";

    }


    // =====================================================
    // SENDER
    // =====================================================

    function getSender(message) {

        if (!message) {
            return "Unknown";
        }

        if (message.own) {
            return "You";
        }

        return message.sender || "DevChat";

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <aside className="starred-panel">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="starred-panel-header">

                <div className="starred-title">

                    <Star size={20} />

                    <div>

                        <h3>
                            Starred Messages
                        </h3>

                        <span>
                            {starred.length} saved
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="starred-close"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close starred messages"
                >

                    <X size={20} />

                </button>

            </header>


            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {starred.length === 0 ? (

                <div className="starred-empty">

                    <div className="starred-empty-icon">

                        <Star size={34} />

                    </div>

                    <h3>
                        No Starred Messages
                    </h3>

                    <p>
                        Messages you star will appear here.
                    </p>

                </div>

            ) : (


                /* ================================================= */
                /* LIST */
                /* ================================================= */

                <div className="starred-list">

                    {starred.map(message => (

                        <div
                            className="starred-item"
                            key={message.id}
                        >


                            {/* ================================= */}
                            {/* MESSAGE */}
                            {/* ================================= */}

                            <button
                                type="button"
                                className="starred-message"
                                onClick={() =>
                                    openMessage(message.id)
                                }
                            >

                                <div className="starred-item-icon">

                                    <Star size={16} />

                                </div>


                                <div className="starred-item-content">

                                    <div className="starred-item-top">

                                        <span className="starred-item-sender">

                                            {getSender(message)}

                                        </span>

                                        <span className="starred-item-time">

                                            {message.time || ""}

                                        </span>

                                    </div>


                                    <div className="starred-item-text">

                                        {getPreview(message)}

                                    </div>

                                </div>

                            </button>


                            {/* ================================= */}
                            {/* UNSTAR */}
                            {/* ================================= */}

                            <button
                                type="button"
                                className="starred-remove"
                                title="Remove star"
                                aria-label="Remove star"
                                onClick={(event) => {

                                    event.stopPropagation();

                                    removeStar(message.id);

                                }}
                            >

                                <Trash2 size={17} />

                            </button>

                        </div>

                    ))}

                </div>

            )}

        </aside>

    );

}

export default StarredMessages;
 
