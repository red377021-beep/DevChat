// src/components/MessageBubble/MessageBubble.jsx

import "./MessageBubble.css";

import {
    CheckCircle2,
    Bookmark
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import { useChat } from "../../context/ChatContext";

import BubbleText from "../BubbleText";
import BubbleFooter from "../BubbleFooter";
import ReplyBubble from "../ReplyBubble";
import MessageReaction from "../MessageReaction";
import MessageAttachment from "../MessageAttachment/MessageAttachment";
import SystemMessage from "../SystemMessage";
import VoiceBubble from "../Voice/Bubble/VoiceBubble";
import ReactionPicker from "../ReactionPicker/ReactionPicker";
import MessageActions from "../MessageActions/MessageActions.jsx";
import MessageContact from "../MessageContact/MessageContact";


/**
 * MessageBubble
 *
 * Responsible for rendering a complete chat message including:
 *
 * - Text
 * - Translation
 * - Images
 * - Videos
 * - Documents
 * - Voice messages
 * - Replies
 * - Reactions
 * - Pinned state
 * - Bookmark state
 * - Starred state
 * - Selection mode
 * - Hover actions
 * - Context menu
 * - Message information
 *
 * Video playback is delegated to:
 *
 * MessageBubble
 *      ↓
 * MessageAttachment
 *      ↓
 * BubbleVideo
 *
 * BubbleVideo handles:
 *
 * - Play / Pause
 * - Progress
 * - Duration
 * - Mute / Unmute
 * - Fullscreen
 * - File / Blob / URL sources
 */
function MessageBubble({
    message,
    onContextMenu
}) {

    // =====================================================
    // CHAT CONTEXT
    // =====================================================

    const {
        toggleReaction,
        setReplyMessage,

        selectionMode,
        selectedMessages,
        toggleMessageSelection,

        pinnedMessages,
        bookmarkedMessages,
        starredMessages,

        openMessageInfo,

        translatedMessages
    } = useChat();


    // =====================================================
    // LOCAL UI STATE
    // =====================================================

    const [
        showTranslation,
        setShowTranslation
    ] = useState(false);

    const [
        showReactionPicker,
        setShowReactionPicker
    ] = useState(false);

    const [
        hovered,
        setHovered
    ] = useState(false);


    // =====================================================
    // DOM REFERENCE
    // =====================================================

    const bubbleRef = useRef(null);


    // =====================================================
    // CLOSE REACTION PICKER
    // WHEN USER CLICKS OUTSIDE
    // =====================================================

    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                bubbleRef.current &&
                !bubbleRef.current.contains(
                    event.target
                )
            ) {

                setShowReactionPicker(false);

            }

        }


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // =====================================================
    // CLOSE REACTION PICKER WITH ESC
    // =====================================================

    useEffect(() => {

        function handleEscape(event) {

            if (
                event.key === "Escape"
            ) {

                setShowReactionPicker(false);

            }

        }


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!message) {

        return null;

    }


    // =====================================================
    // DELETED MESSAGE
    // =====================================================

    /*
     * Deleted messages are rendered as system messages.
     * This prevents deleted content from accidentally
     * rendering attachments, text, reactions, etc.
     */

    if (message.deleted === true) {

        return (

            <SystemMessage

                own={
                    Boolean(message.own)
                }

                user={
                    message.sender ||
                    (
                        message.own
                            ? "You"
                            : "Unknown"
                    )
                }

                time={
                    message.time || ""
                }

            />

        );

    }


    // =====================================================
    // MESSAGE ID
    // =====================================================

    const messageId =
        message.id;


    // =====================================================
    // SELECTION STATE
    // =====================================================

    const isSelected =
        Array.isArray(selectedMessages) &&
        selectedMessages.includes(
            messageId
        );


    // =====================================================
    // PINNED STATE
    // =====================================================

    const isPinned =
        Array.isArray(pinnedMessages) &&
        pinnedMessages.some(
            (pinned) =>
                pinned &&
                pinned.id === messageId
        );


    // =====================================================
    // BOOKMARK STATE
    // =====================================================

    const isBookmarked =
        Array.isArray(bookmarkedMessages) &&
        bookmarkedMessages.some(
            (bookmarked) =>
                bookmarked &&
                bookmarked.id === messageId
        );


    // =====================================================
    // STARRED STATE
    // =====================================================

    const isStarred =
        Array.isArray(starredMessages) &&
        starredMessages.includes(
            messageId
        );


    // =====================================================
    // TRANSLATION
    // =====================================================

    const translatedText =
        translatedMessages &&
        translatedMessages[messageId]
            ? translatedMessages[messageId]
            : null;


    // =====================================================
    // REPLY
    // =====================================================

    const hasReply =
        Boolean(message.reply);


    // =====================================================
    // TEXT
    // =====================================================

    const hasText =
        typeof message.text === "string" &&
        message.text.trim().length > 0;


    // =====================================================
    // IMAGES
    // =====================================================

    /*
     * Supports:
     *
     * message.images = [...]
     *
     * and keeps the component safe if images
     * is missing or invalid.
     */

    const images =
        Array.isArray(message.images)
            ? message.images
                .flat(Infinity)
                .filter(Boolean)
            : message.image
                ? [message.image]
                : [];


    const hasImages =
        images.length > 0;


    // =====================================================
    // VIDEO ATTACHMENTS
    // =====================================================

    /*
     * Supports:
     *
     * 1. message.videos = [...]
     * 2. message.video = [...]
     * 3. message.video = single video
     */

    const videos = (() => {

        // Preferred production format.
        if (
            Array.isArray(
                message.videos
            )
        ) {

            return message.videos
                .flat(Infinity)
                .filter(Boolean);

        }


        // Legacy array format.
        if (
            Array.isArray(
                message.video
            )
        ) {

            return message.video
                .flat(Infinity)
                .filter(Boolean);

        }


        // Single-video legacy format.
        if (message.video) {

            return [
                message.video
            ];

        }


        return [];

    })();


    const hasVideos =
        videos.length > 0;


    // =====================================================
    // DOCUMENT
    // =====================================================

    const hasFile =
        Boolean(message.file);


    // =====================================================
    // VOICE MESSAGE
    // =====================================================

    const hasVoice =
        Boolean(message.audio);


    // =====================================================
    // LOCATION
    // =====================================================

    const hasLocation =
        Boolean(message.location);


    // =====================================================
    // CONTACT
    // =====================================================

    const hasContact =
        Boolean(message.contact);


    // =====================================================
    // REACTIONS
    // =====================================================

    const hasReaction =
        Array.isArray(message.reactions) &&
        message.reactions.length > 0;


    // =====================================================
    // REACTION HANDLER
    // =====================================================

    function handleReaction(emoji) {

        if (!emoji) {

            return;

        }


        toggleReaction(
            messageId,
            emoji
        );


        setShowReactionPicker(false);

    }


    // =====================================================
    // MESSAGE CLICK
    // =====================================================

    /*
     * Normal clicks do nothing.
     *
     * When selection mode is active,
     * clicking a message toggles its selection.
     */

    function handleMessageClick() {

        if (!selectionMode) {

            return;

        }


        toggleMessageSelection(
            messageId
        );

    }


    // =====================================================
    // CONTEXT MENU
    // =====================================================

    function handleMessageContextMenu(event) {

        event.preventDefault();
        event.stopPropagation();


        /*
         * In selection mode, right-click behaves
         * like selecting the message.
         */

        if (selectionMode) {

            toggleMessageSelection(
                messageId
            );

            return;

        }


        /*
         * Forward the event to the parent context
         * menu implementation.
         */

        if (
            typeof onContextMenu ===
            "function"
        ) {

            onContextMenu(
                event,
                message
            );

        }

    }


    // =====================================================
    // DOUBLE CLICK
    // =====================================================

    /*
     * Double-click opens/closes the reaction picker.
     *
     * Selection mode disables this behavior.
     */

    function handleDoubleClick(event) {

        event.stopPropagation();


        if (selectionMode) {

            return;

        }


        setShowReactionPicker(
            (previous) =>
                !previous
        );

    }


    // =====================================================
    // TRANSLATION TOGGLE
    // =====================================================

    function handleTranslationToggle(event) {

        event.preventDefault();
        event.stopPropagation();


        setShowTranslation(
            (previous) =>
                !previous
        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div

            ref={bubbleRef}

            id={`message-${messageId}`}

            className={[
                "message-row",

                message.own
                    ? "own"
                    : "",

                isSelected
                    ? "selected"
                    : ""
            ]
                .filter(Boolean)
                .join(" ")}

            onMouseEnter={() =>
                setHovered(true)
            }

            onMouseLeave={() =>
                setHovered(false)
            }

            onClick={
                handleMessageClick
            }

            onContextMenu={
                handleMessageContextMenu
            }

            onDoubleClick={
                handleDoubleClick
            }

        >

            <div className="message-bubble">


                {/* =================================================
                    PINNED BADGE
                ================================================= */}

                {isPinned && (

                    <div className="pinned-badge">

                        📌 Pinned

                    </div>

                )}


                {/* =================================================
                    BOOKMARK INDICATOR
                ================================================= */}

                {isBookmarked && (

                    <div
                        className="bookmarked-icon"
                        title="Bookmarked"
                    >

                        <Bookmark
                            size={14}
                        />

                    </div>

                )}


                {/* =================================================
                    STAR INDICATOR
                ================================================= */}

                {isStarred && (

                    <div className="starred-badge">

                        ⭐ Starred

                    </div>

                )}


                {/* =================================================
                    SELECTION OVERLAY
                ================================================= */}

                {selectionMode && (

                    <div
                        className="selection-overlay"
                    />

                )}


                {/* =================================================
                    SELECTED MESSAGE INDICATOR
                ================================================= */}

                {selectionMode &&
                    isSelected && (

                    <div
                        className="message-selected-icon"
                    >

                        <CheckCircle2
                            size={18}
                        />

                    </div>

                )}


                {/* =================================================
                    MESSAGE ACTIONS
                ================================================= */}

                <MessageActions

                    visible={
                        hovered
                    }

                    own={
                        Boolean(
                            message.own
                        )
                    }

                    message={
                        message
                    }

                    onReaction={() => {

                        setShowReactionPicker(
                            true
                        );

                    }}

                    onReply={() => {

                        setReplyMessage(
                            message
                        );

                    }}

                    onMore={(event) => {

                        if (
                            typeof onContextMenu ===
                            "function"
                        ) {

                            onContextMenu(
                                event,
                                message
                            );

                        }

                    }}

                    onInfo={(msg) => {

                        if (
                            typeof openMessageInfo ===
                            "function"
                        ) {

                            openMessageInfo(
                                msg
                            );

                        }

                    }}

                />


                {/* =================================================
                    REACTION PICKER
                ================================================= */}

                {showReactionPicker && (

                    <ReactionPicker

                        onSelect={
                            handleReaction
                        }

                        onClose={() => {

                            setShowReactionPicker(
                                false
                            );

                        }}

                    />

                )}


                {/* =================================================
                    REPLY PREVIEW
                ================================================= */}

                {hasReply && (

                    <ReplyBubble

                        sender={
                            message.reply?.sender ||
                            "Unknown"
                        }

                        text={
                            message.reply?.text ||
                            ""
                        }

                    />

                )}


                {/* =================================================
                    IMAGE ATTACHMENTS
                ================================================= */}

                {hasImages && (

                    <MessageAttachment

                        images={
                            images
                        }

                        videos={[]}

                        video={null}

                        file={null}

                        audio={null}

                        location={null}

                        contact={null}

                    />

                )}


                {/* =================================================
                    VIDEO ATTACHMENTS
                ================================================= */}

                {hasVideos && (

                    <MessageAttachment

                        images={[]}

                        videos={
                            videos
                        }

                        video={null}

                        file={null}

                        audio={null}

                        location={null}

                        contact={null}

                    />

                )}


                {/* =================================================
                    LOCATION ATTACHMENT
                ================================================= */}

                {hasLocation && (

                    <MessageAttachment

                        images={[]}

                        videos={[]}

                        video={null}

                        file={null}

                        audio={null}

                        location={
                            message.location
                        }

                        contact={null}

                    />

                )}


                {/* =================================================
                    CONTACT ATTACHMENT
                ================================================= */}

                {hasContact && (

                    <MessageContact

                        contact={
                            message.contact
                        }

                        own={
                            Boolean(
                                message.own
                            )
                        }

                    />

                )}


                {/* =================================================
                    DOCUMENT ATTACHMENT
                ================================================= */}

                {hasFile && (

                    <MessageAttachment

                        images={[]}

                        videos={[]}

                        video={null}

                        file={
                            message.file
                        }

                        audio={null}

                        location={null}

                        contact={null}

                    />

                )}


                {/* =================================================
                    VOICE MESSAGE
                ================================================= */}

                {hasVoice && (

                    <VoiceBubble

                        id={
                            messageId
                        }

                        audio={
                            message.audio
                        }

                        blob={
                            message.blob
                        }

                        duration={
                            message.duration
                        }

                        own={
                            Boolean(
                                message.own
                            )
                        }

                        seen={
                            Boolean(
                                message.seen
                            )
                        }

                        time={
                            message.time
                        }

                        reactions={
                            message.reactions || []
                        }

                    />

                )}


                {/* =================================================
                    TEXT MESSAGE
                ================================================= */}

                {!hasVoice &&
                    hasText && (

                    <>

                        <BubbleText

                            text={
                                showTranslation &&
                                translatedText
                                    ? translatedText
                                    : message.text
                            }

                        />


                        {/* -----------------------------------------
                            TRANSLATION TOGGLE
                        ----------------------------------------- */}

                        {translatedText && (

                            <button

                                type="button"

                                className={
                                    "translation-toggle"
                                }

                                onClick={
                                    handleTranslationToggle
                                }

                            >

                                {showTranslation
                                    ? "Show original"
                                    : "Show translation"}

                            </button>

                        )}

                    </>

                )}


                {/* =================================================
                    MESSAGE REACTIONS
                ================================================= */}

                {hasReaction && (

                    <MessageReaction

                        reactions={
                            message.reactions
                        }

                    />

                )}


                {/* =================================================
                    MESSAGE FOOTER
                ================================================= */}

                <BubbleFooter

                    own={
                        Boolean(
                            message.own
                        )
                    }

                    time={
                        message.time || ""
                    }

                    status={
                        message.seen
                            ? "seen"
                            : "sent"
                    }

                    edited={
                        Boolean(
                            message.edited
                        )
                    }

                    pinned={
                        isPinned
                    }

                    forwarded={
                        Boolean(
                            message.forwarded
                        )
                    }

                />

            </div>

        </div>

    );

}


export default MessageBubble;