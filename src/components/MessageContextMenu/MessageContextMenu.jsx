import "./MessageContextMenu.css";

import {
    Reply,
    Forward,
    Copy,
    Pencil,
    Pin,
    Bookmark,
    Languages,
    Trash2,
    Info,
    CheckSquare,
    Star
} from "lucide-react";

import ContextMenuItem from "../ContextMenuItem";
import { useChat } from "../../context/ChatContext";

function MessageContextMenu() {

    const {
        contextMenu,
        closeContextMenu,

        setReplyMessage,
        setEditMessage,

        openDeleteModal,

        forwardMessage,

        setMessageInfo,
        openMessageInfo,
        openTranslate,

        starredMessages,
        toggleStarMessage,

        pinnedMessages,
        setPinnedMessages,

        bookmarkedMessages,
        setBookmarkedMessages,

        toggleMessageSelection
    } = useChat();


    // ==========================================
    // Safety
    // ==========================================

    const message = contextMenu?.message;

    if (!message) {
        return null;
    }


    // ==========================================
    // Reply
    // ==========================================

    function handleReply() {

        if (message.deleted) {
            return;
        }

        setReplyMessage(message);

        closeContextMenu();

    }


    // ==========================================
    // Edit
    // ==========================================

    function handleEdit() {

        if (
            message.deleted ||
            !message.own
        ) {

            closeContextMenu();

            return;

        }

        setEditMessage(message);

        closeContextMenu();

    }


    // ==========================================
    // Copy
    // ==========================================

    async function handleCopy() {

        if (message.deleted) {
            return;
        }

        if (!message.text) {

            closeContextMenu();

            return;

        }

        try {

            await navigator.clipboard.writeText(
                message.text
            );

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

        }

        closeContextMenu();

    }


    // ==========================================
    // Delete
    // ==========================================

    function handleDelete() {

        if (message.deleted) {
            return;
        }

        openDeleteModal(message);

        closeContextMenu();

    }


    // ==========================================
    // Pin / Unpin
    // ==========================================

    function handlePin() {

        if (message.deleted) {

            closeContextMenu();

            return;

        }

        const currentPinned =
            Array.isArray(pinnedMessages)
                ? pinnedMessages
                : [];

        const alreadyPinned =
            currentPinned.some(
                pinned =>
                    pinned?.id === message.id
            );


        if (alreadyPinned) {

            setPinnedMessages(prev =>
                (Array.isArray(prev)
                    ? prev
                    : []
                ).filter(
                    pinned =>
                        pinned?.id !== message.id
                )
            );

        } else {

            setPinnedMessages(prev => {

                const current =
                    Array.isArray(prev)
                        ? prev
                        : [];

                const exists =
                    current.some(
                        pinned =>
                            pinned?.id === message.id
                    );

                if (exists) {
                    return current;
                }

                return [
                    ...current,
                    message
                ];

            });

        }

        closeContextMenu();

    }


    // ==========================================
    // Bookmark / Remove Bookmark
    // ==========================================

   function handleBookmark() {

    if (message.deleted) {
        closeContextMenu();
        return;
    }

    const currentBookmarks = Array.isArray(bookmarkedMessages)
        ? bookmarkedMessages
        : [];

    const alreadyBookmarked = currentBookmarks.some(
        bookmarked => bookmarked?.id === message.id
    );

    if (alreadyBookmarked) {

        setBookmarkedMessages(prev =>
            (Array.isArray(prev) ? prev : []).filter(
                bookmarked => bookmarked?.id !== message.id
            )
        );

    } else {

        setBookmarkedMessages(prev => {

            const current = Array.isArray(prev)
                ? prev
                : [];

            return [
                ...current,
                message
            ];

        });

    }

    closeContextMenu();

}



    // ==========================================
    // Star / Unstar
    // ==========================================

    function handleStar() {

        if (message.deleted) {

            closeContextMenu();

            return;

        }

        toggleStarMessage(message.id);

        closeContextMenu();

    }


    // ==========================================
    // Forward
    // ==========================================

    function handleForward() {

        if (
            !message ||
            message.deleted
        ) {

            closeContextMenu();

            return;

        }

        if (
            typeof forwardMessage === "function"
        ) {

            forwardMessage(message);

        } else {

            console.warn(
                "forwardMessage is not available in ChatContext"
            );

        }

        closeContextMenu();

    }


    // ==========================================
    // Message Info
    // ==========================================

    function handleMessageInfo() {

        if (!message) {
            return;
        }

        openMessageInfo(message);

        closeContextMenu();

    }


    // ==========================================
    // Select Message
    // ==========================================

    function handleSelect() {

        if (
            typeof toggleMessageSelection ===
            "function"
        ) {

            toggleMessageSelection(
                message.id
            );

        }

        closeContextMenu();

    }


    // ==========================================
    // Translate
    // ==========================================

    function handleTranslate() {

        if (message.deleted) {
            return;
        }

        if (
            typeof openTranslate ===
            "function"
        ) {

            openTranslate(message);

        }

        closeContextMenu();

    }


    // ==========================================
    // Pin Status
    // ==========================================

    const currentPinnedMessages =
        Array.isArray(pinnedMessages)
            ? pinnedMessages
            : [];

    const isPinned =
        currentPinnedMessages.some(
            pinned =>
                pinned?.id === message.id
        );


    // ==========================================
    // Bookmark Status
    // ==========================================

    const currentBookmarkedMessages =
        Array.isArray(bookmarkedMessages)
            ? bookmarkedMessages
            : [];

    const isBookmarked =
        currentBookmarkedMessages.some(
            bookmarked =>
                bookmarked?.id === message.id
        );


    // ==========================================
    // Star Status
    // ==========================================

    const currentStarredMessages =
        Array.isArray(starredMessages)
            ? starredMessages
            : [];

    const isStarred =
        currentStarredMessages.includes(
            message.id
        );


    // ==========================================
    // Menu Items
    // ==========================================

    const items = [

        {
            label: "Reply",
            icon: Reply,
            action: handleReply
        },

        {
            label: "Select Messages",
            icon: CheckSquare,
            action: handleSelect
        },

        {
            label: "Forward",
            icon: Forward,
            action: handleForward
        },

        {
            label: "Copy",
            icon: Copy,
            action: handleCopy
        },

        {
            label: "Edit",
            icon: Pencil,
            action: handleEdit,
            disabled:
                message.deleted ||
                !message.own
        },

        {
            label:
                isPinned
                    ? "Unpin"
                    : "Pin",

            icon: Pin,

            action: handlePin
        },

        {
            label:
                isBookmarked
                    ? "Remove Bookmark"
                    : "Bookmark",

            icon: Bookmark,

            action: handleBookmark
        },

        {
            label:
                isStarred
                    ? "Unstar"
                    : "Star",

            icon: Star,

            action: handleStar
        },

        {
            label: "Translate",
            icon: Languages,
            action: handleTranslate
        },

        {
            label: "Delete",
            icon: Trash2,
            danger: true,
            action: handleDelete
        },

        {
            label: "Message Info",
            icon: Info,
            action: handleMessageInfo
        }

    ];


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="message-context-menu">

            {items.map(item => (

                <ContextMenuItem

                    key={item.label}

                    icon={item.icon}

                    label={item.label}

                    danger={item.danger}

                    disabled={item.disabled}

                    onClick={item.action}

                />

            ))}

        </div>

    );

}

export default MessageContextMenu;