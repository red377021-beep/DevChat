import "./NotificationCard.css";

import {
    Heart,
    MessageCircle,
    UserPlus,
    AtSign,
    Phone,
    Users,
    Bell,
    Check,
    X,
    MoreVertical,
} from "lucide-react";


function NotificationCard({
    notification = {},
    onClick,
    onAccept,
    onReject,
    onDelete,
    onMore,
}) {

    const {
        id,
        type = "system",
        user = {},
        title = "",
        message = "",
        time = "Recently",
        read = false,
    } = notification;


    const iconMap = {
        like: Heart,
        comment: MessageCircle,
        follow: UserPlus,
        request: UserPlus,
        mention: AtSign,
        call: Phone,
        group: Users,
        system: Bell,
    };


    const Icon = iconMap[type] || Bell;


    const getAvatarText = () => {

        if (user.name) {
            return user.name
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
        }

        return "DC";
    };


    return (
        <article
            className={`notification-card ${
                !read ? "notification-card--unread" : ""
            }`}
            data-notification-id={id}
            onClick={() => onClick?.(notification)}
        >

            {/* =================================================
                AVATAR
            ================================================= */}

            <div className="notification-card__avatar-wrap">

                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="notification-card__avatar"
                    />
                ) : (
                    <div className="notification-card__avatar notification-card__avatar--initials">
                        {getAvatarText()}
                    </div>
                )}


                <span
                    className={`notification-card__type notification-card__type--${type}`}
                >
                    <Icon size={11} strokeWidth={2.5} />
                </span>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="notification-card__content">

                <div className="notification-card__text">

                    {title && (
                        <strong>
                            {title}
                        </strong>
                    )}

                    {message && (
                        <span>
                            {message}
                        </span>
                    )}

                </div>


                <div className="notification-card__meta">

                    <span>
                        {time}
                    </span>

                    {!read && (
                        <span className="notification-card__unread">
                            New
                        </span>
                    )}

                </div>


                {/* =================================================
                    REQUEST ACTIONS
                ================================================= */}

                {type === "request" && (
                    <div
                        className="notification-card__request-actions"
                        onClick={(event) => event.stopPropagation()}
                    >

                        <button
                            type="button"
                            className="notification-card__accept"
                            onClick={() =>
                                onAccept?.(notification)
                            }
                        >
                            <Check size={14} />
                            Accept
                        </button>


                        <button
                            type="button"
                            className="notification-card__reject"
                            onClick={() =>
                                onReject?.(notification)
                            }
                        >
                            <X size={14} />
                            Decline
                        </button>

                    </div>
                )}

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div
                className="notification-card__actions"
                onClick={(event) => event.stopPropagation()}
            >

                {!read && (
                    <span
                        className="notification-card__dot"
                        aria-label="Unread"
                    />
                )}


                <button
                    type="button"
                    className="notification-card__more"
                    onClick={() =>
                        onMore?.(notification)
                    }
                    aria-label="More options"
                >
                    <MoreVertical size={17} />
                </button>

            </div>

        </article>
    );
}


export default NotificationCard;