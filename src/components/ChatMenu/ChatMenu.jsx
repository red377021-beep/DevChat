import "./ChatMenu.css";

import {
    User,
    Search,
    Image,
    Pin,
    Star,
    Bookmark,
    BellOff,
    Bell,
    ChevronRight,
    Clock,
    X
} from "lucide-react";

import { useState } from "react";
import { useChat } from "../../context/ChatContext";

function ChatMenu({
    onClose,
    onProfile,
    onSearch,
    onMedia,
    onPinned,
    onStarred,
    onBookmarks
}) {

    // =====================================================
    // CHAT CONTEXT
    // =====================================================

    const {
        muteNotifications,
        muteDuration,
        muteChat,
        muteChatCustom,
        unmuteChat
    } = useChat();


    // =====================================================
    // STATE
    // =====================================================

    const [muteOpen, setMuteOpen] =
        useState(false);

    const [customMuteOpen, setCustomMuteOpen] =
        useState(false);

    const [customValue, setCustomValue] =
        useState("");

    const [customUnit, setCustomUnit] =
        useState("minutes");


    // =====================================================
    // ACTION HANDLER
    // =====================================================

    function handleAction(action) {

        if (typeof action === "function") {
            action();
        }

        if (typeof onClose === "function") {
            onClose();
        }

    }


    // =====================================================
    // PRESET MUTE
    // =====================================================

    function handleMute(duration) {

        if (typeof muteChat === "function") {
            muteChat(duration);
        }

        setMuteOpen(false);
        setCustomMuteOpen(false);

        if (typeof onClose === "function") {
            onClose();
        }

    }


    // =====================================================
    // CUSTOM MUTE
    // =====================================================

    function handleCustomMute() {

        const value =
            Number(customValue);

        if (
            !Number.isFinite(value) ||
            value <= 0
        ) {
            return;
        }


        if (
            typeof muteChatCustom === "function"
        ) {

            muteChatCustom(
                value,
                customUnit
            );

        }


        setCustomValue("");

        setCustomUnit("minutes");

        setCustomMuteOpen(false);

        setMuteOpen(false);


        if (typeof onClose === "function") {
            onClose();
        }

    }


    // =====================================================
    // UNMUTE
    // =====================================================

    function handleUnmute() {

        if (
            typeof unmuteChat === "function"
        ) {
            unmuteChat();
        }

        setMuteOpen(false);
        setCustomMuteOpen(false);

        if (typeof onClose === "function") {
            onClose();
        }

    }


    // =====================================================
    // MUTE LABEL
    // =====================================================

    function getMuteLabel() {

        if (!muteNotifications) {
            return "Mute Notifications";
        }

        if (muteDuration === "1h") {
            return "Muted · 1 Hour";
        }

        if (muteDuration === "8h") {
            return "Muted · 8 Hours";
        }

        if (muteDuration === "1w") {
            return "Muted · 1 Week";
        }

        if (muteDuration === "custom") {
            return "Muted · Custom";
        }

        if (muteDuration === "always") {
            return "Muted · Always";
        }

        return "Notifications Muted";

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className="chat-menu"
            role="menu"
            aria-label="Chat options"
        >

            {/* =================================================
                CHAT INFO
            ================================================= */}

            <button
                type="button"
                className="chat-menu-item"
                role="menuitem"
                onClick={() =>
                    handleAction(onProfile)
                }
            >

                <User size={18} />

                <span>
                    Chat Info
                </span>

            </button>


            {/* =================================================
                SEARCH
            ================================================= */}

            <button
                type="button"
                className="chat-menu-item"
                role="menuitem"
                onClick={() =>
                    handleAction(onSearch)
                }
            >

                <Search size={18} />

                <span>
                    Search
                </span>

            </button>


            {/* =================================================
                MEDIA
            ================================================= */}

            <button
                type="button"
                className="chat-menu-item"
                role="menuitem"
                onClick={() =>
                    handleAction(onMedia)
                }
            >

                <Image size={18} />

                <span>
                    Media, Links & Files
                </span>

            </button>


            {/* =================================================
                PINNED
            ================================================= */}

            <button
                type="button"
                className="chat-menu-item"
                role="menuitem"
                onClick={() =>
                    handleAction(onPinned)
                }
            >

                <Pin size={18} />

                <span>
                    Pinned Messages
                </span>

            </button>


            {/* =================================================
                STARRED
            ================================================= */}

            <button
                type="button"
                className="chat-menu-item"
                role="menuitem"
                onClick={() =>
                    handleAction(onStarred)
                }
            >

                <Star size={18} />

                <span>
                    Starred Messages
                </span>

            </button>


            {/* =================================================
                BOOKMARKS
            ================================================= */}

            <button
                type="button"
                className="chat-menu-item"
                role="menuitem"
                onClick={() =>
                    handleAction(onBookmarks)
                }
            >

                <Bookmark size={18} />

                <span>
                    Bookmarked Messages
                </span>

            </button>


            {/* =================================================
                MUTE NOTIFICATIONS
            ================================================= */}

            <div className="chat-menu-mute-wrapper">

                <button
                    type="button"
                    className={`chat-menu-item ${
                        muteNotifications
                            ? "chat-menu-item-active"
                            : ""
                    }`}
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={muteOpen}
                    onClick={() =>
                        setMuteOpen(
                            previous => !previous
                        )
                    }
                >

                    {muteNotifications ? (
                        <BellOff size={18} />
                    ) : (
                        <Bell size={18} />
                    )}

                    <span>
                        {getMuteLabel()}
                    </span>

                    <ChevronRight
                        size={16}
                        className={`chat-menu-arrow ${
                            muteOpen
                                ? "chat-menu-arrow-open"
                                : ""
                        }`}
                    />

                </button>


                {/* =================================================
                    MUTE SUBMENU
                ================================================= */}

                {muteOpen && (

                    <div
                        className="chat-mute-submenu"
                        role="menu"
                    >

                        {!muteNotifications ? (

                            <>

                                <div className="chat-mute-title">

                                    <Clock size={15} />

                                    <span>
                                        Mute notifications
                                    </span>

                                </div>


                                {/* =============================
                                    1 HOUR
                                ============================= */}

                                <button
                                    type="button"
                                    className="chat-mute-option"
                                    role="menuitem"
                                    onClick={() =>
                                        handleMute("1h")
                                    }
                                >
                                    1 Hour
                                </button>


                                {/* =============================
                                    8 HOURS
                                ============================= */}

                                <button
                                    type="button"
                                    className="chat-mute-option"
                                    role="menuitem"
                                    onClick={() =>
                                        handleMute("8h")
                                    }
                                >
                                    8 Hours
                                </button>


                                {/* =============================
                                    1 WEEK
                                ============================= */}

                                <button
                                    type="button"
                                    className="chat-mute-option"
                                    role="menuitem"
                                    onClick={() =>
                                        handleMute("1w")
                                    }
                                >
                                    1 Week
                                </button>


                                {/* =============================
                                    ALWAYS
                                ============================= */}

                                <button
                                    type="button"
                                    className="chat-mute-option"
                                    role="menuitem"
                                    onClick={() =>
                                        handleMute("always")
                                    }
                                >
                                    Always
                                </button>


                                {/* =============================
                                    CUSTOM
                                ============================= */}

                                <button
                                    type="button"
                                    className="chat-mute-option"
                                    role="menuitem"
                                    onClick={() =>
                                        setCustomMuteOpen(true)
                                    }
                                >

                                    <Clock size={16} />

                                    <span>
                                        Custom
                                    </span>

                                </button>

                            </>

                        ) : (

                            /* =================================
                                UNMUTE
                            ================================= */

                            <button
                                type="button"
                                className="chat-mute-option chat-unmute-option"
                                role="menuitem"
                                onClick={handleUnmute}
                            >

                                <Bell size={16} />

                                <span>
                                    Unmute Notifications
                                </span>

                            </button>

                        )}

                    </div>

                )}


                {/* =================================================
                    CUSTOM MUTE POPUP
                ================================================= */}

                {customMuteOpen && (

                    <div className="custom-mute-popup">

                        {/* HEADER */}

                        <div className="custom-mute-header">

                            <div>

                                <strong>
                                    Custom Mute
                                </strong>

                                <span>
                                    Choose your own duration
                                </span>

                            </div>


                            <button
                                type="button"
                                className="custom-mute-close"
                                aria-label="Close custom mute"
                                onClick={() =>
                                    setCustomMuteOpen(false)
                                }
                            >

                                <X size={17} />

                            </button>

                        </div>


                        {/* INPUT */}

                        <div className="custom-mute-input-row">

                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={customValue}
                                placeholder="Enter amount"
                                autoFocus
                                onChange={(event) =>
                                    setCustomValue(
                                        event.target.value
                                    )
                                }
                                onKeyDown={(event) => {

                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {
                                        handleCustomMute();
                                    }

                                    if (
                                        event.key ===
                                        "Escape"
                                    ) {
                                        setCustomMuteOpen(
                                            false
                                        );
                                    }

                                }}
                            />


                            <select
                                value={customUnit}
                                onChange={(event) =>
                                    setCustomUnit(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="minutes">
                                    Minutes
                                </option>

                                <option value="hours">
                                    Hours
                                </option>

                                <option value="days">
                                    Days
                                </option>

                            </select>

                        </div>


                        {/* APPLY */}

                        <button
                            type="button"
                            className="custom-mute-apply"
                            disabled={
                                !customValue ||
                                Number(customValue) <= 0
                            }
                            onClick={handleCustomMute}
                        >

                            <BellOff size={16} />

                            <span>
                                Mute Notifications
                            </span>

                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}

export default ChatMenu;