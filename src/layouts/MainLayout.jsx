import "./MainLayout.css";

import Sidebar from "../components/sidebar/Sidebar";
import ChatList from "../components/chat-list/ChatList";
import Chat from "../components/Chat/Chat";
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

import Friends from "../components/Friends/Friends";

import { useChat } from "../context/ChatContext";
import { useLayout } from "../context/LayoutContext";


function MainLayout() {

    const {
        rightPanelOpen,
        closeRightPanel
    } = useChat();


    const {
        activeView
    } = useLayout();


    // =====================================================
    // SPECIAL FULL-SCREEN VIEWS
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
        activeView === "profile";


    return (
        <div className="main-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar />


            {/* =================================================
                CHAT LIST
                Hidden on special views
            ================================================= */}

            {!isSpecialView && (
                <ChatList />
            )}


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

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

            ) : (

                <Chat />

            )}


            {/* =================================================
                RIGHT PANEL
                Hidden on special views
            ================================================= */}

            {!isSpecialView && (
                <div
                    className={`right-panel-wrapper ${
                        rightPanelOpen ? "open" : ""
                    }`}
                >
                    <RightPanel />
                </div>
            )}


            {/* =================================================
                RIGHT PANEL OVERLAY
            ================================================= */}

            {!isSpecialView &&
                rightPanelOpen && (
                    <div
                        className="right-panel-overlay"
                        onClick={closeRightPanel}
                        aria-hidden="true"
                    />
                )
            }


            {/* =================================================
                MESSAGE INFO
                Hidden on special views
            ================================================= */}

            {!isSpecialView && (
                <MessageInfo />
            )}

        </div>
    );
}


export default MainLayout;