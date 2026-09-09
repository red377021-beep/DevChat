import "./GroupChat.css";

import {
    ArrowLeft,
    MessageCircle,
    Users,
    Search,
    MoreVertical,
    X,
    Circle,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import GroupMessage from "../GroupMessage/GroupMessage";
import GroupMessageInput from "../GroupMessageInput/GroupMessageInput";


function GroupChat({
    group = {},
    messages = [],
    currentUserId = "current-user",
    onBack,
    onMessageSend,
    onMessageReply,
    onMessageMore,
}) {
    const [searchOpen, setSearchOpen] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [replyMessage, setReplyMessage] =
        useState(null);

    const messagesEndRef =
        useRef(null);


    // =====================================================
    // SAFE GROUP DATA
    // =====================================================

    const groupName =
        group?.name || "Group Chat";

    const memberCount =
        Number.isFinite(Number(group?.members))
            ? Math.max(0, Number(group.members))
            : 0;

    const onlineMembers =
        Number.isFinite(Number(group?.onlineMembers))
            ? Math.max(0, Number(group.onlineMembers))
            : 0;


    // =====================================================
    // FILTER MESSAGES
    // =====================================================

    const filteredMessages = useMemo(() => {
        const query =
            searchQuery.trim().toLowerCase();

        if (!query) {
            return messages;
        }

        return messages.filter((message) => {
            const text =
                String(
                    message?.text || ""
                ).toLowerCase();

            const sender =
                String(
                    message?.senderName || ""
                ).toLowerCase();

            return (
                text.includes(query) ||
                sender.includes(query)
            );
        });
    }, [messages, searchQuery]);


    // =====================================================
    // AUTO SCROLL
    // =====================================================

    useEffect(() => {
        if (searchQuery.trim()) {
            return;
        }

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages, searchQuery]);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleToggleSearch = () => {
        setSearchOpen((current) => {
            const next = !current;

            if (current) {
                setSearchQuery("");
            }

            return next;
        });
    };


    const handleCloseSearch = () => {
        setSearchOpen(false);
        setSearchQuery("");
    };


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const handleSend = (text) => {
        const cleanText =
            String(text || "").trim();

        if (!cleanText) {
            return;
        }


        const newMessage = {
            id:
                `group-message-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 7)}`,

            text: cleanText,

            senderId:
                currentUserId,

            senderName:
                "You",

            createdAt:
                new Date().toISOString(),

            replyTo:
                replyMessage || null,
        };


        onMessageSend?.(newMessage);

        setReplyMessage(null);
    };


    // =====================================================
    // REPLY
    // =====================================================

    const handleReply = (message) => {
        setReplyMessage(message);

        onMessageReply?.(message);
    };


    // =====================================================
    // MESSAGE MORE
    // =====================================================

    const handleMessageMore = (message) => {
        onMessageMore?.(message);
    };


    // =====================================================
    // GROUP MENU
    // =====================================================

    const handleGroupMenu = () => {
        console.log(
            "Group chat menu",
            group
        );
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section className="group-chat">

            {/* =================================================
                TOP BAR
            ================================================= */}

            <header className="group-chat__topbar">

                <div className="group-chat__identity">

                    {onBack && (
                        <button
                            type="button"
                            className="group-chat__back"
                            onClick={onBack}
                            aria-label="Back to group"
                        >
                            <ArrowLeft
                                size={18}
                            />
                        </button>
                    )}


                    <div className="group-chat__avatar">

                        {group?.avatar ? (
                            <img
                                src={group.avatar}
                                alt={`${groupName} group`}
                            />
                        ) : (
                            <Users
                                size={19}
                            />
                        )}

                    </div>


                    <div className="group-chat__group-details">

                        <h3>
                            {groupName}
                        </h3>


                        <div className="group-chat__members">

                            <span className="group-chat__online-indicator">
                                <Circle
                                    size={7}
                                    fill="currentColor"
                                    strokeWidth={0}
                                />
                            </span>

                            <span>
                                {onlineMembers}
                                {" "}
                                online
                            </span>

                            <span className="group-chat__separator">
                                •
                            </span>

                            <span>
                                {memberCount}
                                {" "}
                                members
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="group-chat__actions">

                    <button
                        type="button"
                        className={`group-chat__icon-btn ${
                            searchOpen
                                ? "is-active"
                                : ""
                        }`}
                        onClick={
                            handleToggleSearch
                        }
                        aria-label="Search messages"
                        aria-pressed={searchOpen}
                    >
                        <Search
                            size={18}
                        />
                    </button>


                    <button
                        type="button"
                        className="group-chat__icon-btn"
                        onClick={
                            handleGroupMenu
                        }
                        aria-label="More group options"
                    >
                        <MoreVertical
                            size={18}
                        />
                    </button>

                </div>

            </header>


            {/* =================================================
                SEARCH BAR
            ================================================= */}

            {searchOpen && (
                <div className="group-chat__search">

                    <Search
                        size={16}
                        aria-hidden="true"
                    />


                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(
                                event.target.value
                            )
                        }
                        placeholder="Search messages..."
                        autoFocus
                        aria-label="Search group messages"
                    />


                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearchQuery("")
                            }
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}

                </div>
            )}


            {/* =================================================
                SEARCH RESULT INFO
            ================================================= */}

            {searchOpen &&
                searchQuery.trim() && (
                    <div className="group-chat__search-info">

                        <span>
                            {filteredMessages.length}
                            {" "}
                            {filteredMessages.length === 1
                                ? "message"
                                : "messages"}
                            {" "}
                            found
                        </span>

                    </div>
                )}


            {/* =================================================
                MESSAGES
            ================================================= */}

            <div className="group-chat__messages">

                {filteredMessages.length === 0 ? (

                    <div className="group-chat__empty">

                        <div className="group-chat__empty-icon">
                            <MessageCircle
                                size={27}
                            />
                        </div>


                        <h4>
                            {searchQuery.trim()
                                ? "No messages found"
                                : "No messages yet"}
                        </h4>


                        <p>
                            {searchQuery.trim()
                                ? "Try a different search term."
                                : "Start the conversation with your group members."}
                        </p>

                    </div>

                ) : (

                    <div className="group-chat__message-list">

                        {filteredMessages.map(
                            (
                                message,
                                index
                            ) => {

                                const isOwn =
                                    message?.senderId ===
                                    currentUserId;


                                const previousMessage =
                                    filteredMessages[
                                        index - 1
                                    ];


                                const previousSender =
                                    previousMessage?.senderId;


                                const showSender =
                                    !isOwn &&
                                    previousSender !==
                                        message?.senderId;


                                return (
                                    <div
                                        key={
                                            message?.id ||
                                            `message-${index}`
                                        }
                                        className={`group-chat__message-wrapper ${
                                            isOwn
                                                ? "is-own"
                                                : ""
                                        } ${
                                            showSender
                                                ? "show-sender"
                                                : ""
                                        }`}
                                    >

                                        {showSender && (
                                            <div className="group-chat__sender">

                                                <div className="group-chat__sender-avatar">

                                                    {message?.senderAvatar ? (
                                                        <img
                                                            src={
                                                                message.senderAvatar
                                                            }
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <Users
                                                            size={12}
                                                        />
                                                    )}

                                                </div>


                                                <span>
                                                    {
                                                        message?.senderName ||
                                                        "Member"
                                                    }
                                                </span>

                                            </div>
                                        )}


                                        <GroupMessage
                                            message={
                                                message
                                            }
                                            isOwn={
                                                isOwn
                                            }
                                            onReply={
                                                handleReply
                                            }
                                            onMore={
                                                handleMessageMore
                                            }
                                        />

                                    </div>
                                );
                            }
                        )}

                        <div
                            ref={
                                messagesEndRef
                            }
                        />

                    </div>
                )}

            </div>


            {/* =================================================
                INPUT
            ================================================= */}

            <div className="group-chat__input-area">

                <GroupMessageInput
                    onSend={
                        handleSend
                    }
                    replyMessage={
                        replyMessage
                    }
                    onCancelReply={() =>
                        setReplyMessage(null)
                    }
                />

            </div>

        </section>
    );
}


export default GroupChat;