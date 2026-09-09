import "./AudioCall.css";

import {
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


function AudioCall({ onClose }) {

    // =====================================================
    // CALL CONTEXT
    // =====================================================

    const {
        remoteStream,
        connectionState,
        callPeerName,
        callPeerAvatar,
        toggleMicrophone,
        endCall
    } = useCall();


    // =====================================================
    // CALL STATE
    // =====================================================

    const [micOn, setMicOn] =
        useState(true);

    const [speakerOn, setSpeakerOn] =
        useState(true);

    const [seconds, setSeconds] =
        useState(0);


    // =====================================================
    // AUDIO ELEMENT
    // =====================================================

    const remoteAudioRef =
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
    // CONNECT REMOTE AUDIO
    // =====================================================

    useEffect(() => {

        const audio =
            remoteAudioRef.current;

        if (!audio) {
            return;
        }


        if (!remoteStream) {

            audio.srcObject = null;

            return;

        }


        audio.srcObject =
            remoteStream;

        audio.muted =
            !speakerOn;


        const playAudio =
            async () => {

                try {

                    await audio.play();

                } catch (error) {

                    console.warn(
                        "⚠️ Remote audio autoplay blocked:",
                        error
                    );

                }

            };


        playAudio();


    }, [
        remoteStream,
        speakerOn
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
                "❌ Error ending audio call:",
                error
            );

        }


        onClose?.();

    }


    // =====================================================
    // ESCAPE KEY
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

    function toggleSpeaker() {

        setSpeakerOn(prev => {

            const next =
                !prev;


            if (
                remoteAudioRef.current
            ) {

                remoteAudioRef.current.muted =
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

        <div className="audio-call-overlay">

            <div className="audio-call-modal">


                {/* =================================================
                    REMOTE AUDIO
                ================================================= */}

                <audio
                    ref={remoteAudioRef}
                    autoPlay
                    playsInline
                />


                {/* =================================================
                    CALL AVATAR
                ================================================= */}

                <div
                    className={
                        connectionState === "connected"
                            ? "audio-call-avatar connected"
                            : "audio-call-avatar"
                    }
                >

                    {displayAvatar}

                </div>


                {/* =================================================
                    CALLER NAME
                ================================================= */}

                <h2>
                    {displayName}
                </h2>


                {/* =================================================
                    STATUS
                ================================================= */}

                <span className="audio-call-status">

                    {callStatus}

                </span>


                {/* =================================================
                    TIMER
                ================================================= */}

                <span className="audio-call-timer">

                    {connectionState === "connected"
                        ? formatTime(seconds)
                        : "00:00"}

                </span>


                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div className="audio-call-controls">


                    {/* =================================================
                        MICROPHONE
                    ================================================= */}

                    <button
                        type="button"
                        className={
                            micOn
                                ? "audio-call-control"
                                : "audio-call-control is-off"
                        }
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
                        className={
                            speakerOn
                                ? "audio-call-control"
                                : "audio-call-control is-off"
                        }
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
                        onClick={toggleSpeaker}
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
                        className="audio-call-end"
                        title="End call"
                        aria-label="End call"
                        onClick={handleEndCall}
                    >

                        <PhoneOff size={22} />

                    </button>

                </div>

            </div>

        </div>

    );

}


export default AudioCall;