import "./MediaPanel.css";

import {
    Image,
    Video,
    FileText,
    Link,
    Music,
    X,
    FolderOpen
} from "lucide-react";

import { useChat } from "../../context/ChatContext";


function MediaPanel({ onClose }) {

    const {
        messages
    } = useChat();


    // =====================================================
    // SAFETY
    // =====================================================

    const allMessages =
        Array.isArray(messages)
            ? messages
            : [];


    // =====================================================
    // MEDIA
    // =====================================================

    const mediaMessages =
        allMessages.filter(
            message =>
                message?.image ||
                message?.video
        );


    // =====================================================
    // FILES
    // =====================================================

    const fileMessages =
        allMessages.filter(
            message =>
                message?.file
        );


    // =====================================================
    // AUDIO
    // =====================================================

    const audioMessages =
        allMessages.filter(
            message =>
                message?.audio
        );


    // =====================================================
    // LINKS
    // =====================================================

    const linkMessages =
        allMessages.filter(message => {

            if (
                typeof message?.text !== "string"
            ) {
                return false;
            }

            return /https?:\/\/[^\s]+/i.test(
                message.text
            );

        });


    // =====================================================
    // OPEN MESSAGE
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


        element.classList.add(
            "media-message-highlight"
        );


        window.setTimeout(() => {

            element.classList.remove(
                "media-message-highlight"
            );

        }, 1600);


        if (
            typeof onClose === "function"
        ) {
            onClose();
        }

    }


    // =====================================================
    // MESSAGE PREVIEW
    // =====================================================

    function getPreview(message) {

        if (!message) {
            return "Message";
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
            return "🎵 Audio";
        }


        if (
            typeof message.text === "string"
        ) {
            return message.text;
        }


        return "Message";

    }


    // =====================================================
    // EMPTY SECTION
    // =====================================================

    function EmptySection({
        icon: Icon,
        title
    }) {

        return (

            <div className="media-empty-section">

                <Icon size={24} />

                <span>
                    No {title.toLowerCase()} yet
                </span>

            </div>

        );

    }


    // =====================================================
    // RENDER MESSAGE
    // =====================================================

    function renderMessage(
        message,
        type
    ) {

        if (!message) {
            return null;
        }


        return (

            <button
                type="button"
                className="media-item"
                onClick={() =>
                    openMessage(message.id)
                }
            >

                <div
                    className={`media-item-icon ${type}`}
                >

                    {type === "media" && (
                        message.image
                            ? <Image size={18} />
                            : <Video size={18} />
                    )}

                    {type === "file" && (
                        <FileText size={18} />
                    )}

                    {type === "audio" && (
                        <Music size={18} />
                    )}

                    {type === "link" && (
                        <Link size={18} />
                    )}

                </div>


                <div className="media-item-content">

                    <div className="media-item-title">

                        {getPreview(message)}

                    </div>


                    <div className="media-item-time">

                        {message.time || ""}

                    </div>

                </div>

            </button>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <aside className="media-panel">


            {/* =========================================
                HEADER
            ========================================= */}

            <header className="media-panel-header">

                <div className="media-panel-title">

                    <FolderOpen size={21} />

                    <div>

                        <h3>
                            Media, Links & Files
                        </h3>

                        <span>
                            Shared content
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="media-close"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close media panel"
                >

                    <X size={20} />

                </button>

            </header>


            {/* =========================================
                MEDIA SECTION
            ========================================= */}

            <section className="media-section">

                <div className="media-section-header">

                    <div>

                        <Image size={17} />

                        <span>
                            Media
                        </span>

                    </div>


                    <span className="media-count">
                        {mediaMessages.length}
                    </span>

                </div>


                <div className="media-section-list">

                    {mediaMessages.length === 0 ? (

                        <EmptySection
                            icon={Image}
                            title="Media"
                        />

                    ) : (

                        mediaMessages.map(
                            message =>
                                renderMessage(
                                    message,
                                    "media"
                                )
                        )

                    )}

                </div>

            </section>


            {/* =========================================
                LINKS SECTION
            ========================================= */}

            <section className="media-section">

                <div className="media-section-header">

                    <div>

                        <Link size={17} />

                        <span>
                            Links
                        </span>

                    </div>


                    <span className="media-count">
                        {linkMessages.length}
                    </span>

                </div>


                <div className="media-section-list">

                    {linkMessages.length === 0 ? (

                        <EmptySection
                            icon={Link}
                            title="Links"
                        />

                    ) : (

                        linkMessages.map(
                            message =>
                                renderMessage(
                                    message,
                                    "link"
                                )
                        )

                    )}

                </div>

            </section>


            {/* =========================================
                FILES SECTION
            ========================================= */}

            <section className="media-section">

                <div className="media-section-header">

                    <div>

                        <FileText size={17} />

                        <span>
                            Files
                        </span>

                    </div>


                    <span className="media-count">
                        {fileMessages.length}
                    </span>

                </div>


                <div className="media-section-list">

                    {fileMessages.length === 0 ? (

                        <EmptySection
                            icon={FileText}
                            title="Files"
                        />

                    ) : (

                        fileMessages.map(
                            message =>
                                renderMessage(
                                    message,
                                    "file"
                                )
                        )

                    )}

                </div>

            </section>


            {/* =========================================
                AUDIO SECTION
            ========================================= */}

            <section className="media-section">

                <div className="media-section-header">

                    <div>

                        <Music size={17} />

                        <span>
                            Audio
                        </span>

                    </div>


                    <span className="media-count">
                        {audioMessages.length}
                    </span>

                </div>


                <div className="media-section-list">

                    {audioMessages.length === 0 ? (

                        <EmptySection
                            icon={Music}
                            title="Audio"
                        />

                    ) : (

                        audioMessages.map(
                            message =>
                                renderMessage(
                                    message,
                                    "audio"
                                )
                        )

                    )}

                </div>

            </section>


        </aside>

    );

}


export default MediaPanel;