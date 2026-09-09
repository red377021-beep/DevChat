import "./VideoCallModal.css";

import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    PhoneOff
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import { useCall } from "../../context/CallContext";


function VideoCallModal({ onClose }) {

    // =====================================================
    // CALL CONTEXT
    // =====================================================

    const {
        localStream,
        remoteStream,
        connectionState,
        callPeerName,
        callPeerAvatar,
        toggleMicrophone,
        toggleCamera,
        endCall
    } = useCall();


    // =====================================================
    // CALL STATE
    // =====================================================

    const [cameraOn, setCameraOn] =
        useState(true);

    const [micOn, setMicOn] =
        useState(true);

    const [speakerOn, setSpeakerOn] =
        useState(true);

    const [seconds, setSeconds] =
        useState(0);


    // =====================================================
    // VIDEO REFERENCES
    // =====================================================

    const remoteVideoRef =
        useRef(null);

    const localVideoRef =
        useRef(null);


    // =====================================================
    // CONNECTION STATUS
    // =====================================================

    const callStatus =
        connectionState === "connected"
            ? "Connected"
            : connectionState === "connecting"
                ? "Connecting"
                : connectionState === "failed"
                    ? "Call Failed"
                    : connectionState === "disconnected"
                        ? "Disconnected"
                        : "Connecting";


    // =====================================================
    // CONNECT REMOTE VIDEO
    // =====================================================

    useEffect(() => {

        const video =
            remoteVideoRef.current;

        if (!video) {
            return;
        }


        if (!remoteStream) {

            video.srcObject = null;

            return;

        }


        video.srcObject =
            remoteStream;

        video.muted =
            !speakerOn;


        const playVideo =
            async () => {

                try {

                    await video.play();

                } catch (error) {

                    console.warn(
                        "⚠️ Remote video autoplay blocked:",
                        error
                    );

                }

            };


        playVideo();


    }, [
        remoteStream,
        speakerOn
    ]);


    // =====================================================
    // CONNECT LOCAL VIDEO
    // =====================================================

    useEffect(() => {

        const video =
            localVideoRef.current;

        if (!video) {
            return;
        }


        if (!localStream) {

            video.srcObject = null;

            return;

        }


        video.srcObject =
            localStream;

        video.muted =
            true;


        const playVideo =
            async () => {

                try {

                    await video.play();

                } catch (error) {

                    console.warn(
                        "⚠️ Local video autoplay blocked:",
                        error
                    );

                }

            };


        playVideo();


    }, [
        localStream
    ]);


    // =====================================================
    // CALL TIMER
    // =====================================================

    useEffect(() => {

        if (
            connectionState !== "connected"
        ) {

            return;

        }


        const timer =
            window.setInterval(() => {

                setSeconds(prev =>
                    prev + 1
                );

            }, 1000);


        return () => {

            window.clearInterval(timer);

        };

    }, [
        connectionState
    ]);


    // =====================================================
    // FORMAT TIMER
    // =====================================================

    function formatTime(totalSeconds) {

        const minutes =
            Math.floor(
                totalSeconds / 60
            );

        const remainingSeconds =
            totalSeconds % 60;


        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(remainingSeconds).padStart(
            2,
            "0"
        )}`;

    }


    // =====================================================
    // END CALL
    // =====================================================

    function handleEndCall() {

        try {

            endCall?.();

        } catch (error) {

            console.error(
                "❌ Error ending video call:",
                error
            );

        }


        onClose?.();

    }


    // =====================================================
    // ESCAPE
    // =====================================================

    useEffect(() => {

        function handleEscape(event) {

            if (
                event.key === "Escape"
            ) {

                handleEndCall();

            }

        }


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    // =====================================================
    // TOGGLE CAMERA
    // =====================================================

    function handleToggleCamera() {

        try {

            const result =
                toggleCamera?.();


            if (
                typeof result === "boolean"
            ) {

                setCameraOn(result);

            } else {

                setCameraOn(prev =>
                    !prev
                );

            }

        } catch (error) {

            console.error(
                "❌ Camera toggle error:",
                error
            );

        }

    }


    // =====================================================
    // TOGGLE MICROPHONE
    // =====================================================

    function handleToggleMic() {

        try {

            const result =
                toggleMicrophone?.();


            if (
                typeof result === "boolean"
            ) {

                setMicOn(result);

            } else {

                setMicOn(prev =>
                    !prev
                );

            }

        } catch (error) {

            console.error(
                "❌ Microphone toggle error:",
                error
            );

        }

    }


    // =====================================================
    // TOGGLE SPEAKER
    // =====================================================

    function handleToggleSpeaker() {

        setSpeakerOn(prev => {

            const next =
                !prev;


            if (
                remoteVideoRef.current
            ) {

                remoteVideoRef.current.muted =
                    !next;

            }


            return next;

        });

    }


    // =====================================================
    // CALLER DISPLAY
    // =====================================================

    const displayName =
        callPeerName ||
        "DevChat";


    const displayAvatar =
        callPeerAvatar ||
        displayName?.charAt(0)?.toUpperCase() ||
        "D";


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="video-call-overlay">

            <div className="video-call-modal">


                {/* =================================================
                    REMOTE VIDEO
                ================================================= */}

                <div className="video-call-remote">

                    <video
                        ref={remoteVideoRef}
                        className="video-call-remote-video"
                        autoPlay
                        playsInline
                    />


                    {/* =================================================
                        REMOTE USER FALLBACK
                    ================================================= */}

                    {!remoteStream && (

                        <>

                            <div className="video-call-grid"></div>


                            <div className="video-call-avatar">

                                {displayAvatar}

                            </div>

                        </>

                    )}


                    {/* =================================================
                        USER INFO
                    ================================================= */}

                    <div className="video-call-user-info">

                        <strong>
                            {displayName}
                        </strong>

                        <span>

                            {connectionState === "connected"
                                ? formatTime(seconds)
                                : callStatus}

                        </span>

                    </div>


                    {/* =================================================
                        LOCAL PREVIEW
                    ================================================= */}

                    <div className="video-call-local">

                        {cameraOn && localStream ? (

                            <video
                                ref={localVideoRef}
                                className="video-call-local-video"
                                autoPlay
                                muted
                                playsInline
                            />

                        ) : (

                            <div className="video-call-camera-off">

                                <VideoOff size={24} />

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div className="video-call-controls">


                    {/* =================================================
                        CAMERA
                    ================================================= */}

                    <button
                        type="button"
                        className={`video-call-control ${
                            cameraOn
                                ? ""
                                : "is-off"
                        }`}
                        title={
                            cameraOn
                                ? "Turn camera off"
                                : "Turn camera on"
                        }
                        aria-label={
                            cameraOn
                                ? "Turn camera off"
                                : "Turn camera on"
                        }
                        onClick={handleToggleCamera}
                    >

                        {cameraOn ? (
                            <Video size={21} />
                        ) : (
                            <VideoOff size={21} />
                        )}

                    </button>


                    {/* =================================================
                        MICROPHONE
                    ================================================= */}

                    <button
                        type="button"
                        className={`video-call-control ${
                            micOn
                                ? ""
                                : "is-off"
                        }`}
                        title={
                            micOn
                                ? "Mute microphone"
                                : "Unmute microphone"
                        }
                        aria-label={
                            micOn
                                ? "Mute microphone"
                                : "Unmute microphone"
                        }
                        onClick={handleToggleMic}
                    >

                        {micOn ? (
                            <Mic size={21} />
                        ) : (
                            <MicOff size={21} />
                        )}

                    </button>


                    {/* =================================================
                        SPEAKER
                    ================================================= */}

                    <button
                        type="button"
                        className={`video-call-control ${
                            speakerOn
                                ? ""
                                : "is-off"
                        }`}
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
                        onClick={handleToggleSpeaker}
                    >

                        {speakerOn ? (
                            <Volume2 size={21} />
                        ) : (
                            <VolumeX size={21} />
                        )}

                    </button>


                    {/* =================================================
                        END CALL
                    ================================================= */}

                    <button
                        type="button"
                        className="video-call-end"
                        title="End call"
                        aria-label="End video call"
                        onClick={handleEndCall}
                    >

                        <PhoneOff size={22} />

                    </button>

                </div>

            </div>

        </div>

    );

}


export default VideoCallModal;