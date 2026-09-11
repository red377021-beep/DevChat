import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Search,
    Pin,
    Mic,
    Image,
    Video,
    File,
    LoaderCircle,
    Users,
    MessageCircle,
    Bell,
    UserCircle,
    MoreVertical,
    Film,
    Camera,
    CirclePlay,
    Sparkles,
} from "lucide-react";

import { useChat } from "../../context/ChatContext";
import { useLayout } from "../../context/LayoutContext";

import Avatar from "../common/Avatar/Avatar";

import {
    userAPI,
    conversationAPI,
} from "../../utils/api";

import "./ChatList.css";


function ChatList() {

    // =====================================================
    // CHAT CONTEXT
    // =====================================================

    const {
        selectedChat,
        selectChat,
    } = useChat();


    // =====================================================
    // LAYOUT CONTEXT
    // Same navigation system used by Sidebar
    // =====================================================

    const {
        activeView,
        setActiveView,
    } = useLayout();


    // =====================================================
    // STATE
    // =====================================================

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        searchResults,
        setSearchResults,
    ] = useState([]);

    const [
        conversations,
        setConversations,
    ] = useState([]);

    const [
        loadingConversations,
        setLoadingConversations,
    ] = useState(true);

    const [
        searchLoading,
        setSearchLoading,
    ] = useState(false);

    const [
        searchError,
        setSearchError,
    ] = useState("");

    const [
        conversationsError,
        setConversationsError,
    ] = useState("");

    const [
        chatFilter,
        setChatFilter,
    ] = useState("all");

    const [
        mobileMoreOpen,
        setMobileMoreOpen,
    ] = useState(false);


    // =====================================================
    // MOBILE / SIDEBAR NAVIGATION
    // Uses the exact same activeView system as Sidebar
    // =====================================================

    const handleMobileNavigation = (view) => {

        setMobileMoreOpen(false);

        setActiveView(view);

    };


    // =====================================================
    // LOAD REAL CONVERSATIONS
    // =====================================================

    const loadConversations = async () => {

        try {

            setLoadingConversations(true);

            setConversationsError("");

            const data =
                await conversationAPI
                    .getMyConversations();

            setConversations(
                Array.isArray(
                    data?.conversations
                )
                    ? data.conversations
                    : []
            );

        } catch (error) {

            console.error(
                "Load conversations failed:",
                error
            );

            setConversations([]);

            setConversationsError(
                error.message ||
                "Failed to load conversations"
            );

        } finally {

            setLoadingConversations(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadConversations();

    }, []);


    // =====================================================
    // REAL USER SEARCH
    // =====================================================

    useEffect(() => {

        const keyword =
            search.trim();


        if (!keyword) {

            setSearchResults([]);
            setSearchError("");
            setSearchLoading(false);

            return;

        }


        if (keyword.length < 2) {

            setSearchResults([]);
            setSearchError("");
            setSearchLoading(false);

            return;

        }


        const timer =
            setTimeout(
                async () => {

                    try {

                        setSearchLoading(true);
                        setSearchError("");

                        const data =
                            await userAPI
                                .searchUsers(
                                    keyword
                                );

                        setSearchResults(
                            Array.isArray(
                                data?.users
                            )
                                ? data.users
                                : []
                        );

                    } catch (error) {

                        console.error(
                            "User search failed:",
                            error
                        );

                        setSearchResults([]);

                        setSearchError(
                            error.message ||
                            "Failed to search users"
                        );

                    } finally {

                        setSearchLoading(false);

                    }

                },
                350
            );


        return () => {

            clearTimeout(timer);

        };

    }, [search]);


    // =====================================================
    // FILTER REAL CONVERSATIONS
    // =====================================================

    const filteredConversations =
        useMemo(() => {

            const keyword =
                search
                    .trim()
                    .toLowerCase();


            let result =
                Array.isArray(conversations)
                    ? conversations
                    : [];


            if (chatFilter === "seen") {

                result =
                    result.filter(
                        (chat) =>
                            Number(
                                chat?.unread
                            ) <= 0
                    );

            }


            if (chatFilter === "unseen") {

                result =
                    result.filter(
                        (chat) =>
                            Number(
                                chat?.unread
                            ) > 0
                    );

            }


            if (chatFilter === "groups") {

                result =
                    result.filter(
                        (chat) => {

                            const type =
                                String(
                                    chat?.type ||
                                    ""
                                ).toLowerCase();

                            const conversationType =
                                String(
                                    chat?.conversation_type ||
                                    ""
                                ).toLowerCase();

                            const chatType =
                                String(
                                    chat?.chatType ||
                                    ""
                                ).toLowerCase();

                            return (
                                type === "group" ||
                                conversationType === "group" ||
                                chatType === "group"
                            );

                        }
                    );

            }


            if (!keyword) {

                return result;

            }


            return result.filter(
                (chat) => {

                    const name =
                        typeof chat?.name === "string"
                            ? chat.name.toLowerCase()
                            : "";

                    const username =
                        typeof chat?.username === "string"
                            ? chat.username.toLowerCase()
                            : "";

                    const lastMessage =
                        typeof chat?.lastMessage === "string"
                            ? chat.lastMessage.toLowerCase()
                            : "";

                    return (
                        name.includes(keyword) ||
                        username.includes(keyword) ||
                        lastMessage.includes(keyword)
                    );

                }
            );

        }, [
            conversations,
            search,
            chatFilter,
        ]);


    // =====================================================
    // FILTER COUNTS
    // =====================================================

    const allCount =
        conversations.length;

    const unseenCount =
        conversations.filter(
            (chat) =>
                Number(
                    chat?.unread
                ) > 0
        ).length;

    const seenCount =
        conversations.filter(
            (chat) =>
                Number(
                    chat?.unread
                ) <= 0
        ).length;

    const groupsCount =
        conversations.filter(
            (chat) => {

                const type =
                    String(
                        chat?.type ||
                        ""
                    ).toLowerCase();

                const conversationType =
                    String(
                        chat?.conversation_type ||
                        ""
                    ).toLowerCase();

                const chatType =
                    String(
                        chat?.chatType ||
                        ""
                    ).toLowerCase();

                return (
                    type === "group" ||
                    conversationType === "group" ||
                    chatType === "group"
                );

            }
        ).length;


    // =====================================================
    // MESSAGE ICON
    // =====================================================

    function getMessageIcon(type) {

        switch (type) {

            case "voice":

                return (
                    <Mic size={14} />
                );

            case "image":

                return (
                    <Image size={14} />
                );

            case "video":

                return (
                    <Video size={14} />
                );

            case "file":

                return (
                    <File size={14} />
                );

            default:

                return null;

        }

    }


    // =====================================================
    // SELECT CHAT
    // =====================================================

    function handleSelectChat(chat) {

        if (!chat) {
            return;
        }

        if (
            typeof selectChat ===
            "function"
        ) {

            selectChat(chat);

        }

    }


    // =====================================================
    // LEGACY / SECONDARY NAVIGATION
    // Used only for routes that do not currently have
    // Sidebar activeView functionality.
    // =====================================================

    function navigateTo(path) {

        setMobileMoreOpen(false);

        window.location.href = path;

    }


    // =====================================================
    // FRIENDS
    // Connected to Sidebar activeView
    // =====================================================

    function handleFindFriends() {

        handleMobileNavigation(
            "friends"
        );

    }


    // =====================================================
    // PROFILE
    // Connected to Sidebar activeView
    // =====================================================

    function handleProfile() {

        handleMobileNavigation(
            "profile"
        );

    }


    // =====================================================
    // NOTIFICATIONS
    // Connected to Sidebar activeView
    // =====================================================

    function handleNotifications() {

        handleMobileNavigation(
            "notifications"
        );

    }


    // =====================================================
    // APP NAVIGATION
    // Connected to Sidebar activeView
    // =====================================================

    function handleAppNavigation(view) {

        handleMobileNavigation(view);

    }


    // =====================================================
    // MORE MENU ACTIONS
    // =====================================================

    function handleMoreAction(action) {

        setMobileMoreOpen(false);


        switch (action) {

            case "new-chat":

                setSearch("");

                break;


            case "create-group":

                navigateTo(
                    "/groups/create"
                );

                break;


            case "archived":

                navigateTo(
                    "/chats/archived"
                );

                break;


            case "starred":

                navigateTo(
                    "/starred"
                );

                break;


            case "pinned":

                setChatFilter("all");

                break;


            case "settings":

                handleMobileNavigation(
                    "settings"
                );

                break;


            default:

                break;

        }

    }


    // =====================================================
    // CONVERT SEARCH USER → CHAT
    // =====================================================

    async function handleSelectUser(user) {

        if (!user) {
            return;
        }


        try {

            const response =
                await conversationAPI
                    .getOrCreate(
                        user.id
                    );

            const conversation =
                response?.conversation;


            const userChat = {

                id:
                    conversation?.id ||
                    user.id,

                conversationId:
                    conversation?.id ||
                    null,

                type:
                    "private",

                user: {

                    id:
                        user.id,

                    userId:
                        user.id,

                    username:
                        user.username ||
                        "",

                    name:
                        user.full_name ||
                        user.username ||
                        "Unknown User",

                    full_name:
                        user.full_name ||
                        user.username ||
                        "Unknown User",

                    email:
                        user.email ||
                        "",

                    avatar:
                        user.avatar_url ||
                        "",

                    avatar_url:
                        user.avatar_url ||
                        "",

                    online:
                        Boolean(
                            user.is_online
                        ),

                    is_online:
                        Boolean(
                            user.is_online
                        ),

                    status:
                        user.status ||
                        "Available on DevChat",

                },

                name:
                    user.full_name ||
                    user.username ||
                    "Unknown User",

                username:
                    user.username ||
                    "",

                email:
                    user.email ||
                    "",

                avatar:
                    user.avatar_url ||
                    "",

                avatar_url:
                    user.avatar_url ||
                    "",

                online:
                    Boolean(
                        user.is_online
                    ),

                is_online:
                    Boolean(
                        user.is_online
                    ),

                lastMessage:
                    "",

                lastMessageType:
                    null,

                time:
                    "",

                typing:
                    false,

                pinned:
                    false,

                unread:
                    0,

            };


            setConversations(
                (previous) => {

                    const exists =
                        previous.some(
                            (chat) =>
                                chat.id ===
                                userChat.id
                        );

                    if (exists) {

                        return previous;

                    }

                    return [
                        userChat,
                        ...previous,
                    ];

                }
            );


            handleSelectChat(
                userChat
            );


            setSearch("");

        } catch (error) {

            console.error(
                "Open searched user chat failed:",
                error
            );

            setSearchError(
                error.message ||
                "Failed to open chat"
            );

        }

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <aside className="chat-list">


            {/* ================================================= */}
            {/* DESKTOP HEADER */}
            {/* ================================================= */}

            <div className="chat-list-header desktop-chat-header">

                <div className="chat-list-title">

                    <span>
                        Messages
                    </span>

                    <h2>
                        Chats
                    </h2>

                </div>

            </div>


            {/* ================================================= */}
            {/* MOBILE TOP BAR */}
            {/* ================================================= */}

            <div className="mobile-chat-topbar">


                {/* PROFILE */}

                <button
                    type="button"
                    className="mobile-topbar-button"
                    onClick={handleProfile}
                    aria-label="Profile"
                    title="Profile"
                >

                    <UserCircle
                        size={21}
                    />

                </button>


                {/* SEARCH */}

                <button
                    type="button"
                    className="mobile-topbar-button"
                    onClick={() => {

                        const input =
                            document.querySelector(
                                ".chat-search input"
                            );

                        input?.focus();

                    }}
                    aria-label="Search chats"
                    title="Search chats"
                >

                    <Search
                        size={20}
                    />

                </button>


                {/* CHATS */}

                <button
                    type="button"
                    className="mobile-topbar-title"
                    onClick={() =>
                        handleAppNavigation(
                            "chats"
                        )
                    }
                >

                    <MessageCircle
                        size={17}
                    />

                    <span>
                        Chats
                    </span>

                </button>


                {/* NOTIFICATIONS */}

                <button
                    type="button"
                    className="mobile-topbar-button"
                    onClick={handleNotifications}
                    aria-label="Notifications"
                    title="Notifications"
                >

                    <Bell
                        size={20}
                    />

                </button>


                {/* FRIENDS */}

                <button
                    type="button"
                    className="mobile-topbar-button"
                    onClick={handleFindFriends}
                    aria-label="Friends"
                    title="Friends"
                >

                    <Users
                        size={20}
                    />

                </button>


                {/* MORE */}

                <button
                    type="button"
                    className={`mobile-topbar-button ${
                        mobileMoreOpen
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setMobileMoreOpen(
                            (value) => !value
                        )
                    }
                    aria-label="More chat options"
                    title="More"
                >

                    <MoreVertical
                        size={21}
                    />

                </button>


                {/* MORE MENU */}

                {mobileMoreOpen && (

                    <div className="mobile-more-menu">


                        <button
                            type="button"
                            onClick={() =>
                                handleMoreAction(
                                    "new-chat"
                                )
                            }
                        >

                            <MessageCircle
                                size={17}
                            />

                            <span>
                                New Chat
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleMoreAction(
                                    "create-group"
                                )
                            }
                        >

                            <Users
                                size={17}
                            />

                            <span>
                                Create Group
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleMoreAction(
                                    "archived"
                                )
                            }
                        >

                            <File
                                size={17}
                            />

                            <span>
                                Archived Chats
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleMoreAction(
                                    "starred"
                                )
                            }
                        >

                            <Pin
                                size={17}
                            />

                            <span>
                                Starred Messages
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                handleMoreAction(
                                    "settings"
                                )
                            }
                        >

                            <span className="more-menu-dot">
                                ⚙
                            </span>

                            <span>
                                Chat Settings
                            </span>

                        </button>

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* MOBILE APP NAVIGATION */}
            {/* ================================================= */}

            <div className="mobile-app-navigation">


                {/* CHATS */}

                <button
                    type="button"
                    className={`mobile-app-nav-item ${
                        activeView === "chats"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleAppNavigation(
                            "chats"
                        )
                    }
                >

                    <MessageCircle
                        size={17}
                    />

                    <span>
                        Chats
                    </span>

                </button>


                {/* REELS */}

                <button
                    type="button"
                    className={`mobile-app-nav-item ${
                        activeView === "reels"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleAppNavigation(
                            "reels"
                        )
                    }
                >

                    <Film
                        size={17}
                    />

                    <span>
                        Reels
                    </span>

                </button>


                {/* CAMERA */}

                <button
                    type="button"
                    className={`mobile-app-nav-item ${
                        activeView === "camera"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleAppNavigation(
                            "camera"
                        )
                    }
                >

                    <Camera
                        size={17}
                    />

                    <span>
                        Camera
                    </span>

                </button>


                {/* STORIES */}

                <button
                    type="button"
                    className={`mobile-app-nav-item ${
                        activeView === "stories"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleAppNavigation(
                            "stories"
                        )
                    }
                >

                    <CirclePlay
                        size={17}
                    />

                    <span>
                        Stories
                    </span>

                </button>


                {/* AI */}

                <button
                    type="button"
                    className={`mobile-app-nav-item ${
                        activeView === "ai"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleAppNavigation(
                            "ai"
                        )
                    }
                >

                    <Sparkles
                        size={17}
                    />

                    <span>
                        AI
                    </span>

                </button>

            </div>


            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <div className="chat-search">

                <Search
                    size={18}
                    className="chat-search-icon"
                />


                <input
                    type="text"
                    value={search}
                    placeholder="Search chats..."
                    aria-label="Search chats"
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />


                {searchLoading && (

                    <LoaderCircle
                        size={17}
                        className="chat-search-loader"
                    />

                )}

            </div>


            {/* ================================================= */}
            {/* CHAT FILTER TABS */}
            {/* ================================================= */}

            {!search.trim() && (

                <div
                    className="chat-filter-tabs"
                    role="tablist"
                    aria-label="Chat filters"
                >

                    <button
                        type="button"
                        className={
                            chatFilter === "all"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setChatFilter("all")
                        }
                    >

                        <MessageCircle
                            size={15}
                        />

                        <span>
                            All
                        </span>

                        <small>
                            {allCount}
                        </small>

                    </button>


                    <button
                        type="button"
                        className={
                            chatFilter === "seen"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setChatFilter("seen")
                        }
                    >

                        <span className="filter-dot seen-dot">
                            ●
                        </span>

                        <span>
                            Seen
                        </span>

                        <small>
                            {seenCount}
                        </small>

                    </button>


                    <button
                        type="button"
                        className={
                            chatFilter === "unseen"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setChatFilter("unseen")
                        }
                    >

                        <span className="filter-dot unseen-dot">
                            ●
                        </span>

                        <span>
                            Unseen
                        </span>

                        <small>
                            {unseenCount}
                        </small>

                    </button>


                    <button
                        type="button"
                        className={
                            chatFilter === "groups"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setChatFilter("groups")
                        }
                    >

                        <Users
                            size={15}
                        />

                        <span>
                            Groups
                        </span>

                        <small>
                            {groupsCount}
                        </small>

                    </button>

                </div>

            )}


            {/* ================================================= */}
            {/* BODY */}
            {/* ================================================= */}

            <div className="chat-list-body">


                {/* ================================================= */}
                {/* USER SEARCH */}
                {/* ================================================= */}

                {search.trim().length >= 2 ? (

                    <>

                        {searchError ? (

                            <div className="chat-empty">

                                <div className="chat-empty-icon">

                                    <Search
                                        size={24}
                                    />

                                </div>

                                <h3>
                                    Search failed
                                </h3>

                                <p>
                                    {searchError}
                                </p>

                            </div>

                        ) : searchLoading ? (

                            <div className="chat-empty">

                                <div className="chat-empty-icon">

                                    <LoaderCircle
                                        size={24}
                                    />

                                </div>

                                <h3>
                                    Searching...
                                </h3>

                                <p>
                                    Finding DevChat users.
                                </p>

                            </div>

                        ) : searchResults.length > 0 ? (

                            searchResults.map(
                                (user) => {

                                    const isActive =
                                        selectedChat?.user?.id ===
                                            user.id ||
                                        selectedChat?.id ===
                                            user.id;


                                    return (

                                        <button
                                            key={user.id}
                                            type="button"
                                            className={`chat-card ${
                                                isActive
                                                    ? "active-chat"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleSelectUser(
                                                    user
                                                )
                                            }
                                        >

                                            <Avatar
                                                name={
                                                    user.full_name ||
                                                    user.username
                                                }
                                                image={
                                                    user.avatar_url
                                                }
                                                online={
                                                    user.is_online
                                                }
                                                size="md"
                                            />


                                            <div className="chat-info">

                                                <div className="chat-top">

                                                    <h4>
                                                        {
                                                            user.full_name ||
                                                            user.username ||
                                                            "Unknown User"
                                                        }
                                                    </h4>

                                                    <span>
                                                        @
                                                        {
                                                            user.username
                                                        }
                                                    </span>

                                                </div>


                                                <div className="chat-bottom">

                                                    <div className="chat-last-message">

                                                        <span>
                                                            {
                                                                user.status ||
                                                                "Available on DevChat"
                                                            }
                                                        </span>

                                                    </div>


                                                    <div className="chat-right">

                                                        {user.is_online && (

                                                            <span className="chat-unread">
                                                                •
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </button>

                                    );

                                }
                            )

                        ) : (

                            <div className="chat-empty">

                                <div className="chat-empty-icon">

                                    <Search
                                        size={24}
                                    />

                                </div>

                                <h3>
                                    No users found
                                </h3>

                                <p>
                                    Try another username or name.
                                </p>

                            </div>

                        )}

                    </>

                ) : (


                    /* ================================================= */
                    /* REAL CONVERSATIONS */
                    /* ================================================= */

                    loadingConversations ? (

                        <div className="chat-empty">

                            <div className="chat-empty-icon">

                                <LoaderCircle
                                    size={24}
                                    className="spin"
                                />

                            </div>

                            <h3>
                                Loading chats...
                            </h3>

                            <p>
                                Loading your conversations.
                            </p>

                        </div>

                    ) : conversationsError ? (

                        <div className="chat-empty">

                            <div className="chat-empty-icon">

                                <Search
                                    size={24}
                                />

                            </div>

                            <h3>
                                Couldn't load chats
                            </h3>

                            <p>
                                {conversationsError}
                            </p>

                        </div>

                    ) : filteredConversations.length === 0 ? (

                        <div className="chat-empty chat-empty-friends">

                            <div className="chat-empty-icon">

                                <Users
                                    size={28}
                                />

                            </div>


                            <h3>

                                {chatFilter === "groups"
                                    ? "No groups yet"
                                    : chatFilter === "unseen"
                                        ? "All caught up"
                                        : chatFilter === "seen"
                                            ? "No seen chats"
                                            : "Find your friends"
                                }

                            </h3>


                            <p>

                                {chatFilter === "groups"
                                    ? "Create or join a group to start chatting with more people."
                                    : chatFilter === "unseen"
                                        ? "You don't have any unread conversations."
                                        : chatFilter === "seen"
                                            ? "Chats you've already seen will appear here."
                                            : "Connect with people on DevChat and start your first conversation."
                                }

                            </p>


                            {(
                                chatFilter === "all" ||
                                chatFilter === "groups"
                            ) && (

                                <button
                                    type="button"
                                    className="find-friends-button"
                                    onClick={
                                        handleFindFriends
                                    }
                                >

                                    <Search
                                        size={17}
                                    />

                                    <span>
                                        Find friends
                                    </span>

                                </button>

                            )}

                        </div>

                    ) : (

                        filteredConversations.map(
                            (chat) => {

                                const isActive =
                                    selectedChat?.id ===
                                    chat?.id;

                                const unread =
                                    Number(
                                        chat?.unread
                                    ) || 0;


                                return (

                                    <button
                                        key={chat.id}
                                        type="button"
                                        className={`chat-card ${
                                            isActive
                                                ? "active-chat"
                                                : ""
                                        } ${
                                            unread > 0
                                                ? "unread-chat"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSelectChat(
                                                chat
                                            )
                                        }
                                    >

                                        <Avatar
                                            name={
                                                chat.name
                                            }
                                            image={
                                                chat.avatar
                                            }
                                            online={
                                                chat.online
                                            }
                                            size="md"
                                        />


                                        <div className="chat-info">

                                            <div className="chat-top">

                                                <h4>
                                                    {
                                                        chat.name
                                                    }
                                                </h4>

                                                <span>
                                                    {
                                                        chat.time
                                                    }
                                                </span>

                                            </div>


                                            <div className="chat-bottom">

                                                <div className="chat-last-message">

                                                    {chat.lastMessageType &&
                                                        getMessageIcon(
                                                            chat.lastMessageType
                                                        )
                                                    }

                                                    <span>

                                                        {chat.typing
                                                            ? "Typing..."
                                                            : chat.lastMessage ||
                                                              "No messages"
                                                        }

                                                    </span>

                                                </div>


                                                <div className="chat-right">

                                                    {chat.pinned && (

                                                        <Pin
                                                            size={14}
                                                            className="chat-pin"
                                                        />

                                                    )}


                                                    {unread > 0 && (

                                                        <span className="chat-unread">

                                                            {
                                                                unread
                                                            }

                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </button>

                                );

                            }
                        )

                    )

                )}

            </div>

        </aside>

    );

}


export default ChatList;
