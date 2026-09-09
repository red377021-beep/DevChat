import "./MediaLinksFiles.css";

import {
    Image,
    Link as LinkIcon,
    File,
    X,
    ExternalLink,
    Play,
    MessageCircle
} from "lucide-react";

import { useMemo } from "react";
import { useChat } from "../../context/ChatContext";

function MediaLinksFiles({ onClose }) {

    const { messages } = useChat();

    const allMessages = Array.isArray(messages)
        ? messages
        : [];


    // =====================================================
    // MEDIA
    // =====================================================

    const mediaMessages = useMemo(() => {

        return allMessages.filter((message) => {

            if (!message) {
                return false;
            }

            return Boolean(
                message.image ||
                message.video
            );

        });

    }, [allMessages]);


    // =====================================================
    // LINKS
    // =====================================================

    const linkMessages = useMemo(() => {

        return allMessages.filter((message) => {

            if (
                !message ||
                typeof message.text !== "string"
            ) {
                return false;
            }

            return /https?:\/\/[^\s]+/i.test(
                message.text
            );

        });

    }, [allMessages]);


    // =====================================================
    // FILES
    // =====================================================

    const fileMessages = useMemo(() => {

        return allMessages.filter((message) => {

            return Boolean(
                message?.file
            );

        });

    }, [allMessages]);


    // =====================================================
    // OPEN ORIGINAL MESSAGE
    // =====================================================

    function openMessage(messageId) {

        if (!messageId) {
            return;
        }

        const element =
            document.getElementById(
                `message-${messageId}`
            );

        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        element.classList.remove(
            "media-message-highlight"
        );

        void element.offsetWidth;

        element.classList.add(
            "media-message-highlight"
        );

        window.setTimeout(() => {

            element.classList.remove(
                "media-message-highlight"
            );

        }, 1600);

        if (typeof onClose === "function") {
            onClose();
        }

    }


    // =====================================================
    // GET SENDER
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
    // GET MESSAGE PREVIEW
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
            return "Image";
        }

        if (message.video) {
            return "Video";
        }

        if (message.file) {
            return "File";
        }

        if (message.audio) {
            return "Voice message";
        }

        return "Message";

    }


    // =====================================================
    // EXTRACT URL
    // =====================================================

    function getLink(text) {

        if (
            typeof text !== "string"
        ) {
            return "";
        }

        const match =
            text.match(
                /https?:\/\/[^\s]+/i
            );

        return match
            ? match[0]
            : "";

    }


    // =====================================================
    // OPEN EXTERNAL LINK
    // =====================================================

    function openExternalLink(
        event,
        url
    ) {

        event.stopPropagation();

        if (!url) {
            return;
        }

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

    }


    // =====================================================
    // MEDIA PREVIEW
    // =====================================================

    function renderMedia(message) {

        if (message?.image) {

            return (
                <img
                    src={message.image}
                    alt="Shared media"
                    loading="lazy"
                    onError={(event) => {

                        event.currentTarget.style.display =
                            "none";

                    }}
                />
            );

        }

        return (
            <div className="media-video-preview">

                <Play
                    size={26}
                    fill="currentColor"
                />

            </div>
        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <aside
            className="media-links-files"
            aria-label="Media, Links and Files"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="media-links-header">

                <div className="media-links-title">

                    <div className="media-links-title-icon">

                        <ExternalLink size={19} />

                    </div>

                    <div>

                        <h3>
                            Media, Links & Files
                        </h3>

                        <span>
                            Shared content from this chat
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="media-links-close"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close"
                >

                    <X size={19} />

                </button>

            </header>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="media-links-body">


                {/* =================================================
                    MEDIA
                ================================================= */}

                <section className="media-section">

                    <div className="media-section-header">

                        <div className="media-section-title">

                            <Image size={17} />

                            <span>
                                Media
                            </span>

                        </div>

                        <span className="media-section-count">
                            {mediaMessages.length}
                        </span>

                    </div>


                    {mediaMessages.length === 0 ? (

                        <div className="media-empty">

                            <Image size={22} />

                            <span>
                                No media shared yet.
                            </span>

                        </div>

                    ) : (

                        <div className="media-grid">

                            {mediaMessages.map(
                                (message) => (

                                    <button
                                        type="button"
                                        key={message.id}
                                        className="media-item"
                                        onClick={() =>
                                            openMessage(
                                                message.id
                                            )
                                        }
                                        title={`Open message from ${getSender(message)}`}
                                    >

                                        {renderMedia(
                                            message
                                        )}

                                        {message.video && (

                                            <span className="media-video-badge">
                                                <Play
                                                    size={12}
                                                    fill="currentColor"
                                                />
                                            </span>

                                        )}

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* =================================================
                    LINKS
                ================================================= */}

                <section className="media-section">

                    <div className="media-section-header">

                        <div className="media-section-title">

                            <LinkIcon size={17} />

                            <span>
                                Links
                            </span>

                        </div>

                        <span className="media-section-count">
                            {linkMessages.length}
                        </span>

                    </div>


                    {linkMessages.length === 0 ? (

                        <div className="media-empty">

                            <LinkIcon size={22} />

                            <span>
                                No links shared yet.
                            </span>

                        </div>

                    ) : (

                        <div className="media-list">

                            {linkMessages.map(
                                (message) => {

                                    const link =
                                        getLink(
                                            message.text
                                        );

                                    return (

                                        <div
                                            className="media-list-item"
                                            key={message.id}
                                        >

                                            <button
                                                type="button"
                                                className="media-list-main"
                                                onClick={() =>
                                                    openMessage(
                                                        message.id
                                                    )
                                                }
                                            >

                                                <div className="media-list-icon">

                                                    <LinkIcon
                                                        size={17}
                                                    />

                                                </div>

                                                <div className="media-list-content">

                                                    <strong>
                                                        {getSender(
                                                            message
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {link}
                                                    </span>

                                                </div>

                                            </button>


                                            {link && (

                                                <button
                                                    type="button"
                                                    className="media-external-btn"
                                                    title="Open link"
                                                    aria-label="Open link"
                                                    onClick={(event) =>
                                                        openExternalLink(
                                                            event,
                                                            link
                                                        )
                                                    }
                                                >

                                                    <ExternalLink
                                                        size={16}
                                                    />

                                                </button>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>


                {/* =================================================
                    FILES
                ================================================= */}

                <section className="media-section">

                    <div className="media-section-header">

                        <div className="media-section-title">

                            <File size={17} />

                            <span>
                                Files
                            </span>

                        </div>

                        <span className="media-section-count">
                            {fileMessages.length}
                        </span>

                    </div>


                    {fileMessages.length === 0 ? (

                        <div className="media-empty">

                            <File size={22} />

                            <span>
                                No files shared yet.
                            </span>

                        </div>

                    ) : (

                        <div className="media-list">

                            {fileMessages.map(
                                (message) => (

                                    <button
                                        type="button"
                                        key={message.id}
                                        className="media-list-item"
                                        onClick={() =>
                                            openMessage(
                                                message.id
                                            )
                                        }
                                    >

                                        <div className="media-list-icon">

                                            <File
                                                size={18}
                                            />

                                        </div>


                                        <div className="media-list-content">

                                            <strong>
                                                {getSender(
                                                    message
                                                )}
                                            </strong>

                                            <span>
                                                {getPreview(
                                                    message
                                                )}
                                            </span>

                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* =================================================
                    TOTAL
                ================================================= */}

                {(mediaMessages.length > 0 ||
                    linkMessages.length > 0 ||
                    fileMessages.length > 0) && (

                    <div className="media-links-footer">

                        <MessageCircle
                            size={15}
                        />

                        <span>
                            {mediaMessages.length +
                                linkMessages.length +
                                fileMessages.length}{" "}
                            shared items
                        </span>

                    </div>

                )}

            </div>

        </aside>

    );
}

export default MediaLinksFiles;