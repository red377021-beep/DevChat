import "./CallHistory.css";

import {
    Phone,
    PhoneIncoming,
    PhoneOutgoing,
    PhoneMissed,
    Video,
    Trash2,
    Clock3
} from "lucide-react";

import { useState } from "react";

function CallHistory({
    onAudioCall,
    onVideoCall
}) {

    // =====================================================
    // CALL HISTORY DATA
    // =====================================================

    const [calls, setCalls] = useState([
        {
            id: 1,
            name: "Kinza",
            avatar: "K",
            type: "audio",
            direction: "incoming",
            status: "completed",
            duration: "04:32",
            time: "Today, 6:42 PM"
        },
        {
            id: 2,
            name: "Abdullah",
            avatar: "A",
            type: "video",
            direction: "outgoing",
            status: "completed",
            duration: "12:18",
            time: "Today, 4:20 PM"
        },
        {
            id: 3,
            name: "Mishael",
            avatar: "M",
            type: "audio",
            direction: "incoming",
            status: "missed",
            duration: null,
            time: "Yesterday, 9:15 PM"
        },
        {
            id: 4,
            name: "Pihuu",
            avatar: "P",
            type: "video",
            direction: "outgoing",
            status: "completed",
            duration: "08:41",
            time: "Yesterday, 6:05 PM"
        }
    ]);


    // =====================================================
    // CLEAR HISTORY
    // =====================================================

    function clearHistory() {

        setCalls([]);

    }


    // =====================================================
    // START CALL
    // =====================================================

    function handleCall(call) {

        if (!call) {
            return;
        }


        if (call.type === "video") {

            if (typeof onVideoCall === "function") {
                onVideoCall(call);
            }

            return;
        }


        if (typeof onAudioCall === "function") {
            onAudioCall(call);
        }

    }


    // =====================================================
    // CALL TYPE
    // =====================================================

    function renderCallIcon(call) {

        if (call.status === "missed") {

            return (
                <PhoneMissed size={15} />
            );

        }


        if (call.direction === "incoming") {

            return (
                <PhoneIncoming size={15} />
            );

        }


        return (
            <PhoneOutgoing size={15} />
        );

    }


    // =====================================================
    // CALL LABEL
    // =====================================================

    function getCallLabel(call) {

        if (call.status === "missed") {
            return "Missed call";
        }


        if (call.direction === "incoming") {
            return "Incoming call";
        }


        return "Outgoing call";

    }


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (!calls.length) {

        return (

            <div className="call-history">

                <div className="call-history-header">

                    <div className="call-history-title">

                        <div className="call-history-title-icon">

                            <Phone size={19} />

                        </div>

                        <div>

                            <h2>
                                Calls
                            </h2>

                            <span>
                                Recent call activity
                            </span>

                        </div>

                    </div>

                </div>


                <div className="call-history-empty">

                    <div className="call-history-empty-icon">

                        <Clock3 size={28} />

                    </div>

                    <h3>
                        No recent calls
                    </h3>

                    <p>
                        Your recent audio and video calls
                        will appear here.
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="call-history">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="call-history-header">

                <div className="call-history-title">

                    <div className="call-history-title-icon">

                        <Phone size={19} />

                    </div>


                    <div>

                        <h2>
                            Calls
                        </h2>

                        <span>
                            Recent call activity
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="call-history-clear"
                    onClick={clearHistory}
                    title="Clear call history"
                    aria-label="Clear call history"
                >

                    <Trash2 size={15} />

                    <span>
                        Clear
                    </span>

                </button>

            </div>


            {/* =================================================
                CALL LIST
            ================================================= */}

            <div className="call-history-list">


                {calls.map(call => (

                    <div
                        key={call.id}
                        className={`call-history-item ${
                            call.status === "missed"
                                ? "missed"
                                : ""
                        }`}
                    >


                        {/* =====================================
                            AVATAR
                        ===================================== */}

                        <div className="call-history-avatar">

                            {call.avatar}

                        </div>


                        {/* =====================================
                            INFORMATION
                        ===================================== */}

                        <div className="call-history-info">


                            <div className="call-history-name-row">

                                <span className="call-history-name">

                                    {call.name}

                                </span>

                            </div>


                            <div className="call-history-details">

                                {renderCallIcon(call)}

                                <span>
                                    {getCallLabel(call)}
                                </span>


                                <span>
                                    •
                                </span>


                                {call.type === "video" ? (

                                    <Video size={14} />

                                ) : (

                                    <Phone size={14} />

                                )}


                                <span>
                                    {call.type === "video"
                                        ? "Video"
                                        : "Audio"
                                    }
                                </span>


                                {call.duration && (

                                    <>
                                        <span>
                                            •
                                        </span>

                                        <span>
                                            {call.duration}
                                        </span>
                                    </>

                                )}

                            </div>

                        </div>


                        {/* =====================================
                            RIGHT SIDE
                        ===================================== */}

                        <div className="call-history-meta">


                            <span className="call-history-time">

                                {call.time}

                            </span>


                            <button
                                type="button"
                                className="call-history-action"
                                onClick={() =>
                                    handleCall(call)
                                }
                                title={
                                    call.type === "video"
                                        ? "Video call"
                                        : "Audio call"
                                }
                                aria-label={
                                    call.type === "video"
                                        ? `Video call ${call.name}`
                                        : `Audio call ${call.name}`
                                }
                            >

                                {call.type === "video" ? (

                                    <Video size={17} />

                                ) : (

                                    <Phone size={17} />

                                )}

                            </button>

                        </div>


                    </div>

                ))}


            </div>


        </div>

    );

}


export default CallHistory;