import "./NotificationFilters.css";

import {
    Bell,
    Circle,
    Heart,
    MessageCircle,
    UserPlus,
    UserCheck,
    AtSign,
} from "lucide-react";


function NotificationFilters({
    activeFilter = "all",
    onFilterChange,
}) {

    const filters = [
        {
            id: "all",
            label: "All",
            icon: Bell,
        },
        {
            id: "unread",
            label: "Unread",
            icon: Circle,
        },
        {
            id: "like",
            label: "Likes",
            icon: Heart,
        },
        {
            id: "comment",
            label: "Comments",
            icon: MessageCircle,
        },
        {
            id: "follow",
            label: "Follows",
            icon: UserPlus,
        },
        {
            id: "request",
            label: "Requests",
            icon: UserCheck,
        },
        {
            id: "mention",
            label: "Mentions",
            icon: AtSign,
        },
    ];


    return (
        <nav
            className="notification-filters"
            aria-label="Notification filters"
        >

            <div className="notification-filters__scroll">

                {filters.map((filter) => {

                    const Icon = filter.icon;

                    const isActive =
                        activeFilter === filter.id;


                    return (
                        <button
                            key={filter.id}
                            type="button"
                            className={`notification-filters__button ${
                                isActive
                                    ? "notification-filters__button--active"
                                    : ""
                            }`}
                            onClick={() =>
                                onFilterChange?.(filter.id)
                            }
                            aria-pressed={isActive}
                        >

                            <Icon size={14} />

                            <span>
                                {filter.label}
                            </span>

                        </button>
                    );

                })}

            </div>

        </nav>
    );
}


export default NotificationFilters;