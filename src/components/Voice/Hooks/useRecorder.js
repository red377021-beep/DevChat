// ==========================================================
// DEVCHAT
// Voice Engine V2
// useRecorder
// ==========================================================

import {

    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState

} from "react";

// ==========================================================
// Constants
// ==========================================================

const MAX_RECORD_TIME = 300;

const AUDIO_MIME_TYPES = [

    "audio/webm;codecs=opus",

    "audio/webm",

    "audio/ogg;codecs=opus",

    "audio/mp4"

];

// ==========================================================
// Helpers
// ==========================================================

function getSupportedMimeType() {

    for (const type of AUDIO_MIME_TYPES) {

        if (

            window.MediaRecorder &&

            MediaRecorder.isTypeSupported(type)

        ) {

            return type;

        }

    }

    return "";

}

function formatDuration(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remaining = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;

}

// ==========================================================
// Hook
// ==========================================================

export default function useRecorder() {

    // ======================================================
    // States
    // ======================================================

    const [status, setStatus] = useState("idle");

    const [permission, setPermission] = useState(false);

    const [duration, setDuration] = useState(0);

    const [audioBlob, setAudioBlob] = useState(null);

    const [audioURL, setAudioURL] = useState("");

    const [error, setError] = useState("");

    // ======================================================
    // Refs
    // ======================================================

    const mediaRecorderRef = useRef(null);

    const mediaStreamRef = useRef(null);

    const chunksRef = useRef([]);

    const timerRef = useRef(null);

    const mimeType = useMemo(

        () => getSupportedMimeType(),

        []

    );
        // ======================================================
    // Cleanup Stream
    // ======================================================

    const cleanupStream = useCallback(() => {

        if (mediaStreamRef.current) {

            mediaStreamRef.current

                .getTracks()

                .forEach(track => track.stop());

            mediaStreamRef.current = null;

        }

    }, []);

    // ======================================================
    // Reset Recording
    // ======================================================

    const resetRecording = useCallback(() => {

        chunksRef.current = [];

        setDuration(0);

        setAudioBlob(null);

        setError("");

        if (audioURL) {

            URL.revokeObjectURL(audioURL);

        }

        setAudioURL("");

    }, [audioURL]);

    // ======================================================
    // Request Permission
    // ======================================================

    const requestPermission = useCallback(async () => {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({

                audio: true

            });

            stream.getTracks().forEach(track => track.stop());

            setPermission(true);

            setError("");

            return true;

        }

        catch (err) {

            console.error("Microphone Permission:", err);

            setPermission(false);

            setError("Microphone permission denied.");

            return false;

        }

    }, []);

    // ======================================================
    // Initialize Recorder
    // ======================================================

    const initializeRecorder = useCallback(async () => {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({

                audio: {

                    echoCancellation: true,

                    noiseSuppression: true,

                    autoGainControl: true

                }

            });

            mediaStreamRef.current = stream;

            chunksRef.current = [];

            const recorder = new MediaRecorder(stream, {

                mimeType

            });

            mediaRecorderRef.current = recorder;

            return recorder;

        }

        catch (err) {

            console.error("Recorder Init Error:", err);

            setError("Unable to access microphone.");

            cleanupStream();

            return null;

        }

    }, [cleanupStream, mimeType]);
        // ======================================================
    // Timer
    // ======================================================

    const startTimer = useCallback(() => {

        clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {

            setDuration(previous => {

                const next = previous + 1;

                if (next >= MAX_RECORD_TIME) {

                    stopRecording();

                }

                return next;

            });

        }, 1000);

    }, []);

    const stopTimer = useCallback(() => {

        clearInterval(timerRef.current);

        timerRef.current = null;

    }, []);

    // ======================================================
    // Start Recording
    // ======================================================

    const startRecording = useCallback(async () => {

        resetRecording();

        const recorder = await initializeRecorder();

        if (!recorder) return;

        recorder.ondataavailable = (event) => {

            if (event.data.size > 0) {

                chunksRef.current.push(event.data);

            }

        };

        recorder.start(100);

        setStatus("recording");

        startTimer();

    }, [

        initializeRecorder,

        resetRecording,

        startTimer

    ]);

    // ======================================================
    // Pause Recording
    // ======================================================

    const pauseRecording = useCallback(() => {

        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.pause();

        stopTimer();

        setStatus("paused");

    }, [stopTimer]);

    // ======================================================
    // Resume Recording
    // ======================================================

    const resumeRecording = useCallback(() => {

        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.resume();

        startTimer();

        setStatus("recording");

    }, [startTimer]);
    
        // ======================================================
    // Stop Recording
    // ======================================================

    const stopRecording = useCallback(() => {

        const recorder = mediaRecorderRef.current;

        if (!recorder) return;

        if (recorder.state === "inactive") return;

        stopTimer();

        recorder.onstop = () => {

            const blob = new Blob(

                chunksRef.current,

                {

                    type: mimeType || "audio/webm"

                }

            );

            const url = URL.createObjectURL(blob);

            setAudioBlob(blob);

            setAudioURL(url);

            setStatus("preview");

            cleanupStream();

        };

        recorder.stop();

    }, [

        cleanupStream,

        mimeType,

        stopTimer

    ]);

    // ======================================================
    // Delete Recording
    // ======================================================

    const deleteRecording = useCallback(() => {

        stopTimer();

        cleanupStream();

        resetRecording();

        setStatus("idle");

    }, [

        cleanupStream,

        resetRecording,

        stopTimer

    ]);

    // ======================================================
    // Cleanup
    // ======================================================

    useEffect(() => {

        return () => {

            stopTimer();

            cleanupStream();

            if (audioURL) {

                URL.revokeObjectURL(audioURL);

            }

        };

    }, [

        audioURL,

        cleanupStream,

        stopTimer

    ]);

    // ======================================================
    // Public API
    // ======================================================

    return {

        status,

        permission,

        duration,

        audioBlob,

        audioURL,

        error,

        formatDuration,

        requestPermission,

        startRecording,

        pauseRecording,

        resumeRecording,

        stopRecording,

        deleteRecording

    };

}
