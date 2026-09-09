import { useRef, useState } from "react";

function useRecorder() {

    const mediaRecorderRef = useRef(null);

    const streamRef = useRef(null);

    const chunksRef = useRef([]);

    const timerRef = useRef(null);

    const [recording, setRecording] = useState(false);

    const [duration, setDuration] = useState(0);

    const [audio, setAudio] = useState(null);

    const [blob, setBlob] = useState(null);

    // ======================================================
    // Start Recording
    // ======================================================

    async function startRecording() {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({

                audio: true

            });

            streamRef.current = stream;

            chunksRef.current = [];

            setAudio(null);

            setBlob(null);

            setDuration(0);

            const recorder = new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {

                if (event.data.size > 0) {

                    chunksRef.current.push(event.data);

                }

            };

            recorder.onstop = () => {

                const audioBlob = new Blob(

                    chunksRef.current,

                    {

                        type: "audio/webm"

                    }

                );

                const audioUrl = URL.createObjectURL(audioBlob);

                setBlob(audioBlob);

                setAudio(audioUrl);

                setRecording(false);

                clearInterval(timerRef.current);

                streamRef.current?.getTracks().forEach(track => track.stop());

            };

            recorder.start();

            setRecording(true);

            timerRef.current = setInterval(() => {

                setDuration(prev => prev + 1);

            }, 1000);

        }

        catch (error) {

            console.error(error);

            alert("Microphone permission denied.");

        }

    }

    // ======================================================
    // Stop Recording
    // ======================================================

    function stopRecording() {

        if (

            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"

        ) {

            mediaRecorderRef.current.stop();

        }

    }

    // ======================================================
    // Reset
    // ======================================================

    function resetRecording() {

        clearInterval(timerRef.current);

        setRecording(false);

        setDuration(0);

        setAudio(null);

        setBlob(null);

        chunksRef.current = [];

        streamRef.current?.getTracks().forEach(track => track.stop());

    }

    return {

        recording,

        duration,

        audio,

        blob,

        startRecording,

        stopRecording,

        resetRecording

    };

}

export default useRecorder;