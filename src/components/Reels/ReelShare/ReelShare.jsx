import "./ReelShare.css";

import {
    Link,
    Send,
    X,
    MessageCircle,
    Check,
    Copy,
    Users,
    Search,
    ArrowLeft,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";


function ReelShare({
    open = false,
    onClose,
    reel = null,
}) {

    // ======================================================
    // MAIN STATE
    // ======================================================

    const [copied, setCopied] = useState(false);

    const [shareError, setShareError] = useState("");

    const [sending, setSending] = useState(false);


    // ======================================================
    // FRIENDS STATE
    // ======================================================

    const [friendsOpen, setFriendsOpen] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");

    const [selectedFriends, setSelectedFriends] =
        useState([]);


    // ======================================================
    // CHAT STATE
    // ======================================================

    const [chatOpen, setChatOpen] =
        useState(false);

    const [selectedChat, setSelectedChat] =
        useState(null);


    // ======================================================
    // DEMO FRIENDS
    // ======================================================

    const friends = [
        {
            id: 1,
            username: "kinza",
            name: "Kinza",
            avatar: "K",
            online: true,
        },
        {
            id: 2,
            username: "mishael",
            name: "Mishael",
            avatar: "M",
            online: true,
        },
        {
            id: 3,
            username: "pihuu",
            name: "Pihuu",
            avatar: "P",
            online: false,
        },
        {
            id: 4,
            username: "amina",
            name: "Amina",
            avatar: "A",
            online: true,
        },
        {
            id: 5,
            username: "abdullah",
            name: "Abdullah",
            avatar: "A",
            online: false,
        },
    ];


    // ======================================================
    // DEMO CHATS
    // ======================================================

    const chats = [
        {
            id: 1,
            username: "kinza",
            name: "Kinza",
            avatar: "K",
            online: true,
            lastMessage: "Hey! How are you?",
        },
        {
            id: 2,
            username: "mishael",
            name: "Mishael",
            avatar: "M",
            online: true,
            lastMessage: "See you soon!",
        },
        {
            id: 3,
            username: "pihuu",
            name: "Pihuu",
            avatar: "P",
            online: false,
            lastMessage: "That reel was amazing 😂",
        },
        {
            id: 4,
            username: "amina",
            name: "Amina",
            avatar: "A",
            online: true,
            lastMessage: "Send me that video",
        },
        {
            id: 5,
            username: "abdullah",
            name: "Abdullah",
            avatar: "A",
            online: false,
            lastMessage: "Okay bro 👍",
        },
    ];


    // ======================================================
    // FILTER FRIENDS
    // ======================================================

    const filteredFriends =
        friends.filter((friend) => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();

            if (!search) {
                return true;
            }

            return (
                friend.name
                    .toLowerCase()
                    .includes(search) ||
                friend.username
                    .toLowerCase()
                    .includes(search)
            );

        });


    // ======================================================
    // FILTER CHATS
    // ======================================================

    const filteredChats =
        chats.filter((chat) => {

            const search =
                searchText
                    .trim()
                    .toLowerCase();

            if (!search) {
                return true;
            }

            return (
                chat.name
                    .toLowerCase()
                    .includes(search) ||
                chat.username
                    .toLowerCase()
                    .includes(search)
            );

        });


    // ======================================================
    // RESET STATE
    // ======================================================

    useEffect(() => {

        if (!open) {

            setCopied(false);

            setShareError("");

            setSending(false);

            setFriendsOpen(false);

            setChatOpen(false);

            setSearchText("");

            setSelectedFriends([]);

            setSelectedChat(null);

        }

    }, [open]);


    // ======================================================
    // ESCAPE KEY
    // ======================================================

    useEffect(() => {

        if (!open) {
            return;
        }


        const handleEscape = (event) => {

            if (event.key !== "Escape") {
                return;
            }


            // FRIENDS SCREEN
            if (friendsOpen) {

                setFriendsOpen(false);

                setSearchText("");

                setShareError("");

                return;
            }


            // CHAT SCREEN
            if (chatOpen) {

                setChatOpen(false);

                setSearchText("");

                setSelectedChat(null);

                setShareError("");

                return;
            }


            // MAIN SHARE SCREEN
            onClose?.();

        };


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

    }, [
        open,
        friendsOpen,
        chatOpen,
        onClose,
    ]);


    // ======================================================
    // COPY LINK
    // ======================================================

    const handleCopyLink = async () => {

        const reelUrl =
            reel?.id
                ? `${window.location.origin}/reels/${reel.id}`
                : window.location.href;


        try {

            if (
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    reelUrl
                );

            } else {

                const textarea =
                    document.createElement(
                        "textarea"
                    );

                textarea.value =
                    reelUrl;

                textarea.style.position =
                    "fixed";

                textarea.style.left =
                    "-9999px";

                textarea.style.top =
                    "0";

                document.body.appendChild(
                    textarea
                );

                textarea.focus();

                textarea.select();

                document.execCommand(
                    "copy"
                );

                textarea.remove();

            }


            setCopied(true);

            setShareError("");


            setTimeout(() => {

                setCopied(false);

            }, 2000);

        } catch (error) {

            console.error(
                "Copy link failed:",
                error
            );

            setCopied(false);

            setShareError(
                "Unable to copy the link."
            );

        }

    };


    // ======================================================
    // NATIVE SHARE
    // ======================================================

    const handleNativeShare = async () => {

        if (
            typeof navigator ===
                "undefined" ||
            !navigator.share
        ) {

            setShareError(
                "Native sharing is not available on this device."
            );

            return;
        }


        try {

            await navigator.share({

                title:
                    reel?.title ||
                    "DevChat Reel",

                text:
                    reel?.caption ||
                    "Check out this Reel on DevChat!",

                url:
                    reel?.id
                        ? `${window.location.origin}/reels/${reel.id}`
                        : window.location.href,

            });


            setShareError("");

        } catch (error) {

            if (
                error?.name ===
                "AbortError"
            ) {

                return;
            }


            console.error(
                "Native share failed:",
                error
            );

            setShareError(
                "Unable to share this Reel."
            );

        }

    };


    // ======================================================
    // OPEN CHAT
    // ======================================================

    const handleSendToChat = () => {

        setFriendsOpen(false);

        setChatOpen(true);

        setSearchText("");

        setSelectedChat(null);

        setShareError("");

    };


    // ======================================================
    // CLOSE CHAT
    // ======================================================

    const handleCloseChat = () => {

        setChatOpen(false);

        setSearchText("");

        setSelectedChat(null);

        setShareError("");

    };


    // ======================================================
    // SELECT CHAT
    // ======================================================

    const handleSelectChat = (chat) => {

        setSelectedChat(chat);

        setShareError("");

    };


    // ======================================================
    // SEND SELECTED CHAT
    // ======================================================

    const handleSendSelectedChat = () => {

        if (!selectedChat) {

            setShareError(
                "Select a chat first."
            );

            return;
        }


        setSending(true);

        setShareError("");


        setTimeout(() => {

            setSending(false);

            setShareError(
                `Reel sent to ${selectedChat.name}!`
            );


            setSelectedChat(null);


            setTimeout(() => {

                setChatOpen(false);

                setSearchText("");

            }, 1000);

        }, 900);

    };


    // ======================================================
    // OPEN FRIENDS
    // ======================================================

    const handleOpenFriends = () => {

        setChatOpen(false);

        setFriendsOpen(true);

        setSearchText("");

        setSelectedFriends([]);

        setShareError("");

    };


    // ======================================================
    // CLOSE FRIENDS
    // ======================================================

    const handleCloseFriends = () => {

        setFriendsOpen(false);

        setSearchText("");

        setSelectedFriends([]);

        setShareError("");

    };


    // ======================================================
    // TOGGLE FRIEND
    // ======================================================

    const handleToggleFriend = (friendId) => {

        setSelectedFriends(
            (previousSelected) => {

                if (
                    previousSelected.includes(
                        friendId
                    )
                ) {

                    return previousSelected.filter(
                        (id) =>
                            id !== friendId
                    );

                }


                return [
                    ...previousSelected,
                    friendId,
                ];

            }
        );

        setShareError("");

    };


    // ======================================================
    // SEND TO SELECTED FRIENDS
    // ======================================================

    const handleSendToFriends = () => {

        if (
            selectedFriends.length === 0
        ) {

            setShareError(
                "Select at least one friend."
            );

            return;

        }


        setSending(true);

        setShareError("");


        setTimeout(() => {

            setSending(false);

            setShareError(
                `Reel sent to ${selectedFriends.length} ${
                    selectedFriends.length === 1
                        ? "friend"
                        : "friends"
                }!`
            );


            setSelectedFriends([]);

        }, 900);

    };


    // ======================================================
    // DON'T RENDER
    // ======================================================

    if (!open) {

        return null;

    }


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div
            className="reel-share"
            onClick={onClose}
        >

            <div
                className="reel-share__modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >


                {/* ==================================================
                    CHAT SELECTOR
                ================================================== */}

                {chatOpen ? (

                    <>

                        {/* HEADER */}

                        <div className="reel-share__header">

                            <div className="reel-share__friends-heading">

                                <button
                                    className="reel-share__back"
                                    type="button"
                                    onClick={
                                        handleCloseChat
                                    }
                                    aria-label="Back"
                                >

                                    <ArrowLeft
                                        size={20}
                                    />

                                </button>


                                <div>

                                    <span className="reel-share__eyebrow">
                                        DevChat
                                    </span>

                                    <strong>
                                        Send to Chat
                                    </strong>

                                </div>

                            </div>


                            <button
                                className="reel-share__close"
                                type="button"
                                onClick={onClose}
                                aria-label="Close share"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* SEARCH */}

                        <div className="reel-share__search">

                            <Search size={18} />

                            <input
                                type="text"
                                value={searchText}
                                onChange={(event) =>
                                    setSearchText(
                                        event.target.value
                                    )
                                }
                                placeholder="Search chats..."
                                autoFocus
                            />

                        </div>


                        {/* CHAT LIST */}

                        <div className="reel-share__friends">

                            {filteredChats.length > 0 ? (

                                filteredChats.map(
                                    (chat) => {

                                        const isSelected =
                                            selectedChat?.id ===
                                            chat.id;


                                        return (

                                            <button
                                                key={chat.id}
                                                className={`reel-share__friend ${
                                                    isSelected
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectChat(
                                                        chat
                                                    )
                                                }
                                            >

                                                <div className="reel-share__friend-avatar">

                                                    {chat.avatar}

                                                    {chat.online && (

                                                        <span className="reel-share__online" />

                                                    )}

                                                </div>


                                                <div className="reel-share__friend-info">

                                                    <strong>
                                                        {chat.name}
                                                    </strong>

                                                    <span>
                                                        {chat.lastMessage}
                                                    </span>

                                                </div>


                                                <div className="reel-share__check">

                                                    {isSelected && (

                                                        <Check
                                                            size={17}
                                                        />

                                                    )}

                                                </div>

                                            </button>

                                        );

                                    }
                                )

                            ) : (

                                <div className="reel-share__empty">

                                    <MessageCircle
                                        size={34}
                                    />

                                    <strong>
                                        No chats found
                                    </strong>

                                    <span>
                                        Try another name or username.
                                    </span>

                                </div>

                            )}

                        </div>


                        {/* STATUS */}

                        {shareError && (

                            <div
                                className="reel-share__message"
                                role="status"
                            >
                                {shareError}
                            </div>

                        )}


                        {/* SEND BUTTON */}

                        <button
                            className="reel-share__send-button"
                            type="button"
                            disabled={
                                sending ||
                                !selectedChat
                            }
                            onClick={
                                handleSendSelectedChat
                            }
                        >

                            {sending ? (

                                "Sending..."

                            ) : (

                                <>
                                    <Send size={18} />

                                    {selectedChat
                                        ? `Send to ${selectedChat.name}`
                                        : "Select a chat"}
                                </>

                            )}

                        </button>

                    </>

                ) : friendsOpen ? (

                    /* ==================================================
                       FRIEND SELECTOR
                    ================================================== */

                    <>

                        <div className="reel-share__header">

                            <div className="reel-share__friends-heading">

                                <button
                                    className="reel-share__back"
                                    type="button"
                                    onClick={
                                        handleCloseFriends
                                    }
                                    aria-label="Back"
                                >

                                    <ArrowLeft
                                        size={20}
                                    />

                                </button>


                                <div>

                                    <span className="reel-share__eyebrow">
                                        DevChat
                                    </span>

                                    <strong>
                                        Share with Friends
                                    </strong>

                                </div>

                            </div>


                            <button
                                className="reel-share__close"
                                type="button"
                                onClick={onClose}
                                aria-label="Close share"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* SEARCH */}

                        <div className="reel-share__search">

                            <Search size={18} />

                            <input
                                type="text"
                                value={searchText}
                                onChange={(event) =>
                                    setSearchText(
                                        event.target.value
                                    )
                                }
                                placeholder="Search friends..."
                                autoFocus
                            />

                        </div>


                        {/* SELECTED COUNT */}

                        <div className="reel-share__selected-count">

                            <span>
                                {selectedFriends.length} selected
                            </span>


                            {selectedFriends.length > 0 && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedFriends([])
                                    }
                                >
                                    Clear
                                </button>

                            )}

                        </div>


                        {/* FRIEND LIST */}

                        <div className="reel-share__friends">

                            {filteredFriends.length > 0 ? (

                                filteredFriends.map(
                                    (friend) => {

                                        const isSelected =
                                            selectedFriends.includes(
                                                friend.id
                                            );


                                        return (

                                            <button
                                                key={friend.id}
                                                className={`reel-share__friend ${
                                                    isSelected
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                type="button"
                                                onClick={() =>
                                                    handleToggleFriend(
                                                        friend.id
                                                    )
                                                }
                                            >

                                                <div className="reel-share__friend-avatar">

                                                    {friend.avatar}

                                                    {friend.online && (

                                                        <span className="reel-share__online" />

                                                    )}

                                                </div>


                                                <div className="reel-share__friend-info">

                                                    <strong>
                                                        {friend.name}
                                                    </strong>

                                                    <span>
                                                        @{friend.username}
                                                    </span>

                                                </div>


                                                <div className="reel-share__check">

                                                    {isSelected && (

                                                        <Check
                                                            size={17}
                                                        />

                                                    )}

                                                </div>

                                            </button>

                                        );

                                    }
                                )

                            ) : (

                                <div className="reel-share__empty">

                                    <Users
                                        size={34}
                                    />

                                    <strong>
                                        No friends found
                                    </strong>

                                    <span>
                                        Try another name or username.
                                    </span>

                                </div>

                            )}

                        </div>


                        {/* SEND BUTTON */}

                        <button
                            className="reel-share__send-button"
                            type="button"
                            onClick={
                                handleSendToFriends
                            }
                            disabled={
                                sending ||
                                selectedFriends.length === 0
                            }
                        >

                            {sending ? (

                                "Sending..."

                            ) : (

                                <>
                                    <Send size={18} />

                                    Send Reel

                                    {selectedFriends.length > 0 &&
                                        ` (${selectedFriends.length})`}
                                </>

                            )}

                        </button>

                    </>

                ) : (

                    /* ==================================================
                       MAIN SHARE SCREEN
                    ================================================== */

                    <>

                        {/* HEADER */}

                        <div className="reel-share__header">

                            <div>

                                <span className="reel-share__eyebrow">
                                    DevChat
                                </span>

                                <strong>
                                    Share Reel
                                </strong>

                            </div>


                            <button
                                className="reel-share__close"
                                type="button"
                                onClick={onClose}
                                aria-label="Close share"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* REEL PREVIEW */}

                        <div className="reel-share__preview">

                            <div className="reel-share__preview-avatar">

                                {
                                    reel?.username
                                        ?.charAt(0)
                                        .toUpperCase() ||
                                    "D"
                                }

                            </div>


                            <div className="reel-share__preview-info">

                                <strong>

                                    @
                                    {
                                        reel?.username ||
                                        "devuser"
                                    }

                                </strong>


                                <span>

                                    {
                                        reel?.caption ||
                                        "Check out this Reel on DevChat!"
                                    }

                                </span>

                            </div>

                        </div>


                        {/* SHARE OPTIONS */}

                        <div className="reel-share__options">


                            {/* COPY LINK */}

                            <button
                                className="reel-share__option"
                                type="button"
                                onClick={
                                    handleCopyLink
                                }
                            >

                                <div className="reel-share__icon">

                                    {
                                        copied ? (

                                            <Check
                                                size={20}
                                            />

                                        ) : (

                                            <Link
                                                size={20}
                                            />

                                        )
                                    }

                                </div>


                                <div>

                                    <strong>

                                        {
                                            copied
                                                ? "Copied!"
                                                : "Copy Link"
                                        }

                                    </strong>


                                    <span>

                                        {
                                            copied
                                                ? "Reel link copied"
                                                : "Copy this Reel's link"
                                        }

                                    </span>

                                </div>

                            </button>


                            {/* NATIVE SHARE */}

                            {
                                typeof navigator !==
                                    "undefined" &&
                                navigator.share && (

                                    <button
                                        className="reel-share__option"
                                        type="button"
                                        onClick={
                                            handleNativeShare
                                        }
                                    >

                                        <div className="reel-share__icon">

                                            <Send
                                                size={20}
                                            />

                                        </div>


                                        <div>

                                            <strong>
                                                Share
                                            </strong>

                                            <span>
                                                Share using your device
                                            </span>

                                        </div>

                                    </button>

                                )
                            }


                            {/* SEND TO CHAT */}

                            <button
                                className="reel-share__option"
                                type="button"
                                onClick={
                                    handleSendToChat
                                }
                                disabled={sending}
                            >

                                <div className="reel-share__icon">

                                    <MessageCircle
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <strong>

                                        Send to Chat

                                    </strong>

                                    <span>
                                        Send this Reel to a friend
                                    </span>

                                </div>

                            </button>


                            {/* SHARE WITH FRIENDS */}

                            <button
                                className="reel-share__option"
                                type="button"
                                onClick={
                                    handleOpenFriends
                                }
                            >

                                <div className="reel-share__icon">

                                    <Users
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <strong>
                                        Share with Friends
                                    </strong>

                                    <span>
                                        Choose DevChat friends
                                    </span>

                                </div>

                            </button>


                            {/* COPY */}

                            <button
                                className="reel-share__option"
                                type="button"
                                onClick={
                                    handleCopyLink
                                }
                            >

                                <div className="reel-share__icon">

                                    <Copy
                                        size={20}
                                    />

                                </div>


                                <div>

                                    <strong>
                                        Copy
                                    </strong>

                                    <span>
                                        Copy Reel link
                                    </span>

                                </div>

                            </button>


                        </div>


                        {/* STATUS */}

                        {
                            shareError && (

                                <div
                                    className="reel-share__message"
                                    role="status"
                                >
                                    {shareError}
                                </div>

                            )
                        }

                    </>

                )}

            </div>

        </div>

    );

}


export default ReelShare;