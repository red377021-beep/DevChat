import "./CallInfo.css";

import {
    ArrowLeft,
    Phone,
    Video,
    Clock3,
    CalendarDays,
    User,
    PhoneIncoming,
    PhoneOutgoing,
    PhoneMissed,
    MessageCircle,
    MoreVertical,
} from "lucide-react";


function CallInfo({
    call = {},
    onBack,
    onCall,
    onVideoCall,
    onMessage,
    onMore,
}) {

    const {
        name = "Unknown User",
        username = "",
        avatar = "",
        initials = "U",
        type = "voice",
        status = "incoming",
        duration = "00:00",
        date = "Today",
        time = "12:00 PM",
    } = call;


    const isVideo = type === "video";

    const getStatusIcon = () => {
        if (status === "missed") {
            return <PhoneMissed size={18} />;
        }

        if (status === "outgoing") {
            return <PhoneOutgoing size={18} />;
        }

        return <PhoneIncoming size={18} />;
    };


    const getStatusText = () => {
        if (status === "missed") {
            return "Missed call";
        }

        if (status === "outgoing") {
            return "Outgoing call";
        }

        return "Incoming call";
    };


    return (
        <section className="call-info">

            {/* HEADER */}
            <header className="call-info__header">

                <button
                    className="call-info__icon-btn"
                    onClick={onBack}
                    aria-label="Go back"
                >
                    <ArrowLeft size={21} />
                </button>

                <div className="call-info__header-title">
                    <h2>Call Info</h2>
                    <span>Call details</span>
                </div>

                <button
                    className="call-info__icon-btn"
                    onClick={onMore}
                    aria-label="More options"
                >
                    <MoreVertical size={21} />
                </button>

            </header>


            {/* PROFILE */}
            <div className="call-info__profile">

                <div className="call-info__avatar">

                    {avatar ? (
                        <img
                            src={avatar}
                            alt={name}
                        />
                    ) : (
                        <span>
                            {initials}
                        </span>
                    )}

                    <div className="call-info__online-dot" />

                </div>

                <h1>{name}</h1>

                {username && (
                    <p className="call-info__username">
                        @{username}
                    </p>
                )}

                <span className="call-info__type">
                    {isVideo ? (
                        <Video size={15} />
                    ) : (
                        <Phone size={15} />
                    )}

                    {isVideo ? "Video Call" : "Voice Call"}
                </span>

            </div>


            {/* DETAILS */}
            <div className="call-info__details">

                <div className="call-info__detail">

                    <div className="call-info__detail-icon">
                        {getStatusIcon()}
                    </div>

                    <div>
                        <span>Call status</span>
                        <strong>{getStatusText()}</strong>
                    </div>

                </div>


                <div className="call-info__detail">

                    <div className="call-info__detail-icon">
                        <Clock3 size={18} />
                    </div>

                    <div>
                        <span>Duration</span>
                        <strong>{duration}</strong>
                    </div>

                </div>


                <div className="call-info__detail">

                    <div className="call-info__detail-icon">
                        <CalendarDays size={18} />
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>{date}</strong>
                    </div>

                </div>


                <div className="call-info__detail">

                    <div className="call-info__detail-icon">
                        <Clock3 size={18} />
                    </div>

                    <div>
                        <span>Time</span>
                        <strong>{time}</strong>
                    </div>

                </div>

            </div>


            {/* ACTIONS */}
            <div className="call-info__actions">

                <button
                    className="call-info__action"
                    onClick={onCall}
                >
                    <Phone size={19} />
                    <span>Call</span>
                </button>


                <button
                    className="call-info__action"
                    onClick={onVideoCall}
                >
                    <Video size={19} />
                    <span>Video</span>
                </button>


                <button
                    className="call-info__action"
                    onClick={onMessage}
                >
                    <MessageCircle size={19} />
                    <span>Message</span>
                </button>

            </div>


            {/* FOOTER INFO */}
            <div className="call-info__footer">

                <User size={16} />

                <span>
                    Call information is private and visible only to you.
                </span>

            </div>

        </section>
    );
}


export default CallInfo;