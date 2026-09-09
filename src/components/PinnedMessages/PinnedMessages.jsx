import "./PinnedMessages.css";

import {
    Pin,
    X,
    Trash2,
    Image as ImageIcon,
    Video,
    FileText,
    Mic
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

function PinnedMessages({ onClose }) {
    const {
        messages,
        pinnedMessages,
        unpinMessage,
        togglePinMessage
    } = useChat();

    // =====================================================
    // SAFE DATA
    // =====================================================

    const allMessages = Array.isArray(messages)
        ? messages
        : [];

    const pinnedData = Array.isArray(pinnedMessages)
        ? pinnedMessages
        : [];

    // =====================================================
    // GET PINNED MESSAGE IDS
    // Supports:
    // ["1", "2"]
    // [{ id: "1" }, { id: "2" }]
    // =====================================================

    const pinnedIds = pinnedData
        .map((item) => {
            if (typeof item === "object") {
                return item?.id;
            }

            return item;
        })
        .filter(Boolean);

    // =====================================================
    // GET ACTUAL MESSAGES
    // =====================================================

    const pinned = allMessages.filter((message) =>
        pinnedIds.includes(message?.id)
    );

    // =====================================================
    // MESSAGE PREVIEW
    // =====================================================

    function getMessagePreview(message) {
        if (!message) {
            return {
                text: "Message",
                icon: null
            };
        }

        if (
            typeof message.text === "string" &&
            message.text.trim()
        ) {
            return {
                text: message.text,
                icon: null
            };
        }

        if (message.image) {
            return {
                text: "Image",
                icon: <ImageIcon size={14} />
            };
        }

        if (message.video) {
            return {
                text: "Video",
                icon: <Video size={14} />
            };
        }

        if (message.file) {
            return {
                text: "File",
                icon: <FileText size={14} />
            };
        }

        if (message.audio) {
            return {
                text: "Voice message",
                icon: <Mic size={14} />
            };
        }

        return {
            text: "Message",
            icon: null
        };
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

        // Restart highlight animation
        element.classList.remove(
            "pinned-message-highlight"
        );

        void element.offsetWidth;

        element.classList.add(
            "pinned-message-highlight"
        );

        window.setTimeout(() => {
            element.classList.remove(
                "pinned-message-highlight"
            );
        }, 1600);

        // Close panel after opening message
        if (typeof onClose === "function") {
            onClose();
        }
    }

    // =====================================================
    // REMOVE / UNPIN
    // =====================================================

    function removePin(messageId) {
        if (!messageId) {
            return;
        }

        /*
         * IMPORTANT:
         * Dedicated unpinMessage is preferred.
         */

        if (typeof unpinMessage === "function") {
            unpinMessage(messageId);
            return;
        }

        /*
         * Fallback:
         * If context does not have unpinMessage,
         * use togglePinMessage.
         */

        if (typeof togglePinMessage === "function") {
            togglePinMessage(messageId);
        }
    }

    // =====================================================
    // CLOSE PANEL
    // =====================================================

    function handleClose() {
        if (typeof onClose === "function") {
            onClose();
        }
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <aside
            className="pinned-messages-panel"
            aria-label="Pinned messages"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="pinned-panel-header">

                <div className="pinned-panel-title">

                    <div className="pinned-title-icon">
                        <Pin size={19} />
                    </div>

                    <div className="pinned-title-content">

                        <h3>
                            Pinned Messages
                        </h3>

                        <span>
                            {pinned.length}{" "}
                            {pinned.length === 1
                                ? "message"
                                : "messages"}
                        </span>

                    </div>

                </div>

                <button
                    type="button"
                    className="pinned-close"
                    onClick={handleClose}
                    title="Close"
                    aria-label="Close pinned messages"
                >
                    <X size={19} />
                </button>

            </header>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {pinned.length === 0 ? (

                <div className="pinned-empty">

                    <div className="pinned-empty-icon">
                        <Pin size={32} />
                    </div>

                    <h3>
                        No Pinned Messages
                    </h3>

                    <p>
                        Messages you pin will appear
                        here for quick access.
                    </p>

                </div>

            ) : (

                /* =================================================
                   PINNED MESSAGE LIST
                ================================================= */

                <div className="pinned-list">

                    {pinned.map((message) => {

                        const preview =
                            getMessagePreview(message);

                        return (
                            <div
                                className="pinned-item"
                                key={message.id}
                            >

                                {/* =================================
                                    MESSAGE BUTTON
                                ================================= */}

                                <button
                                    type="button"
                                    className="pinned-message"
                                    onClick={() =>
                                        openMessage(
                                            message.id
                                        )
                                    }
                                >

                                    <div className="pinned-item-icon">
                                        <Pin size={15} />
                                    </div>


                                    <div className="pinned-item-content">

                                        <div className="pinned-item-top">

                                            <span className="pinned-item-sender">
                                                {getSender(
                                                    message
                                                )}
                                            </span>

                                            {message.time && (
                                                <span className="pinned-item-time">
                                                    {message.time}
                                                </span>
                                            )}

                                        </div>


                                        <div className="pinned-item-text">

                                            {preview.icon && (
                                                <span className="pinned-preview-icon">
                                                    {preview.icon}
                                                </span>
                                            )}

                                            <span>
                                                {preview.text}
                                            </span>

                                        </div>

                                    </div>

                                </button>


                                {/* =================================
                                    REMOVE PIN BUTTON
                                ================================= */}

                                <button
                                    type="button"
                                    className="pinned-remove"
                                    title="Unpin message"
                                    aria-label="Unpin message"
                                    onClick={(event) => {

                                        event.preventDefault();

                                        event.stopPropagation();

                                        removePin(
                                            message.id
                                        );

                                    }}
                                >

                                    <Trash2 size={16} />

                                </button>

                            </div>
                        );
                    })}

                </div>
            )}

        </aside>
    );
}

export default PinnedMessages;