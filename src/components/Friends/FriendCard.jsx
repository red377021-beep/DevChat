import {
    UserPlus,
    UserCheck,
    Clock,
    UserX,
} from "lucide-react";

import Avatar from "../common/Avatar/Avatar";

import "./Friends.css";


function FriendCard({
    user,
    action = "add",
    loading = false,
    onAction,
}) {

    if (!user) {
        return null;
    }


    const name =
        user.full_name ||
        user.username ||
        "Unknown User";


    const username =
        user.username ||
        "";


    const avatar =
        user.avatar_url ||
        "";


    const online =
        Boolean(user.is_online);


    // =====================================================
    // ACTION CONFIG
    // =====================================================

    const actionConfig = {

        add: {
            icon: <UserPlus size={16} />,
            label: "Add Friend",
            className: "",
        },

        pending: {
            icon: <Clock size={16} />,
            label: "Sent",
            className: "pending",
        },

        accept: {
            icon: <UserCheck size={16} />,
            label: "Accept",
            className: "accept",
        },

        reject: {
            icon: <UserX size={16} />,
            label: "Reject",
            className: "reject",
        },

    };


    const config =
        actionConfig[action] ||
        actionConfig.add;


    return (

        <div className="friend-card">

            {/* ================================================= */}
            {/* AVATAR */}
            {/* ================================================= */}

            <div className="friend-card-avatar">

                <Avatar
                    name={name}
                    image={avatar}
                    online={online}
                    size="md"
                />

            </div>


            {/* ================================================= */}
            {/* USER INFO */}
            {/* ================================================= */}

            <div className="friend-details">

                <h3>
                    {name}
                </h3>


                <span className="friend-username">
                    @{username}
                </span>


                <p>
                    {user.status ||
                        "Available on DevChat"}
                </p>

            </div>


            {/* ================================================= */}
            {/* ACTION */}
            {/* ================================================= */}

            {onAction && (

                <button
                    type="button"
                    className={`
                        friend-action
                        ${config.className}
                    `}
                    disabled={
                        loading ||
                        action === "pending"
                    }
                    onClick={() =>
                        onAction(user)
                    }
                >

                    {config.icon}

                    {config.label}

                </button>

            )}

        </div>

    );

}


export default FriendCard;