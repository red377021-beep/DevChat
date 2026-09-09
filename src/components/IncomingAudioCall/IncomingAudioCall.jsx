import "./IncomingAudioCall.css";

import {
    Phone,
    PhoneOff
} from "lucide-react";


function IncomingAudioCall({
    callerName = "DevChat",
    callerAvatar = "D",
    onAccept,
    onDecline
}) {

    return (

        <div className="incoming-audio-overlay">

            <div className="incoming-audio-card">

                {/* =========================================
                    CALLER AVATAR
                ========================================= */}

                <div className="incoming-audio-avatar">

                    {callerAvatar}

                </div>


                {/* =========================================
                    CALLER INFO
                ========================================= */}

                <div className="incoming-audio-info">

                    <span className="incoming-audio-label">
                        Incoming Voice Call
                    </span>

                    <h2>
                        {callerName}
                    </h2>

                    <span className="incoming-audio-status">
                        Calling...
                    </span>

                </div>


                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="incoming-audio-actions">

                    {/* =====================================
                        DECLINE
                    ===================================== */}

                    <button
                        type="button"
                        className="incoming-audio-decline"
                        onClick={onDecline}
                        aria-label="Decline voice call"
                        title="Decline"
                    >
                        <PhoneOff size={24} />
                    </button>


                    {/* =====================================
                        ACCEPT
                    ===================================== */}

                    <button
                        type="button"
                        className="incoming-audio-accept"
                        onClick={onAccept}
                        aria-label="Accept voice call"
                        title="Accept"
                    >
                        <Phone size={24} />
                    </button>

                </div>

            </div>

        </div>

    );

}


export default IncomingAudioCall;