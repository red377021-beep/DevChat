import "./ActiveCall.css";

import {
    Phone,
    PhoneOff,
    Video,
    VideoOff,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    MoreVertical,
    Maximize2,
} from "lucide-react";

import { useEffect, useState } from "react";


function ActiveCall({
    call = {},
    onEnd,
    onToggleMute,
    onToggleCamera,
    onToggleSpeaker,
    onMore,
}) {

    const {
        name = "Unknown User",
        avatar = "",
        type = "voice",
    } = call;

    const isVideo = String(type).toLowerCase() === "video";

    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(!isVideo);
    const [speakerOn, setSpeakerOn] = useState(true);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((value) => value + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDuration = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };

    const displayName = String(name || "Unknown User");

    const initials =
        displayName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase() || "U";


    const handleMute = () => {
        const nextValue = !muted;

        setMuted(nextValue);
        onToggleMute?.(nextValue);
    };


    const handleCamera = () => {
        const nextValue = !cameraOff;

        setCameraOff(nextValue);
        onToggleCamera?.(nextValue);
    };


    const handleSpeaker = () => {
        const nextValue = !speakerOn;

        setSpeakerOn(nextValue);
        onToggleSpeaker?.(nextValue);
    };


    return (
        <section className={`active-call ${isVideo ? "video-call" : "voice-call"}`}>

            <div className="active-call-background" />


            {/* TOP BAR */}

            <div className="active-call-topbar">

                <div className="active-call-status">
                    <span className="active-call-live-dot" />
                    <span>Connected</span>
                    <strong>{formatDuration(seconds)}</strong>
                </div>


                <div className="active-call-top-actions">

                    <button
                        type="button"
                        onClick={onMore}
                        aria-label="More call options"
                        title="More options"
                    >
                        <MoreVertical size={19} />
                    </button>

                    {isVideo && (
                        <button
                            type="button"
                            aria-label="Fullscreen"
                            title="Fullscreen"
                        >
                            <Maximize2 size={17} />
                        </button>
                    )}

                </div>

            </div>


            {/* CALL AREA */}

            <div className="active-call-stage">

                {isVideo && !cameraOff ? (
                    <div className="active-call-video-placeholder">
                        <span>Video connected</span>
                    </div>
                ) : (
                    <div className="active-call-avatar">

                        {avatar ? (
                            <img
                                src={avatar}
                                alt={`${displayName} profile`}
                            />
                        ) : (
                            <div className="active-call-avatar-fallback">
                                {initials}
                            </div>
                        )}

                    </div>
                )}


                <div className="active-call-user-info">

                    <h2>{displayName}</h2>

                    <span>
                        {isVideo ? "Video call" : "Voice call"}
                    </span>

                </div>

            </div>


            {/* CONTROLS */}

            <div className="active-call-controls">

                <button
                    type="button"
                    className={`active-call-control ${
                        muted ? "active" : ""
                    }`}
                    onClick={handleMute}
                    title={muted ? "Unmute microphone" : "Mute microphone"}
                    aria-label={
                        muted
                            ? "Unmute microphone"
                            : "Mute microphone"
                    }
                >
                    {muted ? (
                        <MicOff size={20} />
                    ) : (
                        <Mic size={20} />
                    )}
                </button>


                {isVideo && (
                    <button
                        type="button"
                        className={`active-call-control ${
                            cameraOff ? "active" : ""
                        }`}
                        onClick={handleCamera}
                        title={
                            cameraOff
                                ? "Turn camera on"
                                : "Turn camera off"
                        }
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
                    className={`active-call-control ${
                        speakerOn ? "active" : ""
                    }`}
                    onClick={handleSpeaker}
                    title={
                        speakerOn
                            ? "Turn speaker off"
                            : "Turn speaker on"
                    }
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
                    className="active-call-end"
                    onClick={() => onEnd?.(call)}
                    title="End call"
                    aria-label="End call"
                >
                    <PhoneOff size={21} />
                </button>

            </div>

        </section>
    );
}


export default ActiveCall;