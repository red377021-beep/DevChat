import "./NotificationList.css";

import {
    Search,
    BellOff,
    CheckCheck
} from "lucide-react";

import { useMemo, useState } from "react";

import NotificationCard from "../NotificationCard/NotificationCard";


function NotificationList({
    notifications = [],
    filter = "all",
    searchQuery = "",
    onFilterChange,
    onNotificationClick,
    onAccept,
    onReject,
    onDelete,
    onMarkAllRead
}) {

    const [localSearch, setLocalSearch] = useState(searchQuery);


    const filteredNotifications = useMemo(() => {

        const query = localSearch.trim().toLowerCase();


        return notifications.filter((notification) => {

            const matchesFilter =
                filter === "all" ||
                (filter === "unread" && !notification.read) ||
                notification.type === filter;


            const searchableText = [
                notification.title,
                notification.message,
                notification.user?.name
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !query ||
                searchableText.includes(query);


            return matchesFilter && matchesSearch;
        });

    }, [
        notifications,
        filter,
        localSearch
    ]);


    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;


    return (
        <section className="notification-list">

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="notification-list__search">

                <Search size={17} />

                <input
                    type="text"
                    value={localSearch}
                    onChange={(event) => {
                        const value = event.target.value;
                        setLocalSearch(value);
                    }}
                    placeholder="Search notifications..."
                    aria-label="Search notifications"
                />

            </div>


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="notification-list__toolbar">

                <div className="notification-list__result">

                    <span>
                        {filteredNotifications.length} notification
                        {filteredNotifications.length === 1 ? "" : "s"}
                    </span>

                    {unreadCount > 0 && (
                        <span className="notification-list__unread-count">
                            {unreadCount} unread
                        </span>
                    )}

                </div>


                {unreadCount > 0 && (
                    <button
                        type="button"
                        className="notification-list__mark-read"
                        onClick={onMarkAllRead}
                    >
                        <CheckCheck size={14} />
                        Mark all read
                    </button>
                )}

            </div>


            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div className="notification-list__items">

                {filteredNotifications.length === 0 ? (

                    <div className="notification-list__empty">

                        <div className="notification-list__empty-icon">
                            <BellOff size={23} />
                        </div>

                        <h3>
                            No notifications
                        </h3>

                        <p>
                            {localSearch
                                ? "No notifications match your search."
                                : "You're all caught up. New activity will appear here."
                            }
                        </p>

                    </div>

                ) : (

                    filteredNotifications.map((notification) => (

                        <NotificationCard
                            key={notification.id}
                            notification={notification}
                            onClick={onNotificationClick}
                            onAccept={onAccept}
                            onReject={onReject}
                            onDelete={onDelete}
                        />

                    ))

                )}

            </div>

        </section>
    );
}


export default NotificationList;