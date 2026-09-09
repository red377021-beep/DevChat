import "./IncomingVideoCall.css";

import {
    Phone,
    PhoneOff,
    Video
} from "lucide-react";


function IncomingVideoCall({
    callerName = "DevChat",
    callerAvatar = "D",
    onAccept,
    onDecline
}) {

    return (

        <div className="incoming-video-overlay">

            <div className="incoming-video-card">

                {/* =========================================
                    CALLER AVATAR
                ========================================= */}

                <div className="incoming-video-avatar">

                    {callerAvatar}

                </div>


                {/* =========================================
                    CALLER INFO
                ========================================= */}

                <div className="incoming-video-info">

                    <span className="incoming-video-label">
                        Incoming Video Call
                    </span>

                    <h2>
                        {callerName}
                    </h2>

                    <div className="incoming-video-status">

                        <span className="incoming-video-dot"></span>

                        Calling...

                    </div>

                </div>


                {/* =========================================
                    CALL TYPE
                ========================================= */}

                <div className="incoming-video-type">

                    <Video size={17} />

                    <span>
                        Video Call
                    </span>

                </div>


                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="incoming-video-actions">

                    {/* DECLINE */}

                    <button
                        type="button"
                        className="incoming-video-decline"
                        onClick={onDecline}
                        title="Decline call"
                        aria-label="Decline call"
                    >

                        <PhoneOff size={23} />

                        <span>
                            Decline
                        </span>

                    </button>


                    {/* ACCEPT */}

                    <button
                        type="button"
                        className="incoming-video-accept"
                        onClick={onAccept}
                        title="Accept video call"
                        aria-label="Accept video call"
                    >

                        <Phone size={23} />

                        <span>
                            Accept
                        </span>

                    </button>

                </div>

            </div>

        </div>

    );

}


export default IncomingVideoCall;