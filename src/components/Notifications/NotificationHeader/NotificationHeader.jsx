import "./NotificationHeader.css";

import {
    Bell,
    Search,
    MoreVertical,
    CheckCheck
} from "lucide-react";


function NotificationHeader({
    title = "Notifications",
    unreadCount = 0,
    onSearch,
    onMarkAllRead,
    onMore
}) {

    return (
        <header className="notification-header">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="notification-header__left">

                <div className="notification-header__icon">

                    <Bell size={21} />

                    {unreadCount > 0 && (
                        <span className="notification-header__badge">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}

                </div>


                <div className="notification-header__content">

                    <h1>
                        {title}
                    </h1>

                    <span>
                        {unreadCount > 0
                            ? `${unreadCount} unread notification${
                                unreadCount === 1 ? "" : "s"
                            }`
                            : "You're all caught up"
                        }
                    </span>

                </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="notification-header__actions">

                <button
                    type="button"
                    className="notification-header__button"
                    onClick={onSearch}
                    aria-label="Search notifications"
                >
                    <Search size={18} />
                </button>


                <button
                    type="button"
                    className="notification-header__button"
                    onClick={onMarkAllRead}
                    aria-label="Mark all notifications as read"
                    title="Mark all as read"
                >
                    <CheckCheck size={18} />
                </button>


                <button
                    type="button"
                    className="notification-header__button"
                    onClick={onMore}
                    aria-label="More notification options"
                >
                    <MoreVertical size={18} />
                </button>

            </div>

        </header>
    );
}


export default NotificationHeader;