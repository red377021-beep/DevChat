import "./VoiceRecorder.css";

import {

    Mic,
    Square,
    Send,
    Trash2,
    Play,
    Pause

} from "lucide-react";

import { useEffect, useRef, useState } from "react";

import RecordingTimer from "./RecordingTimer";
import RecordingVisualizer from "./RecordingVisualizer";

import useRecorder from "./useRecorder";

function VoiceRecorder({

    onSend,
    onCancel

}) {

    const {

        recording,

        duration,

        audio,

        blob,

        startRecording,

        stopRecording,

        resetRecording

    } = useRecorder();

    // ===================================================
    // Player
    // ===================================================

    const playerRef = useRef(null);

    const [playing, setPlaying] = useState(false);

    // ===================================================
    // Stop Recording
    // ===================================================

    function handleStop() {

        stopRecording();

    }

    // ===================================================
    // Play
    // ===================================================

    function handlePlay() {

        if (!playerRef.current) return;

        playerRef.current.play();

        setPlaying(true);

    }

    // ===================================================
    // Pause
    // ===================================================

    function handlePause() {

        if (!playerRef.current) return;

        playerRef.current.pause();

        setPlaying(false);

    }

    // ===================================================
    // Send
    // ===================================================

    function handleSend() {

        if (!audio) return;

        onSend?.({

            audio,

            blob,

            duration

        });

        resetRecording();

    }

    // ===================================================
    // Cancel
    // ===================================================

    function handleCancel() {

        if (playerRef.current) {

            playerRef.current.pause();

        }

        resetRecording();

        onCancel?.();

    }

    // ===================================================
    // Audio End
    // ===================================================

    useEffect(() => {

        const audioPlayer = playerRef.current;

        if (!audioPlayer) return;

        function ended() {

            setPlaying(false);

        }

        audioPlayer.addEventListener("ended", ended);

        return () => {

            audioPlayer.removeEventListener(

                "ended",

                ended

            );

        };

    }, [audio]);

    // ===================================================
    // UI
    // ===================================================

    return (

        <div className="voice-recorder">

            {/* Cancel */}

            <button

                className="voice-action danger"

                onClick={handleCancel}

            >

                <Trash2 size={18}/>

            </button>

            {/* Center */}

            <div className="voice-center">

                <RecordingVisualizer/>

                <RecordingTimer

                    seconds={duration}

                />

            </div>

            {/* Record */}

            {

                !recording && !audio && (

                    <button

                        className="voice-action record"

                        onClick={startRecording}

                    >

                        <Mic size={20}/>

                    </button>

                )

            }

            {/* Stop */}

            {

                recording && (

                    <button

                        className="voice-action stop"

                        onClick={handleStop}

                    >

                        <Square size={18}/>

                    </button>

                )

            }

            {/* Preview */}

            {

                !recording && audio && (

                    <>

                        <audio

                            ref={playerRef}

                            src={audio}

                        />

                        {

                            playing ? (

                                <button

                                    className="voice-action play"

                                    onClick={handlePause}

                                >

                                    <Pause size={18}/>

                                </button>

                            ) : (

                                <button

                                    className="voice-action play"

                                    onClick={handlePlay}

                                >

                                    <Play size={18}/>

                                </button>

                            )

                        }

                        <button

                            className="voice-action send"

                            onClick={handleSend}

                        >

                            <Send size={18}/>

                        </button>

                    </>

                )

            }

        </div>

    );

}

export default VoiceRecorder;