import "./Notifications.css";

import { useMemo, useState } from "react";

import NotificationHeader from "../../components/Notifications/NotificationHeader/NotificationHeader";
import NotificationFilters from "../../components/Notifications/NotificationFilters/NotificationFilters";
import NotificationList from "../../components/Notifications/NotificationList/NotificationList";
import NotificationSettings from "../../components/Notifications/NotificationSettings/NotificationSettings";

import {
    Settings,
    X,
} from "lucide-react";


function Notifications() {

    const [activeFilter, setActiveFilter] = useState("all");

    const [searchQuery, setSearchQuery] = useState("");

    const [showSettings, setShowSettings] = useState(false);


    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "like",
            user: {
                name: "Kinza",
            },
            title: "Kinza",
            message: "liked your reel.",
            time: "2 min ago",
            read: false,
        },
        {
            id: 2,
            type: "comment",
            user: {
                name: "Mishael",
            },
            title: "Mishael",
            message: "commented on your post.",
            time: "18 min ago",
            read: false,
        },
        {
            id: 3,
            type: "follow",
            user: {
                name: "Amina",
            },
            title: "Amina",
            message: "started following you.",
            time: "1 hour ago",
            read: false,
        },
        {
            id: 4,
            type: "request",
            user: {
                name: "Sarah Khan",
            },
            title: "Sarah Khan",
            message: "sent you a friend request.",
            time: "3 hours ago",
            read: false,
        },
        {
            id: 5,
            type: "mention",
            user: {
                name: "Abdullah",
            },
            title: "Abdullah",
            message: "mentioned you in a group.",
            time: "Yesterday",
            read: true,
        },
        {
            id: 6,
            type: "call",
            user: {
                name: "Mishael",
            },
            title: "Missed call",
            message: "You missed a voice call.",
            time: "Yesterday",
            read: true,
        },
        {
            id: 7,
            type: "like",
            user: {
                name: "Pihuu",
            },
            title: "Pihuu",
            message: "liked your photo.",
            time: "2 days ago",
            read: true,
        },
    ]);


    const unreadCount = useMemo(() => {
        return notifications.filter(
            (notification) => !notification.read
        ).length;
    }, [notifications]);


    const handleNotificationClick = (notification) => {

        setNotifications((current) =>
            current.map((item) =>
                item.id === notification.id
                    ? {
                        ...item,
                        read: true,
                    }
                    : item
            )
        );

    };


    const handleMarkAllRead = () => {

        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                read: true,
            }))
        );

    };


    const handleAccept = (notification) => {

        setNotifications((current) =>
            current.map((item) =>
                item.id === notification.id
                    ? {
                        ...item,
                        read: true,
                        message: "Friend request accepted.",
                        type: "system",
                    }
                    : item
            )
        );

    };


    const handleReject = (notification) => {

        setNotifications((current) =>
            current.filter(
                (item) => item.id !== notification.id
            )
        );

    };


    const handleDelete = (notification) => {

        setNotifications((current) =>
            current.filter(
                (item) => item.id !== notification.id
            )
        );

    };


    return (
        <main className="notifications-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <NotificationHeader
                title="Notifications"
                unreadCount={unreadCount}
                onSearch={() => {
                    document
                        .querySelector(
                            ".notification-list__search input"
                        )
                        ?.focus();
                }}
                onMarkAllRead={handleMarkAllRead}
                onMore={() =>
                    setShowSettings((current) => !current)
                }
            />


            {/* =================================================
                PAGE BODY
            ================================================= */}

            <div className="notifications-page__body">

                <div className="notifications-page__content">

                    {/* =================================================
                        TOP BAR
                    ================================================= */}

                    <div className="notifications-page__top">

                        <div className="notifications-page__heading">

                            <h2>
                                Activity
                            </h2>

                            <span>
                                Stay updated with everything happening
                                around your account.
                            </span>

                        </div>


                        <button
                            type="button"
                            className={`notifications-page__settings-button ${
                                showSettings
                                    ? "notifications-page__settings-button--active"
                                    : ""
                            }`}
                            onClick={() =>
                                setShowSettings((current) => !current)
                            }
                            aria-label="Notification settings"
                        >
                            <Settings size={16} />

                            <span>
                                Settings
                            </span>
                        </button>

                    </div>


                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    {!showSettings && (
                        <NotificationFilters
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                        />
                    )}


                    {/* =================================================
                        NOTIFICATION LIST
                    ================================================= */}

                    {!showSettings && (
                        <div className="notifications-page__list-wrapper">

                            <NotificationList
                                notifications={notifications}
                                filter={activeFilter}
                                searchQuery={searchQuery}
                                onNotificationClick={
                                    handleNotificationClick
                                }
                                onAccept={handleAccept}
                                onReject={handleReject}
                                onDelete={handleDelete}
                                onMarkAllRead={
                                    handleMarkAllRead
                                }
                            />

                        </div>
                    )}


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    {showSettings && (
                        <div className="notifications-page__settings">

                            <div className="notifications-page__settings-header">

                                <div>
                                    <h2>
                                        Notification Settings
                                    </h2>

                                    <span>
                                        Manage your notification preferences.
                                    </span>
                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSettings(false)
                                    }
                                    aria-label="Close settings"
                                >
                                    <X size={18} />
                                </button>

                            </div>


                            <NotificationSettings />

                        </div>
                    )}

                </div>

            </div>

        </main>
    );
}


export default Notifications;