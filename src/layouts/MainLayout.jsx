import "./MainLayout.css";
import "./MainLayout.responsive.css";

import {
    MessageCircle,
    Film,
    Camera as CameraIcon,
    CirclePlay,
    Sparkles,
} from "lucide-react";

import Sidebar from "../components/sidebar/Sidebar";
import ChatList from "../components/chat-list/ChatList";
import Chat from "../components/chat/Chat";

import RightPanel from "../components/right-panel/RightPanel";
import MessageInfo from "../components/MessageInfo/MessageInfo";

import Reels from "../pages/Reels/Reels";
import Stories from "../pages/Stories/Stories";
import Groups from "../pages/Groups/Groups";
import Calls from "../pages/Calls/Calls";
import AI from "../pages/AI/AI";
import Notifications from "../pages/Notifications/Notifications";
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Profile/Profile";
import Camera from "../pages/Camera/Camera";

import Friends from "../components/Friends/Friends";

import { useChat } from "../context/ChatContext";
import { useLayout } from "../context/LayoutContext";

function MainLayout() {

const {
    selectedChat,
    clearSelectedChat,
    rightPanelOpen,
    closeRightPanel,
} = useChat();


    const {
        activeView,
        setActiveView,
    } = useLayout();


    // =====================================================
    // SPECIAL VIEWS
    // =====================================================

    const isSpecialView =
        activeView === "friends" ||
        activeView === "reels" ||
        activeView === "stories" ||
        activeView === "groups" ||
        activeView === "calls" ||
        activeView === "ai" ||
        activeView === "notifications" ||
        activeView === "settings" ||
        activeView === "profile" ||
        activeView === "camera";


    // =====================================================
    // MOBILE NAVIGATION
    // =====================================================

const handleMobileNavigation = (view) => {

    // Chats button should ONLY show the chat list.
    // It must not reopen the previously selected DM.
    if (view === "chats") {
        clearSelectedChat();
    }

    setActiveView(view);

};



    // =====================================================
    // CHAT VIEW
    //
    // IMPORTANT:
    // "chats" means ONLY the chat list.
    //
    // The actual DM opens only after the user selects
    // a conversation from ChatList.
    // =====================================================

    const showChatList =
        activeView === "chats";


    const showChat =
        activeView === "chats" &&
        Boolean(selectedChat);


    return (
        <div className="main-layout">

            <Sidebar />


            {/* ================================================= */}
            {/* CHAT LIST */}
            {/* ================================================= */}

            {showChatList && (
                <ChatList />
            )}


            {/* ================================================= */}
            {/* SPECIAL PAGES */}
            {/* ================================================= */}

            {activeView === "friends" ? (

                <Friends />

            ) : activeView === "reels" ? (

                <Reels />

            ) : activeView === "stories" ? (

                <Stories />

            ) : activeView === "groups" ? (

                <Groups />

            ) : activeView === "calls" ? (

                <Calls />

            ) : activeView === "ai" ? (

                <AI />

            ) : activeView === "notifications" ? (

                <Notifications />

            ) : activeView === "settings" ? (

                <Settings />

            ) : activeView === "profile" ? (

                <Profile />

            ) : activeView === "camera" ? (

                <Camera />

            ) : showChat ? (

                <Chat />

            ) : null}


            {/* ================================================= */}
            {/* RIGHT PANEL */}
            {/* Only when an actual DM is open */}
            {/* ================================================= */}

            {showChat && (
                <div
                    className={`right-panel-wrapper ${
                        rightPanelOpen ? "open" : ""
                    }`}
                >
                    <RightPanel />
                </div>
            )}


            {/* ================================================= */}
            {/* RIGHT PANEL OVERLAY */}
            {/* ================================================= */}

            {showChat && rightPanelOpen && (
                <div
                    className="right-panel-overlay"
                    onClick={closeRightPanel}
                    aria-hidden="true"
                />
            )}


            {/* ================================================= */}
            {/* MESSAGE INFO */}
            {/* Only inside actual DM */}
            {/* ================================================= */}

            {showChat && (
                <MessageInfo />
            )}


            {/* ================================================= */}
            {/* MOBILE APP NAVIGATION */}
            {/* ================================================= */}

            <nav className="mobile-app-navigation">

                {/* CHATS */}

                <button
                    type="button"
                    className={`mobile-app-nav-item ${
                        activeView === "chats"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleMobileNavigation("chats")
                    }
                    aria-label="Chats"
                >
                    <MessageCircle size={17} />
                    <span>Chats</span>
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
                        handleMobileNavigation("reels")
                    }
                    aria-label="Reels"
                >
                    <Film size={17} />
                    <span>Reels</span>
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
                        handleMobileNavigation("camera")
                    }
                    aria-label="Camera"
                >
                    <CameraIcon size={17} />
                    <span>Camera</span>
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
                        handleMobileNavigation("stories")
                    }
                    aria-label="Stories"
                >
                    <CirclePlay size={17} />
                    <span>Stories</span>
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
                        handleMobileNavigation("ai")
                    }
                    aria-label="AI"
                >
                    <Sparkles size={17} />
                    <span>AI</span>
                </button>

            </nav>

        </div>
    );
}

export default MainLayout;

