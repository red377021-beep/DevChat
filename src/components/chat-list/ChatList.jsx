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
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

import Avatar from "../common/Avatar/Avatar";

import chats from "../../data/chats";

import {
    userAPI,
    conversationAPI,
} from "../../utils/api";

import "./ChatList.css";


function ChatList() {

    const {
        selectedChat,
        selectChat,
    } = useChat();


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


    // =====================================================
    // LOAD REAL CONVERSATIONS
    // =====================================================

    const loadConversations =
        async () => {

            try {

                setLoadingConversations(
                    true
                );

                setConversationsError(
                    ""
                );


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

                setLoadingConversations(
                    false
                );

            }

        };


    // =====================================================
    // INITIAL CONVERSATIONS LOAD
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

                        setSearchLoading(
                            true
                        );

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

                        setSearchLoading(
                            false
                        );

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


            if (!keyword) {

                return conversations;

            }


            return conversations.filter(
                (chat) => {

                    const name =
                        typeof chat?.name ===
                        "string"
                            ? chat.name
                                .toLowerCase()
                            : "";


                    const username =
                        typeof chat?.username ===
                        "string"
                            ? chat.username
                                .toLowerCase()
                            : "";


                    const lastMessage =
                        typeof chat?.lastMessage ===
                        "string"
                            ? chat.lastMessage
                                .toLowerCase()
                            : "";


                    return (

                        name.includes(
                            keyword
                        ) ||

                        username.includes(
                            keyword
                        ) ||

                        lastMessage.includes(
                            keyword
                        )

                    );

                }
            );

        }, [
            conversations,
            search,
        ]);


    // =====================================================
    // LAST MESSAGE ICON
    // =====================================================

    function getMessageIcon(
        type
    ) {

        switch (type) {

            case "voice":

                return (
                    <Mic
                        size={14}
                    />
                );


            case "image":

                return (
                    <Image
                        size={14}
                    />
                );


            case "video":

                return (
                    <Video
                        size={14}
                    />
                );


            case "file":

                return (
                    <File
                        size={14}
                    />
                );


            default:

                return null;

        }

    }


    // =====================================================
    // SELECT CHAT SAFELY
    // =====================================================

    function handleSelectChat(
        chat
    ) {

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
    // CONVERT SEARCH USER → CHAT
    // =====================================================

    async function handleSelectUser(
        user
    ) {

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


            // Add conversation locally
            // so it immediately appears
            // in ChatList.

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
            {/* HEADER */}
            {/* ================================================= */}

            <div className="chat-list-header">

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
                    onChange={(
                        event
                    ) => {

                        setSearch(
                            event.target.value
                        );

                    }}
                />


                {searchLoading && (

                    <LoaderCircle
                        size={17}
                        className="chat-search-loader"
                    />

                )}

            </div>


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

                        ) : searchResults.length >
                          0 ? (

                            searchResults.map(
                                (user) => {

                                    const isActive =
                                        selectedChat?.user?.id ===
                                            user.id ||
                                        selectedChat?.id ===
                                            user.id;


                                    return (

                                        <button
                                            key={
                                                user.id
                                            }
                                            type="button"
                                            className={`
                                                chat-card
                                                ${
                                                    isActive
                                                        ? "active-chat"
                                                        : ""
                                                }
                                            `}
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

                    ) : filteredConversations.length ===
                      0 ? (

                        <div className="chat-empty">

                            <div className="chat-empty-icon">

                                <Search
                                    size={24}
                                />

                            </div>

                            <h3>
                                No chats yet
                            </h3>

                            <p>
                                Add a friend and start chatting.
                            </p>

                        </div>

                    ) : (

                        filteredConversations.map(
                            (chat) => {

                                const isActive =
                                    selectedChat?.id ===
                                    chat?.id;


                                return (

                                    <button
                                        key={
                                            chat.id
                                        }
                                        type="button"
                                        className={`
                                            chat-card
                                            ${
                                                isActive
                                                    ? "active-chat"
                                                    : ""
                                            }
                                        `}
                                        onClick={() =>
                                            handleSelectChat(
                                                chat
                                            )
                                        }
                                    >

                                        {/* ================================= */}
                                        {/* AVATAR */}
                                        {/* ================================= */}

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


                                        {/* ================================= */}
                                        {/* CHAT INFORMATION */}
                                        {/* ================================= */}

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


                                                    {Number(
                                                        chat.unread
                                                    ) > 0 && (

                                                        <span className="chat-unread">

                                                            {
                                                                chat.unread
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