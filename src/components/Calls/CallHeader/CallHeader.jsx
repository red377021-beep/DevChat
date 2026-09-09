import "./CallHeader.css";

import {
    ArrowLeft,
    Search,
    MoreVertical,
    Phone,
    Video,
    PhoneCall,
} from "lucide-react";


function CallHeader({
    title = "Calls",
    subtitle = "",
    onBack,
    onSearch,
    onMore,
    onVoiceCall,
    onVideoCall,
}) {

    return (
        <header className="call-header">

            <div className="call-header-left">

                <button
                    type="button"
                    className="call-header-button back"
                    onClick={onBack}
                    aria-label="Go back"
                    title="Back"
                >
                    <ArrowLeft size={20} />
                </button>


                <div className="call-header-icon">
                    <PhoneCall size={20} />
                </div>


                <div className="call-header-info">

                    <h1>{title}</h1>

                    {subtitle && (
                        <span>{subtitle}</span>
                    )}

                </div>

            </div>


            <div className="call-header-actions">

                <button
                    type="button"
                    className="call-header-button"
                    onClick={onVoiceCall}
                    aria-label="Start voice call"
                    title="Voice call"
                >
                    <Phone size={18} />
                </button>


                <button
                    type="button"
                    className="call-header-button"
                    onClick={onVideoCall}
                    aria-label="Start video call"
                    title="Video call"
                >
                    <Video size={18} />
                </button>


                <button
                    type="button"
                    className="call-header-button"
                    onClick={onSearch}
                    aria-label="Search calls"
                    title="Search"
                >
                    <Search size={18} />
                </button>


                <button
                    type="button"
                    className="call-header-button"
                    onClick={onMore}
                    aria-label="More call options"
                    title="More options"
                >
                    <MoreVertical size={19} />
                </button>

            </div>

        </header>
    );
}


export default CallHeader;