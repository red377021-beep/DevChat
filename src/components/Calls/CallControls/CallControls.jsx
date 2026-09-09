import "./CallControls.css";

import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Volume2,
    VolumeX,
    PhoneOff,
    MoreVertical,
} from "lucide-react";


function CallControls({
    muted = false,
    cameraOff = false,
    speakerOn = true,
    isVideo = false,
    onToggleMute,
    onToggleCamera,
    onToggleSpeaker,
    onEnd,
    onMore,
}) {

    return (
        <div className="call-controls">

            <button
                type="button"
                className={`call-control ${muted ? "active" : ""}`}
                onClick={onToggleMute}
                title={muted ? "Unmute" : "Mute"}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
            >
                {muted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>


            {isVideo && (
                <button
                    type="button"
                    className={`call-control ${cameraOff ? "active" : ""}`}
                    onClick={onToggleCamera}
                    title={cameraOff ? "Turn camera on" : "Turn camera off"}
                    aria-label={
                        cameraOff
                            ? "Turn camera on"
                            : "Turn camera off"
                    }
                >
                    {cameraOff ? (
                        <VideoOff size={20} />
                    ) : (
                        <Video size={20} />
                    )}
                </button>
            )}


            <button
                type="button"
                className={`call-control ${speakerOn ? "active" : ""}`}
                onClick={onToggleSpeaker}
                title={speakerOn ? "Speaker off" : "Speaker on"}
                aria-label={
                    speakerOn
                        ? "Turn speaker off"
                        : "Turn speaker on"
                }
            >
                {speakerOn ? (
                    <Volume2 size={20} />
                ) : (
                    <VolumeX size={20} />
                )}
            </button>


            <button
                type="button"
                className="call-control more"
                onClick={onMore}
                title="More options"
                aria-label="More call options"
            >
                <MoreVertical size={20} />
            </button>


            <button
                type="button"
                className="call-control end"
                onClick={onEnd}
                title="End call"
                aria-label="End call"
            >
                <PhoneOff size={21} />
            </button>

        </div>
    );
}


export default CallControls;