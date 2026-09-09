import "./ChatHeader.css";

import {
    Phone,
    Video,
    Search,
    MoreVertical,
    BellOff
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import { useChat } from "../../context/ChatContext";
import { useCall } from "../../context/CallContext";

import ChatMenu from "../ChatMenu/ChatMenu";
import ChatSearch from "../ChatSearch/ChatSearch";
import PinnedMessages from "../PinnedMessages/PinnedMessages";
import StarredMessages from "../StarredMessages/StarredMessages";
import BookmarkPanel from "../Bookmarks/BookmarkPanel";
import MediaLinksFiles from "../MediaLinksFiles/MediaLinksFiles";

import VideoCallModal from "../VideoCallModal/VideoCallModal";
import AudioCall from "../AudioCall/AudioCall";

import IncomingVideoCall from "../IncomingVideoCall/IncomingVideoCall";
import IncomingAudioCall from "../IncomingAudioCall/IncomingAudioCall";


// =====================================================
// GET CHAT USER ID
// =====================================================

function getChatUserId(chat) {
    if (!chat) {
        console.log("❌ NO SELECTED CHAT");
        return null;
    }

    console.log("🔎 SELECTED CHAT OBJECT:", chat);

    const userId =
        chat.userId ??
        chat.user_id ??
        chat.otherUserId ??
        chat.other_user_id ??
        chat.receiverId ??
        chat.receiver_id ??
        chat.participantId ??
        chat.participant_id ??
        chat.user?.id ??
        chat.user?.userId ??
        chat.profile?.id ??
        chat.profile?.userId;

    console.log("🎯 RESOLVED CALL TARGET USER ID:", userId);

    return userId ? String(userId) : null;
}


// =====================================================
// CHAT HEADER
// =====================================================

function ChatHeader() {


    // =================================================
    // CHAT CONTEXT
    // =================================================

    const {
        selectedChat,
        toggleRightPanel

    } = useChat();


    // =================================================
    // CALL CONTEXT
    // =================================================

    const {
        callState,

        activeCallType,

        callPeerUserId,
        callPeerName,
        callPeerAvatar,

        incomingCall,
        outgoingCall,
        activeCall,

        audioCallOpen,
        videoCallOpen,

        incomingAudioCallOpen,
        incomingVideoCallOpen,

        startAudioCall:
            startRealAudioCall,

        startVideoCall:
            startRealVideoCall,

        acceptAudioCall:
            acceptRealAudioCall,

        acceptVideoCall:
            acceptRealVideoCall,

        declineCall:
            declineRealCall,

        endCall:
            endRealCall

    } = useCall();


    // =================================================
    // CURRENT CHAT
    // =================================================

    const chatName =
        selectedChat?.name ||
        selectedChat?.username ||
        "DevChat";


    const chatAvatar =
        selectedChat?.avatar ||
        selectedChat?.profilePicture ||
        chatName
            ?.charAt(0)
            ?.toUpperCase() ||
        "D";


    const isOnline =
        selectedChat?.online !== undefined
            ? selectedChat.online
            : true;


    // =================================================
    // PANEL STATES
    // =================================================

    const [menuOpen, setMenuOpen] =
        useState(false);


    const [searchOpen, setSearchOpen] =
        useState(false);


    const [pinnedOpen, setPinnedOpen] =
        useState(false);


    const [starredOpen, setStarredOpen] =
        useState(false);


    const [bookmarkOpen, setBookmarkOpen] =
        useState(false);


    const [mediaOpen, setMediaOpen] =
        useState(false);


    // =================================================
    // MUTE STATES
    // =================================================

    const [muteNotifications, setMuteNotifications] =
        useState(false);


    const [muteDuration, setMuteDuration] =
        useState(null);


    const [muteUntil, setMuteUntil] =
        useState(null);


    const [muteTime, setMuteTime] =
        useState("");


    // =================================================
    // MENU REF
    // =================================================

    const menuRef =
        useRef(null);


    // =================================================
    // RESET CHAT UI WHEN CHAT CHANGES
    // =================================================

    useEffect(() => {

        setMenuOpen(false);

        setSearchOpen(false);

        setPinnedOpen(false);

        setStarredOpen(false);

        setBookmarkOpen(false);

        setMediaOpen(false);


        setMuteNotifications(false);

        setMuteDuration(null);

        setMuteUntil(null);

        setMuteTime("");

    }, [
        selectedChat?.id
    ]);


    // =================================================
    // MUTE TIME DISPLAY
    // =================================================

    useEffect(() => {

        if (!muteNotifications) {

            setMuteTime("");

            return;

        }


        if (muteDuration === "always") {

            setMuteTime("Muted");

            return;

        }


        function updateMuteTime() {

            if (!muteUntil) {

                setMuteTime("Muted");

                return;

            }


            const remaining =
                muteUntil - Date.now();


            if (remaining <= 0) {

                setMuteNotifications(false);

                setMuteDuration(null);

                setMuteUntil(null);

                setMuteTime("");

                return;

            }


            const totalMinutes =
                Math.ceil(
                    remaining /
                    (60 * 1000)
                );


            if (totalMinutes < 60) {

                setMuteTime(
                    `${totalMinutes}m`
                );

                return;

            }


            const hours =
                Math.ceil(
                    totalMinutes / 60
                );


            if (hours < 24) {

                setMuteTime(
                    `${hours}h`
                );

                return;

            }


            const days =
                Math.ceil(
                    hours / 24
                );


            setMuteTime(
                `${days}d`
            );

        }


        updateMuteTime();


        const timer =
            window.setInterval(
                updateMuteTime,
                30000
            );


        return () => {

            window.clearInterval(timer);

        };

    }, [
        muteNotifications,
        muteDuration,
        muteUntil
    ]);


    // =================================================
    // CUSTOM MUTE
    // =================================================

    function handleCustomMute(duration) {

        if (!duration) {
            return;
        }


        if (duration === "always") {

            setMuteNotifications(true);

            setMuteDuration("always");

            setMuteUntil(null);

            setMuteTime("Muted");

            return;

        }


        const minutes =
            Number(duration);


        if (
            !Number.isFinite(minutes) ||
            minutes <= 0
        ) {

            return;

        }


        const until =
            Date.now() +
            minutes * 60 * 1000;


        setMuteNotifications(true);

        setMuteDuration("custom");

        setMuteUntil(until);

    }


    // =================================================
    // UNMUTE
    // =================================================

    function handleUnmute() {

        setMuteNotifications(false);

        setMuteDuration(null);

        setMuteUntil(null);

        setMuteTime("");

    }


    // =================================================
    // OUTSIDE MENU CLICK
    // =================================================

    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target
                )
            ) {

                setMenuOpen(false);

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


    // =================================================
    // ESC KEY
    // =================================================

    useEffect(() => {

        function handleEscape(event) {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            setMenuOpen(false);

            setSearchOpen(false);

            setPinnedOpen(false);

            setStarredOpen(false);

            setBookmarkOpen(false);

            setMediaOpen(false);

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


    // =================================================
    // PROFILE
    // =================================================

    function handleProfile() {

        setMenuOpen(false);

        toggleRightPanel();

    }


    // =================================================
    // SEARCH
    // =================================================

    function handleSearch() {

        setMenuOpen(false);

        setSearchOpen(true);

    }


    // =================================================
    // MEDIA
    // =================================================

    function handleMedia() {

        setMenuOpen(false);

        setMediaOpen(true);

    }


    // =================================================
    // PINNED
    // =================================================

    function handlePinned() {

        setMenuOpen(false);

        setPinnedOpen(true);

    }


    // =================================================
    // STARRED
    // =================================================

    function handleStarred() {

        setMenuOpen(false);

        setStarredOpen(true);

    }


    // =================================================
    // BOOKMARKS
    // =================================================

    function handleBookmarks() {

        setMenuOpen(false);

        setBookmarkOpen(true);

    }


    // =================================================
    // CLOSE FUNCTIONS
    // =================================================

    function closeSearch() {

        setSearchOpen(false);

    }


    function closePinned() {

        setPinnedOpen(false);

    }


    function closeStarred() {

        setStarredOpen(false);

    }


    function closeBookmarks() {

        setBookmarkOpen(false);

    }


    function closeMedia() {

        setMediaOpen(false);

    }


    // =================================================
    // OVERLAY CLOSE
    // =================================================

    function handleOverlayMouseDown(
        event,
        closeFunction
    ) {

        if (
            event.target ===
            event.currentTarget
        ) {

            closeFunction();

        }

    }


    // =================================================
    // GET CURRENT CHAT CALL TARGET
    // =================================================

    function getCurrentCallTarget() {
    if (!selectedChat) {
        console.error("❌ CALL TARGET: selectedChat is null");
        return null;
    }

    const userId = getChatUserId(selectedChat);

    if (!userId) {
        console.error(
            "❌ CALL TARGET USER ID MISSING:",
            selectedChat
        );
        return null;
    }

    return {
        userId,
        name:
            selectedChat.name ||
            selectedChat.username ||
            selectedChat.fullName ||
            selectedChat.user?.name ||
            selectedChat.user?.username ||
            "DevChat User",

        avatar:
            selectedChat.avatar ||
            selectedChat.avatar_url ||
            selectedChat.profilePicture ||
            selectedChat.profile_picture ||
            selectedChat.user?.avatar ||
            selectedChat.user?.avatar_url ||
            "D"
    };
}

    // =================================================
    // START AUDIO CALL
    // =================================================

    async function startAudioCall() {

        setMenuOpen(false);


        const target =
            getCurrentCallTarget();


        if (!target) {

            return;

        }


        console.log(
            "📞 ChatHeader → AUDIO CALL:",
            target
        );


        try {

            const result =
                await startRealAudioCall(
                    target
                );


            console.log(
                "📞 Audio call result:",
                result
            );

        } catch (error) {

            console.error(
                "❌ ChatHeader audio call error:",
                error
            );

        }

    }


    // =================================================
    // START VIDEO CALL
    // =================================================

    async function startVideoCall() {

        setMenuOpen(false);


        const target =
            getCurrentCallTarget();


        if (!target) {

            return;

        }


        console.log(
            "📹 ChatHeader → VIDEO CALL:",
            target
        );


        try {

            const result =
                await startRealVideoCall(
                    target
                );


            console.log(
                "📹 Video call result:",
                result
            );

        } catch (error) {

            console.error(
                "❌ ChatHeader video call error:",
                error
            );

        }

    }


    // =================================================
    // ACCEPT AUDIO CALL
    // =================================================

    async function acceptAudioCall() {

        console.log(
            "📞 ChatHeader → ACCEPT AUDIO"
        );


        try {

            await acceptRealAudioCall();

        } catch (error) {

            console.error(
                "❌ ChatHeader accept audio error:",
                error
            );

        }

    }


    // =================================================
    // ACCEPT VIDEO CALL
    // =================================================

    async function acceptVideoCall() {

        console.log(
            "📹 ChatHeader → ACCEPT VIDEO"
        );


        try {

            await acceptRealVideoCall();

        } catch (error) {

            console.error(
                "❌ ChatHeader accept video error:",
                error
            );

        }

    }


    // =================================================
    // DECLINE CALL
    // =================================================

    function declineCall() {

        console.log(
            "📵 ChatHeader → DECLINE CALL"
        );


        try {

            declineRealCall();

        } catch (error) {

            console.error(
                "❌ ChatHeader decline call error:",
                error
            );

        }

    }


    // =================================================
    // CLOSE ACTIVE AUDIO CALL
    // =================================================

    function closeAudioCall() {

        console.log(
            "📞 ChatHeader → END AUDIO CALL"
        );


        try {

            endRealCall();

        } catch (error) {

            console.error(
                "❌ ChatHeader end audio error:",
                error
            );

        }

    }


    // =================================================
    // CLOSE ACTIVE VIDEO CALL
    // =================================================

    function closeVideoCall() {

        console.log(
            "📹 ChatHeader → END VIDEO CALL"
        );


        try {

            endRealCall();

        } catch (error) {

            console.error(
                "❌ ChatHeader end video error:",
                error
            );

        }

    }


    // =================================================
    // INCOMING CALL DATA
    // =================================================

    const incomingCallerName =
        incomingCall?.name ||
        callPeerName ||
        "Unknown User";


    const incomingCallerAvatar =
        incomingCall?.avatar ||
        callPeerAvatar ||
        "D";


    // =================================================
    // ACTIVE CALL DATA
    // =================================================

    const activeCallerName =
        activeCall?.name ||
        outgoingCall?.name ||
        callPeerName ||
        "Unknown User";


    const activeCallerAvatar =
        activeCall?.avatar ||
        outgoingCall?.avatar ||
        callPeerAvatar ||
        "D";


    // =================================================
    // UI
    // =================================================

    return (

        <>

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="chat-header">


                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="header-left">

                    <div className="chat-avatar">

                        {chatAvatar}

                    </div>


                    <div className="chat-user-info">

                        <h3>
                            {chatName}
                        </h3>


                        <span className="online-status">

                            <span
                                className={`online-dot ${
                                    isOnline
                                        ? ""
                                        : "offline"
                                }`}
                            ></span>


                            {isOnline
                                ? "Online"
                                : "Offline"
                            }


                            {muteNotifications && (

                                <span
                                    className="chat-muted-status"
                                    title={
                                        muteDuration ===
                                        "always"
                                            ? "Notifications muted"
                                            : `Notifications muted for ${muteTime}`
                                    }
                                >

                                    <BellOff
                                        size={13}
                                    />

                                    <span>
                                        {muteTime}
                                    </span>

                                </span>

                            )}

                        </span>

                    </div>

                </div>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <div
                    className="header-right"
                    ref={menuRef}
                >


                    {/* SEARCH */}

                    <button
                        type="button"
                        className="header-btn"
                        title="Search messages"
                        aria-label="Search messages"
                        onClick={handleSearch}
                    >

                        <Search size={20} />

                    </button>


                    {/* AUDIO CALL */}

                    <button
                        type="button"
                        className="header-btn"
                        title={`Voice Call ${chatName}`}
                        aria-label={`Voice Call ${chatName}`}
                        onClick={startAudioCall}
                        disabled={
                            Boolean(
                                callState !==
                                "idle" &&
                                callState !==
                                "ended" &&
                                callState !==
                                "declined" &&
                                callState !==
                                "failed"
                            )
                        }
                    >

                        <Phone size={20} />

                    </button>


                    {/* VIDEO CALL */}

                    <button
                        type="button"
                        className="header-btn"
                        title={`Video Call ${chatName}`}
                        aria-label={`Video Call ${chatName}`}
                        onClick={startVideoCall}
                        disabled={
                            Boolean(
                                callState !==
                                "idle" &&
                                callState !==
                                "ended" &&
                                callState !==
                                "declined" &&
                                callState !==
                                "failed"
                            )
                        }
                    >

                        <Video size={20} />

                    </button>


                    {/* MORE */}

                    <button
                        type="button"
                        className="header-btn"
                        title="More options"
                        aria-label="More options"
                        onClick={() =>
                            setMenuOpen(
                                previous =>
                                    !previous
                            )
                        }
                    >

                        <MoreVertical
                            size={20}
                        />

                    </button>


                    {/* CHAT MENU */}

                    {menuOpen && (

                        <ChatMenu

                            onClose={() =>
                                setMenuOpen(false)
                            }

                            onProfile={
                                handleProfile
                            }

                            onSearch={
                                handleSearch
                            }

                            onMedia={
                                handleMedia
                            }

                            onPinned={
                                handlePinned
                            }

                            onStarred={
                                handleStarred
                            }

                            onBookmarks={
                                handleBookmarks
                            }

                            onMute={
                                handleCustomMute
                            }

                            onUnmute={
                                handleUnmute
                            }

                            muteNotifications={
                                muteNotifications
                            }

                        />

                    )}

                </div>

            </header>


            {/* =================================================
                SEARCH
            ================================================= */}

            {searchOpen && (

                <div
                    className="chat-search-container"
                >

                    <ChatSearch
                        onClose={
                            closeSearch
                        }
                    />

                </div>

            )}


            {/* =================================================
                PINNED
            ================================================= */}

            {pinnedOpen && (

                <div
                    className="chat-feature-overlay"
                    onMouseDown={(event) =>
                        handleOverlayMouseDown(
                            event,
                            closePinned
                        )
                    }
                >

                    <div
                        className="chat-feature-drawer"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <PinnedMessages
                            onClose={
                                closePinned
                            }
                        />

                    </div>

                </div>

            )}


            {/* =================================================
                STARRED
            ================================================= */}

            {starredOpen && (

                <div
                    className="chat-feature-overlay"
                    onMouseDown={(event) =>
                        handleOverlayMouseDown(
                            event,
                            closeStarred
                        )
                    }
                >

                    <div
                        className="chat-feature-drawer"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <StarredMessages
                            onClose={
                                closeStarred
                            }
                        />

                    </div>

                </div>

            )}


            {/* =================================================
                BOOKMARKS
            ================================================= */}

            {bookmarkOpen && (

                <div
                    className="chat-feature-overlay"
                    onMouseDown={(event) =>
                        handleOverlayMouseDown(
                            event,
                            closeBookmarks
                        )
                    }
                >

                    <div
                        className="chat-feature-drawer"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <BookmarkPanel
                            onClose={
                                closeBookmarks
                            }
                        />

                    </div>

                </div>

            )}


            {/* =================================================
                MEDIA
            ================================================= */}

            {mediaOpen && (

                <div
                    className="chat-feature-overlay"
                    onMouseDown={(event) =>
                        handleOverlayMouseDown(
                            event,
                            closeMedia
                        )
                    }
                >

                    <div
                        className="chat-feature-drawer"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <MediaLinksFiles
                            onClose={
                                closeMedia
                            }
                        />

                    </div>

                </div>

            )}


            {/* =================================================
                INCOMING AUDIO CALL
            ================================================= */}

            {incomingAudioCallOpen && (

                <IncomingAudioCall

                    callerName={
                        incomingCallerName
                    }

                    callerAvatar={
                        incomingCallerAvatar
                    }

                    onAccept={
                        acceptAudioCall
                    }

                    onDecline={
                        declineCall
                    }

                />

            )}


            {/* =================================================
                INCOMING VIDEO CALL
            ================================================= */}

            {incomingVideoCallOpen && (

                <IncomingVideoCall

                    callerName={
                        incomingCallerName
                    }

                    callerAvatar={
                        incomingCallerAvatar
                    }

                    onAccept={
                        acceptVideoCall
                    }

                    onDecline={
                        declineCall
                    }

                />

            )}


            {/* =================================================
                VIDEO CALL
            ================================================= */}

            {videoCallOpen && (

                <VideoCallModal

                    onClose={
                        closeVideoCall
                    }

                />

            )}


            {/* =================================================
                AUDIO CALL
            ================================================= */}

            {audioCallOpen && (

                <AudioCall

                    onClose={
                        closeAudioCall
                    }

                />

            )}

        </>

    );

}


export default ChatHeader;