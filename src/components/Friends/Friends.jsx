import {
    useEffect,
    useState,
} from "react";

import {
    Search,
    UserPlus,
    Users,
    UserCheck,
    Clock,
    UserX,
    LoaderCircle,
    MessageCircle,
} from "lucide-react";

import Avatar from "../common/Avatar/Avatar";

import FriendCard from "./FriendCard";

import {
    userAPI,
    apiRequest,
    friendAPI,
    conversationAPI,
} from "../../utils/api";

import { useAuth } from "../../context/AuthContext";

import { useChat } from "../../context/ChatContext";

import "./Friends.css";


function Friends() {

    // =====================================================
    // AUTH
    // =====================================================

    const {
        user,
    } = useAuth();


    // =====================================================
    // CHAT CONTEXT
    // =====================================================

    const {
        selectChat,
    } = useChat();


    // =====================================================
    // STATE
    // =====================================================

    const [
        activeTab,
        setActiveTab,
    ] = useState("friends");


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        searchResults,
        setSearchResults,
    ] = useState([]);


    const [
        requests,
        setRequests,
    ] = useState([]);


    const [
        friends,
        setFriends,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        searchLoading,
        setSearchLoading,
    ] = useState(false);


    const [
        actionLoading,
        setActionLoading,
    ] = useState(null);


    const [
        chatLoading,
        setChatLoading,
    ] = useState(null);


    const [
        error,
        setError,
    ] = useState("");


    // =====================================================
    // LOAD FRIENDS
    // =====================================================

    const loadFriends = async () => {

        try {

            const response =
                await friendAPI.getFriends();


            setFriends(
                response.friends || []
            );

        } catch (error) {

            console.error(
                "Load friends error:",
                error
            );

            setError(
                error.message ||
                "Failed to load friends"
            );

        }

    };


    // =====================================================
    // LOAD REQUESTS
    // =====================================================

    const loadRequests = async () => {

        try {

            const response =
                await friendAPI.getRequests();


            setRequests(
                response.requests || []
            );

        } catch (error) {

            console.error(
                "Load friend requests error:",
                error
            );

            setError(
                error.message ||
                "Failed to load requests"
            );

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            setError("");


            await Promise.all([

                loadFriends(),

                loadRequests(),

            ]);


            setLoading(false);

        };


        loadData();

    }, []);


    // =====================================================
    // SEARCH USERS
    // =====================================================

    useEffect(() => {

        const query =
            search.trim();


        if (!query) {

            setSearchResults([]);

            setSearchLoading(false);

            return;

        }


        let cancelled = false;


        const timer =
            setTimeout(
                async () => {

                    try {

                        setSearchLoading(true);

                        setError("");


                        const response =
                            await userAPI.searchUsers(
                                query
                            );


                        if (
                            cancelled
                        ) {
                            return;
                        }


                        const results =
                            response.users ||
                            [];


                        const enrichedResults =
                            results.map(
                                (foundUser) => {

                                    const outgoing =
                                        requests.find(
                                            (request) =>
                                                request.sender_id === user?.id &&
                                                request.receiver_id === foundUser.id &&
                                                request.status === "pending"
                                        );


                                    const incoming =
                                        requests.find(
                                            (request) =>
                                                request.receiver_id === user?.id &&
                                                request.sender_id === foundUser.id &&
                                                request.status === "pending"
                                        );


                                    const alreadyFriend =
                                        friends.some(
                                            (friend) =>
                                                friend.id ===
                                                foundUser.id
                                        );


                                    return {

                                        ...foundUser,

                                        friendRequestStatus:
                                            alreadyFriend
                                                ? "accepted"
                                                : outgoing
                                                    ? "pending"
                                                    : incoming
                                                        ? "incoming"
                                                        : null,

                                        alreadyFriend,

                                    };

                                }
                            );


                        setSearchResults(
                            enrichedResults
                        );

                    } catch (error) {

                        if (
                            cancelled
                        ) {
                            return;
                        }


                        console.error(
                            "Search users error:",
                            error
                        );


                        setSearchResults([]);

                        setError(
                            error.message ||
                            "Failed to search users"
                        );

                    } finally {

                        if (
                            !cancelled
                        ) {

                            setSearchLoading(
                                false
                            );

                        }

                    }

                },
                350
            );


        return () => {

            cancelled = true;

            clearTimeout(timer);

        };

    }, [
        search,
        requests,
        friends,
        user?.id,
    ]);


    // =====================================================
    // SEND FRIEND REQUEST
    // =====================================================

    const handleAddFriend =
        async (targetUser) => {

            if (!targetUser?.id) {
                return;
            }


            try {

                setActionLoading(
                    targetUser.id
                );


                setError("");


                await friendAPI.sendRequest(
                    targetUser.id
                );


                setSearchResults(
                    (previous) =>
                        previous.map(
                            (item) =>
                                item.id ===
                                targetUser.id
                                    ? {
                                        ...item,
                                        friendRequestStatus:
                                            "pending",
                                    }
                                    : item
                        )
                );


                await loadRequests();

            } catch (error) {

                console.error(
                    "Send friend request error:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to send friend request"
                );

            } finally {

                setActionLoading(
                    null
                );

            }

        };


    // =====================================================
    // ACCEPT REQUEST
    // =====================================================

    const handleAccept =
        async (request) => {

            if (!request?.id) {
                return;
            }


            try {

                setActionLoading(
                    request.id
                );


                setError("");


                await friendAPI.acceptRequest(
                    request.id
                );


                await Promise.all([

                    loadRequests(),

                    loadFriends(),

                ]);


                setActiveTab(
                    "friends"
                );

            } catch (error) {

                console.error(
                    "Accept friend request error:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to accept request"
                );

            } finally {

                setActionLoading(
                    null
                );

            }

        };


    // =====================================================
    // REJECT REQUEST
    // =====================================================

    const handleReject =
        async (request) => {

            if (!request?.id) {
                return;
            }


            try {

                setActionLoading(
                    request.id
                );


                setError("");


                await friendAPI.rejectRequest(
                    request.id
                );


                await loadRequests();

            } catch (error) {

                console.error(
                    "Reject friend request error:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to reject request"
                );

            } finally {

                setActionLoading(
                    null
                );

            }

        };


    // =====================================================
    // OPEN CHAT
    // =====================================================

    const handleOpenChat =
        async (friend) => {

            if (!friend?.id) {
                return;
            }


            try {

                setChatLoading(
                    friend.id
                );


                setError("");


                // =========================================
                // CREATE / GET CONVERSATION
                // =========================================

                const response =
                    await conversationAPI.getOrCreate(
                        friend.id
                    );


                const conversation =
                    response.conversation;


                if (!conversation?.id) {

                    throw new Error(
                        "Conversation could not be opened"
                    );

                }


                // =========================================
                // BUILD CHAT OBJECT
                // =========================================

                const chatUser = {

                    id:
                        friend.id,

                    userId:
                        friend.id,

                    username:
                        friend.username ||
                        "",

                    name:
                        friend.full_name ||
                        friend.username ||
                        "Unknown User",

                    full_name:
                        friend.full_name ||
                        friend.username ||
                        "Unknown User",

                    avatar:
                        friend.avatar_url ||
                        "",

                    avatar_url:
                        friend.avatar_url ||
                        "",

                    status:
                        friend.status ||
                        "Available on DevChat",

                    is_online:
                        Boolean(
                            friend.is_online
                        ),

                };


                const chat = {

                    id:
                        conversation.id,

                    conversationId:
                        conversation.id,

                    type:
                        "private",

                    user:
                        chatUser,

                    friend:
                        chatUser,

                    name:
                        chatUser.name,

                    username:
                        chatUser.username,

                    avatar:
                        chatUser.avatar,

                    avatar_url:
                        chatUser.avatar_url,

                    is_online:
                        chatUser.is_online,

                };


                // =========================================
                // OPEN CHAT
                // =========================================

                selectChat(chat);


            } catch (error) {

                console.error(
                    "Open chat error:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to open chat"
                );

            } finally {

                setChatLoading(
                    null
                );

            }

        };


    // =====================================================
    // REQUEST FILTERS
    // =====================================================

    const incomingRequests =
        requests.filter(
            (request) =>
                request.receiver_id ===
                    user?.id &&
                request.status ===
                    "pending"
        );


    const outgoingRequests =
        requests.filter(
            (request) =>
                request.sender_id ===
                    user?.id &&
                request.status ===
                    "pending"
        );


    // =====================================================
    // REQUEST USER
    // =====================================================

    const getRequestUser =
        (request) => {

            if (
                request.receiver_id ===
                user?.id
            ) {

                return request.sender;

            }


            return request.receiver;

        };


    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading) {

        return (

            <main className="friends-page">

                <div className="friends-loading">

                    <LoaderCircle
                        size={28}
                        className="spin"
                    />

                    <span>
                        Loading friends...
                    </span>

                </div>

            </main>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <main className="friends-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="friends-header">

                <div>

                    <span className="friends-eyebrow">
                        DEVCHAT NETWORK
                    </span>

                    <h1>
                        Friends
                    </h1>

                    <p>
                        Find people and connect
                        with your friends.
                    </p>

                </div>


                <div className="friends-header-icon">

                    <Users
                        size={25}
                    />

                </div>

            </header>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="friends-search">

                <Search
                    size={19}
                />

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder="Search users by name or username..."
                />


                {searchLoading && (

                    <LoaderCircle
                        size={18}
                        className="spin"
                    />

                )}

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="friends-error">

                    {error}

                </div>

            )}


            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {search.trim() && (

                <section className="friends-section">

                    <div className="friends-section-title">

                        <div>

                            <span>
                                SEARCH RESULTS
                            </span>

                            <h2>
                                People
                            </h2>

                        </div>

                    </div>


                    {searchLoading ? (

                        <div className="friends-loading small">

                            <LoaderCircle
                                size={22}
                                className="spin"
                            />

                            <span>
                                Searching...
                            </span>

                        </div>

                    ) : searchResults.length === 0 ? (

                        <div className="friends-empty">

                            <Search
                                size={30}
                            />

                            <h3>
                                No users found
                            </h3>

                            <p>
                                Try another
                                username or name.
                            </p>

                        </div>

                    ) : (

                        <div className="friends-grid">

                            {searchResults.map(
                                (foundUser) => (

                                    <div
                                        className="friend-card"
                                        key={
                                            foundUser.id
                                        }
                                    >

                                        <div className="friend-card-avatar">

                                            <Avatar
                                                name={
                                                    foundUser.full_name ||
                                                    foundUser.username ||
                                                    "User"
                                                }
                                                image={
                                                    foundUser.avatar_url ||
                                                    ""
                                                }
                                                online={
                                                    Boolean(
                                                        foundUser.is_online
                                                    )
                                                }
                                                size="md"
                                            />

                                        </div>


                                        <div className="friend-details">

                                            <h3>
                                                {
                                                    foundUser.full_name ||
                                                    foundUser.username
                                                }
                                            </h3>

                                            <span className="friend-username">

                                                @
                                                {
                                                    foundUser.username
                                                }

                                            </span>

                                            <p>
                                                {
                                                    foundUser.status ||
                                                    "Available on DevChat"
                                                }
                                            </p>

                                        </div>


                                        <div className="friend-card-actions">

                                            {foundUser.alreadyFriend ? (

                                                <button
                                                    type="button"
                                                    className="friend-action pending"
                                                    disabled
                                                >

                                                    <UserCheck
                                                        size={16}
                                                    />

                                                    Friends

                                                </button>

                                            ) : foundUser.friendRequestStatus === "pending" ? (

                                                <button
                                                    type="button"
                                                    className="friend-action pending"
                                                    disabled
                                                >

                                                    <Clock
                                                        size={16}
                                                    />

                                                    Sent

                                                </button>

                                            ) : foundUser.friendRequestStatus === "incoming" ? (

                                                <button
                                                    type="button"
                                                    className="friend-action accept"
                                                    onClick={() =>
                                                        setActiveTab(
                                                            "requests"
                                                        )
                                                    }
                                                >

                                                    <UserCheck
                                                        size={16}
                                                    />

                                                    Request

                                                </button>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="friend-action"
                                                    disabled={
                                                        actionLoading ===
                                                        foundUser.id
                                                    }
                                                    onClick={() =>
                                                        handleAddFriend(
                                                            foundUser
                                                        )
                                                    }
                                                >

                                                    {actionLoading ===
                                                    foundUser.id ? (

                                                        <LoaderCircle
                                                            size={16}
                                                            className="spin"
                                                        />

                                                    ) : (

                                                        <UserPlus
                                                            size={16}
                                                        />

                                                    )}

                                                    Add Friend

                                                </button>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            )}


            {/* =================================================
                TABS
            ================================================= */}

            {!search.trim() && (

                <div className="friends-tabs">

                    <button
                        type="button"
                        className={
                            activeTab === "friends"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab(
                                "friends"
                            )
                        }
                    >

                        <Users
                            size={17}
                        />

                        Friends

                        <span>
                            {friends.length}
                        </span>

                    </button>


                    <button
                        type="button"
                        className={
                            activeTab === "requests"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab(
                                "requests"
                            )
                        }
                    >

                        <UserCheck
                            size={17}
                        />

                        Requests

                        {incomingRequests.length >
                            0 && (

                            <span>
                                {
                                    incomingRequests.length
                                }
                            </span>

                        )}

                    </button>


                    <button
                        type="button"
                        className={
                            activeTab === "sent"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab(
                                "sent"
                            )
                        }
                    >

                        <Clock
                            size={17}
                        />

                        Sent

                        {outgoingRequests.length >
                            0 && (

                            <span>
                                {
                                    outgoingRequests.length
                                }
                            </span>

                        )}

                    </button>

                </div>

            )}


            {/* =================================================
                FRIENDS
            ================================================= */}

            {!search.trim() &&
                activeTab === "friends" && (

                    <section className="friends-section">

                        <div className="friends-section-title">

                            <div>

                                <span>
                                    YOUR CONNECTIONS
                                </span>

                                <h2>
                                    My Friends
                                </h2>

                            </div>

                        </div>


                        {friends.length === 0 ? (

                            <div className="friends-empty">

                                <Users
                                    size={34}
                                />

                                <h3>
                                    No friends yet
                                </h3>

                                <p>
                                    Search for people
                                    above and send
                                    them a friend
                                    request.
                                </p>

                            </div>

                        ) : (

                            <div className="friends-grid">

                                {friends.map(
                                    (friend) => (

                                        <div
                                            className="friend-card"
                                            key={
                                                friend.id
                                            }
                                        >

                                            <div className="friend-card-avatar">

                                                <Avatar
                                                    name={
                                                        friend.full_name ||
                                                        friend.username ||
                                                        "User"
                                                    }
                                                    image={
                                                        friend.avatar_url ||
                                                        ""
                                                    }
                                                    online={
                                                        Boolean(
                                                            friend.is_online
                                                        )
                                                    }
                                                    size="md"
                                                />

                                            </div>


                                            <div className="friend-details">

                                                <h3>
                                                    {
                                                        friend.full_name ||
                                                        friend.username
                                                    }
                                                </h3>

                                                <span className="friend-username">

                                                    @
                                                    {
                                                        friend.username
                                                    }

                                                </span>

                                                <p>
                                                    {
                                                        friend.status ||
                                                        "Available on DevChat"
                                                    }
                                                </p>

                                            </div>


                                            <button
                                                type="button"
                                                className="friend-action"
                                                disabled={
                                                    chatLoading ===
                                                    friend.id
                                                }
                                                onClick={() =>
                                                    handleOpenChat(
                                                        friend
                                                    )
                                                }
                                            >

                                                {chatLoading ===
                                                friend.id ? (

                                                    <LoaderCircle
                                                        size={16}
                                                        className="spin"
                                                    />

                                                ) : (

                                                    <MessageCircle
                                                        size={16}
                                                    />

                                                )}

                                                Chat

                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                )}


            {/* =================================================
                INCOMING REQUESTS
            ================================================= */}

            {!search.trim() &&
                activeTab === "requests" && (

                    <section className="friends-section">

                        <div className="friends-section-title">

                            <div>

                                <span>
                                    FRIEND REQUESTS
                                </span>

                                <h2>
                                    Incoming
                                </h2>

                            </div>

                        </div>


                        {incomingRequests.length ===
                        0 ? (

                            <div className="friends-empty">

                                <UserCheck
                                    size={34}
                                />

                                <h3>
                                    No pending requests
                                </h3>

                                <p>
                                    New friend requests
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="friends-grid">

                                {incomingRequests.map(
                                    (request) => {

                                        const requestUser =
                                            getRequestUser(
                                                request
                                            );


                                        return (

                                            <div
                                                className="friend-card"
                                                key={
                                                    request.id
                                                }
                                            >

                                                <div className="friend-card-avatar">

                                                    <Avatar
                                                        name={
                                                            requestUser?.full_name ||
                                                            requestUser?.username ||
                                                            "User"
                                                        }
                                                        image={
                                                            requestUser?.avatar_url ||
                                                            ""
                                                        }
                                                        online={
                                                            Boolean(
                                                                requestUser?.is_online
                                                            )
                                                        }
                                                        size="md"
                                                    />

                                                </div>


                                                <div className="friend-details">

                                                    <h3>
                                                        {
                                                            requestUser?.full_name ||
                                                            requestUser?.username ||
                                                            "Unknown User"
                                                        }
                                                    </h3>

                                                    <span className="friend-username">

                                                        @
                                                        {
                                                            requestUser?.username ||
                                                            ""
                                                        }

                                                    </span>

                                                    <p>
                                                        {
                                                            requestUser?.status ||
                                                            "Wants to be your friend"
                                                        }
                                                    </p>

                                                </div>


                                                <div className="friend-card-actions">

                                                    <button
                                                        type="button"
                                                        className="friend-action accept"
                                                        disabled={
                                                            actionLoading ===
                                                            request.id
                                                        }
                                                        onClick={() =>
                                                            handleAccept(
                                                                request
                                                            )
                                                        }
                                                    >

                                                        {actionLoading ===
                                                        request.id ? (

                                                            <LoaderCircle
                                                                size={16}
                                                                className="spin"
                                                            />

                                                        ) : (

                                                            <UserCheck
                                                                size={16}
                                                            />

                                                        )}

                                                        Accept

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="friend-action reject"
                                                        disabled={
                                                            actionLoading ===
                                                            request.id
                                                        }
                                                        onClick={() =>
                                                            handleReject(
                                                                request
                                                            )
                                                        }
                                                    >

                                                        <UserX
                                                            size={16}
                                                        />

                                                        Reject

                                                    </button>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </section>

                )}


            {/* =================================================
                SENT REQUESTS
            ================================================= */}

            {!search.trim() &&
                activeTab === "sent" && (

                    <section className="friends-section">

                        <div className="friends-section-title">

                            <div>

                                <span>
                                    OUTGOING REQUESTS
                                </span>

                                <h2>
                                    Sent Requests
                                </h2>

                            </div>

                        </div>


                        {outgoingRequests.length ===
                        0 ? (

                            <div className="friends-empty">

                                <Clock
                                    size={34}
                                />

                                <h3>
                                    No sent requests
                                </h3>

                                <p>
                                    Friend requests you
                                    send will appear
                                    here.
                                </p>

                            </div>

                        ) : (

                            <div className="friends-grid">

                                {outgoingRequests.map(
                                    (request) => {

                                        const requestUser =
                                            getRequestUser(
                                                request
                                            );


                                        return (

                                            <div
                                                className="friend-card"
                                                key={
                                                    request.id
                                                }
                                            >

                                                <div className="friend-card-avatar">

                                                    <Avatar
                                                        name={
                                                            requestUser?.full_name ||
                                                            requestUser?.username ||
                                                            "User"
                                                        }
                                                        image={
                                                            requestUser?.avatar_url ||
                                                            ""
                                                        }
                                                        online={
                                                            Boolean(
                                                                requestUser?.is_online
                                                            )
                                                        }
                                                        size="md"
                                                    />

                                                </div>


                                                <div className="friend-details">

                                                    <h3>
                                                        {
                                                            requestUser?.full_name ||
                                                            requestUser?.username ||
                                                            "Unknown User"
                                                        }
                                                    </h3>

                                                    <span className="friend-username">

                                                        @
                                                        {
                                                            requestUser?.username ||
                                                            ""
                                                        }

                                                    </span>

                                                    <p>
                                                        Waiting for
                                                        response...
                                                    </p>

                                                </div>


                                                <button
                                                    type="button"
                                                    className="friend-action pending"
                                                    disabled
                                                >

                                                    <Clock
                                                        size={16}
                                                    />

                                                    Pending

                                                </button>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </section>

                )}

        </main>

    );

}


export default Friends;