import { useEffect, useRef, useState } from "react";

function useVoiceRecorder() {

    // ==========================================
    // States
    // ==========================================

    const [isRecording, setIsRecording] = useState(false);

    const [isPaused, setIsPaused] = useState(false);

    const [seconds, setSeconds] = useState(0);

    const [audioBlob, setAudioBlob] = useState(null);

    // ==========================================
    // Refs
    // ==========================================

    const recorderRef = useRef(null);

    const streamRef = useRef(null);

    const chunksRef = useRef([]);

    const timerRef = useRef(null);

    // ==========================================
    // Timer
    // ==========================================

    useEffect(() => {

        if (isRecording && !isPaused) {

            timerRef.current = setInterval(() => {

                setSeconds(prev => prev + 1);

            }, 1000);

        }

        return () => clearInterval(timerRef.current);

    }, [isRecording, isPaused]);

    // ==========================================
    // Start Recording
    // ==========================================

    async function startRecording() {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({

                audio: true

            });

            streamRef.current = stream;

            const recorder = new MediaRecorder(stream);

            recorderRef.current = recorder;

            chunksRef.current = [];

            recorder.ondataavailable = (event) => {

                if (event.data.size > 0) {

                    chunksRef.current.push(event.data);

                }

            };

            recorder.onstop = () => {

                const blob = new Blob(chunksRef.current, {

                    type: "audio/webm"

                });

                setAudioBlob(blob);

            };

            recorder.start();

            setSeconds(0);

            setIsRecording(true);

            setIsPaused(false);

        }

        catch (error) {

            console.error(error);

        }

    }

    // ==========================================
    // Pause
    // ==========================================

    function pauseRecording() {

        recorderRef.current?.pause();

        setIsPaused(true);

    }

    // ==========================================
    // Resume
    // ==========================================

    function resumeRecording() {

        recorderRef.current?.resume();

        setIsPaused(false);

    }

    // ==========================================
    // Stop
    // ==========================================

    function stopRecording() {

        recorderRef.current?.stop();

        streamRef.current?.getTracks().forEach(track => track.stop());

        clearInterval(timerRef.current);

        setIsRecording(false);

        setIsPaused(false);

    }

    // ==========================================
    // Delete
    // ==========================================

    function deleteRecording() {

        setAudioBlob(null);

        setSeconds(0);

    }

    return {

        isRecording,

        isPaused,

        seconds,

        audioBlob,

        startRecording,

        pauseRecording,

        resumeRecording,

        stopRecording,

        deleteRecording

    };

}

export default useVoiceRecorder;