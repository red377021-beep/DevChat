import "./MobileTopNav.css";

import {
    User,
    Bell
} from "lucide-react";

import { useLayout } from "../../context/LayoutContext";


// =====================================================
// MOBILE / TABLET TOP NAVIGATION
// =====================================================
// Profile       Friends       Notifications
//
// This navigation is:
// - Mobile only
// - Tablet only
// - Hidden on desktop
// =====================================================

function MobileTopNav() {

    const {
        activeView,
        setActiveView
    } = useLayout();


    // =====================================================
    // PROFILE
    // =====================================================

    const handleProfile = () => {

        setActiveView("profile");

    };


    // =====================================================
    // FRIENDS
    // =====================================================

    const handleFriends = () => {

        setActiveView("friends");

    };


    // =====================================================
    // NOTIFICATIONS
    // =====================================================

    const handleNotifications = () => {

        setActiveView("notifications");

    };


    return (
        <header
            className="mobile-top-nav"
            aria-label="Mobile top navigation"
        >

            <div className="mobile-top-nav-inner">


                {/* =================================================
                    PROFILE - TOP LEFT
                ================================================= */}

                <button
                    type="button"
                    className={`mobile-top-action ${
                        activeView === "profile"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleProfile}
                    aria-label="Profile"
                >

                    <span className="mobile-top-icon">

                        <User
                            size={23}
                            strokeWidth={
                                activeView === "profile"
                                    ? 2.5
                                    : 2
                            }
                        />

                    </span>

                </button>


                {/* =================================================
                    FRIENDS - CENTER
                ================================================= */}

                <button
                    type="button"
                    className={`mobile-top-friends ${
                        activeView === "friends"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleFriends}
                    aria-label="Friends"
                >

                    <span className="mobile-top-friends-text">
                        Friends
                    </span>

                </button>


                {/* =================================================
                    NOTIFICATIONS - TOP RIGHT
                ================================================= */}

                <button
                    type="button"
                    className={`mobile-top-action ${
                        activeView === "notifications"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleNotifications}
                    aria-label="Notifications"
                >

                    <span className="mobile-top-icon">

                        <Bell
                            size={23}
                            strokeWidth={
                                activeView === "notifications"
                                    ? 2.5
                                    : 2
                            }
                        />

                    </span>

                </button>


            </div>

        </header>
    );
}


export default MobileTopNav;
