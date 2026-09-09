
import "./BookmarkPanel.css";

import {
    Bookmark,
    X,
    Trash2
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

function BookmarkPanel({ onClose }) {

    const {
        messages,
        bookmarkedMessages,
        setBookmarkedMessages
    } = useChat();


    // =====================================================
    // SAFETY
    // =====================================================

    const bookmarks = Array.isArray(bookmarkedMessages)
        ? bookmarkedMessages
        : [];

    const allMessages = Array.isArray(messages)
        ? messages
        : [];


    // =====================================================
    // REMOVE BOOKMARK
    // =====================================================

    function removeBookmark(messageId) {

        if (!messageId) {
            return;
        }

        setBookmarkedMessages(prev => {

            const current = Array.isArray(prev)
                ? prev
                : [];

            return current.filter(
                message => message?.id !== messageId
            );

        });

    }


    // =====================================================
    // GET CURRENT MESSAGE
    // =====================================================

    function getMessage(messageId) {

        if (!messageId) {
            return null;
        }

        return allMessages.find(
            message => message?.id === messageId
        ) || null;

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


        // Scroll to message
        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        // Highlight message
        element.classList.add(
            "bookmark-message-highlight"
        );


        // Remove highlight
        window.setTimeout(() => {

            element.classList.remove(
                "bookmark-message-highlight"
            );

        }, 1600);


        // Close panel
        if (typeof onClose === "function") {
            onClose();
        }

    }


    // =====================================================
    // MESSAGE PREVIEW
    // =====================================================

    function getMessagePreview(message) {

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
    // SENDER NAME
    // =====================================================

    function getSenderName(message) {

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

        <aside className="bookmark-panel">


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <header className="bookmark-panel-header">

                <div className="bookmark-title">

                    <Bookmark size={20} />

                    <div>

                        <h3>
                            Bookmarks
                        </h3>

                        <span>
                            {bookmarks.length} saved
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="bookmark-close"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close bookmarks"
                >

                    <X size={20} />

                </button>

            </header>


            {/* ================================================= */}
            {/* EMPTY STATE */}
            {/* ================================================= */}

            {bookmarks.length === 0 ? (

                <div className="bookmark-empty">

                    <div className="bookmark-empty-icon">

                        <Bookmark size={34} />

                    </div>

                    <h3>
                        No Bookmarks Yet
                    </h3>

                    <p>
                        Messages you bookmark will appear here.
                    </p>

                </div>

            ) : (


                /* ================================================= */
                /* BOOKMARK LIST */
                /* ================================================= */

                <div className="bookmark-list">

                    {bookmarks.map(bookmark => {

                        const currentMessage =
                            getMessage(bookmark?.id);

                        const message =
                            currentMessage || bookmark;

                        if (!message?.id) {
                            return null;
                        }


                        return (

                            <div
                                className="bookmark-item"
                                key={message.id}
                            >


                                {/* ================================= */}
                                {/* MESSAGE */}
                                {/* ================================= */}

                                <button
                                    type="button"
                                    className="bookmark-message"
                                    onClick={() =>
                                        openMessage(message.id)
                                    }
                                >

                                    <div className="bookmark-item-icon">

                                        <Bookmark size={16} />

                                    </div>


                                    <div className="bookmark-item-content">


                                        <div className="bookmark-item-top">

                                            <span className="bookmark-item-sender">

                                                {getSenderName(message)}

                                            </span>

                                            <span className="bookmark-message-time">

                                                {message.time || ""}

                                            </span>

                                        </div>


                                        <div className="bookmark-item-text">

                                            {getMessagePreview(message)}

                                        </div>


                                    </div>

                                </button>


                                {/* ================================= */}
                                {/* REMOVE */}
                                {/* ================================= */}

                                <button
                                    type="button"
                                    className="bookmark-remove"
                                    title="Remove bookmark"
                                    aria-label="Remove bookmark"
                                    onClick={(event) => {

                                        event.stopPropagation();

                                        removeBookmark(
                                            message.id
                                        );

                                    }}
                                >

                                    <Trash2 size={17} />

                                </button>


                            </div>

                        );

                    })}

                </div>

            )}

        </aside>

    );

}

export default BookmarkPanel;

