import "./CallCard.css";

import {
    Phone,
    Video,
    PhoneIncoming,
    PhoneOutgoing,
    PhoneMissed,
    Clock3,
    MoreVertical,
    User,
} from "lucide-react";


function CallCard({
    call = {},
    onCall,
    onVideoCall,
    onMore,
}) {

    const {
        id = `call-${Date.now()}`,
        name = "Unknown User",
        username = "",
        avatar = "",
        type = "voice",
        status = "completed",
        direction = "incoming",
        duration = "",
        time = "",
        missed = false,
    } = call;


    const normalizedType = String(type).toLowerCase();
    const normalizedDirection = String(direction).toLowerCase();
    const normalizedStatus = String(status).toLowerCase();

    const isVideo = normalizedType === "video";

    const isMissed =
        missed ||
        normalizedStatus === "missed" ||
        normalizedDirection === "missed";

    const isOutgoing =
        normalizedDirection === "outgoing" ||
        normalizedDirection === "out";

    const displayName = String(name || "Unknown User");
    const displayUsername = String(username || "");

    const initials = displayName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase() || "U";


    const getDirectionIcon = () => {

        if (isMissed) {
            return <PhoneMissed size={14} />;
        }

        if (isOutgoing) {
            return <PhoneOutgoing size={14} />;
        }

        return <PhoneIncoming size={14} />;
    };


    const handleCall = (event) => {

        event.stopPropagation();

        if (isVideo) {
            onVideoCall?.(call);
            return;
        }

        onCall?.(call);
    };


    const handleMore = (event) => {

        event.stopPropagation();

        onMore?.(call);
    };


    const handleKeyDown = (event) => {

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCall(event);
        }
    };


    return (
        <article
            className={`call-card ${isMissed ? "missed" : ""}`}
            data-call-id={id}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >

            {/* =====================================================
                AVATAR
            ====================================================== */}

            <div className="call-card-avatar">

                {avatar ? (
                    <img
                        src={avatar}
                        alt={`${displayName} profile`}
                    />
                ) : (
                    <div className="call-card-avatar-fallback">
                        {initials}
                    </div>
                )}

                <span
                    className={`call-card-type ${
                        isVideo ? "video" : "voice"
                    }`}
                    title={isVideo ? "Video call" : "Voice call"}
                >
                    {isVideo ? (
                        <Video size={13} />
                    ) : (
                        <Phone size={13} />
                    )}
                </span>

            </div>


            {/* =====================================================
                CALL CONTENT
            ====================================================== */}

            <div className="call-card-content">

                <div className="call-card-top">

                    <div className="call-card-user">

                        <h3 className="call-card-name">
                            {displayName}
                        </h3>

                        {displayUsername && (
                            <span className="call-card-username">
                                @{displayUsername.replace(/^@/, "")}
                            </span>
                        )}

                    </div>

                </div>


                <div className="call-card-meta">

                    <span
                        className={`call-card-direction ${
                            isMissed ? "missed" : ""
                        }`}
                    >
                        {getDirectionIcon()}

                        <span>
                            {isMissed
                                ? "Missed call"
                                : isOutgoing
                                    ? "Outgoing call"
                                    : "Incoming call"}
                        </span>
                    </span>


                    {duration && !isMissed && (
                        <span className="call-card-duration">
                            <Clock3 size={13} />
                            {duration}
                        </span>
                    )}


                    {time && (
                        <time className="call-card-time">
                            {time}
                        </time>
                    )}

                </div>

            </div>


            {/* =====================================================
                ACTIONS
            ====================================================== */}

            <div className="call-card-actions">

                <button
                    type="button"
                    className={`call-card-action ${
                        isVideo ? "video-action" : ""
                    }`}
                    onClick={handleCall}
                    title={isVideo ? "Start video call" : "Call"}
                    aria-label={
                        isVideo
                            ? `Start video call with ${displayName}`
                            : `Call ${displayName}`
                    }
                >
                    {isVideo ? (
                        <Video size={18} />
                    ) : (
                        <Phone size={18} />
                    )}
                </button>


                <button
                    type="button"
                    className="call-card-action more"
                    onClick={handleMore}
                    title="More options"
                    aria-label={`More options for ${displayName}`}
                >
                    <MoreVertical size={18} />
                </button>

            </div>

        </article>
    );
}


export default CallCard;