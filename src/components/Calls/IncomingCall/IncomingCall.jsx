import "./IncomingCall.css";

import {
    Phone,
    PhoneOff,
    Video,
    Volume2,
} from "lucide-react";


function IncomingCall({
    call = {},
    onAccept,
    onReject,
}) {

    const {
        name = "Unknown User",
        username = "",
        avatar = "",
        type = "voice",
    } = call;

    const isVideo = String(type).toLowerCase() === "video";

    const displayName = String(name || "Unknown User");

    const initials =
        displayName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase() || "U";


    return (
        <div className="incoming-call-overlay">

            <div className="incoming-call-card">

                <div className="incoming-call-glow" />


                {/* ICON */}

                <div className="incoming-call-type">
                    {isVideo ? (
                        <Video size={17} />
                    ) : (
                        <Phone size={17} />
                    )}
                </div>


                {/* AVATAR */}

                <div className="incoming-call-avatar">

                    {avatar ? (
                        <img
                            src={avatar}
                            alt={`${displayName} profile`}
                        />
                    ) : (
                        <div className="incoming-call-avatar-fallback">
                            {initials}
                        </div>
                    )}

                </div>


                {/* INFO */}

                <div className="incoming-call-info">

                    <span className="incoming-call-label">
                        Incoming {isVideo ? "video" : "voice"} call
                    </span>

                    <h2>{displayName}</h2>

                    {username && (
                        <span className="incoming-call-username">
                            @{String(username).replace(/^@/, "")}
                        </span>
                    )}

                    <div className="incoming-call-ringing">
                        <span />
                        <span />
                        <span />
                        Ringing...
                    </div>

                </div>


                {/* ACTIONS */}

                <div className="incoming-call-actions">

                    <button
                        type="button"
                        className="incoming-call-reject"
                        onClick={() => onReject?.(call)}
                        aria-label="Reject call"
                        title="Reject"
                    >
                        <PhoneOff size={21} />
                    </button>


                    <button
                        type="button"
                        className="incoming-call-speaker"
                        aria-label="Speaker"
                        title="Speaker"
                    >
                        <Volume2 size={19} />
                    </button>


                    <button
                        type="button"
                        className="incoming-call-accept"
                        onClick={() => onAccept?.(call)}
                        aria-label="Accept call"
                        title="Accept"
                    >
                        {isVideo ? (
                            <Video size={22} />
                        ) : (
                            <Phone size={22} />
                        )}
                    </button>

                </div>

            </div>

        </div>
    );
}


export default IncomingCall;