import { useEffect, useRef, useState } from "react";

function useRecorder() {

    // ===========================================
    // States
    // ===========================================

    const [permission, setPermission] = useState(false);

    const [isRecording, setIsRecording] = useState(false);

    const [isPaused, setIsPaused] = useState(false);

    const [recordingTime, setRecordingTime] = useState(0);

    const [audioBlob, setAudioBlob] = useState(null);

    const [audioURL, setAudioURL] = useState("");

    const [error, setError] = useState("");

    // ===========================================
    // Refs
    // ===========================================

    const mediaRecorderRef = useRef(null);

    const streamRef = useRef(null);

    const chunksRef = useRef([]);

    const timerRef = useRef(null);

    // ===========================================
    // Timer
    // ===========================================

    function startTimer() {

        clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {

            setRecordingTime(prev => prev + 1);

        },1000);

    }

    function stopTimer() {

        clearInterval(timerRef.current);

    }

    // ===========================================
    // Permission
    // ===========================================

    async function requestPermission() {

        try{

            const stream = await navigator.mediaDevices.getUserMedia({

                audio:true

            });

            streamRef.current = stream;

            setPermission(true);

            return stream;

        }

        catch{

            setError("Microphone permission denied.");

            return null;

        }

    }

    // ===========================================
    // Start
    // ===========================================

    async function startRecording(){

        const stream =

            streamRef.current ||

            await requestPermission();

        if(!stream) return;

        chunksRef.current=[];

        const recorder = new MediaRecorder(stream);

        mediaRecorderRef.current=recorder;

        recorder.ondataavailable=(event)=>{

            if(event.data.size>0){

                chunksRef.current.push(event.data);

            }

        };

        recorder.onstop=()=>{

            const blob=new Blob(

                chunksRef.current,

                {

                    type:"audio/webm"

                }

            );

            setAudioBlob(blob);

            setAudioURL(

                URL.createObjectURL(blob)

            );

        };

        recorder.start();

        setRecordingTime(0);

        setIsRecording(true);

        setIsPaused(false);

        startTimer();

    }

    // ===========================================
    // Pause
    // ===========================================

    function pauseRecording(){

        if(!mediaRecorderRef.current) return;

        mediaRecorderRef.current.pause();

        setIsPaused(true);

        stopTimer();

    }

    // ===========================================
    // Resume
    // ===========================================

    function resumeRecording(){

        if(!mediaRecorderRef.current) return;

        mediaRecorderRef.current.resume();

        setIsPaused(false);

        startTimer();

    }

    // ===========================================
    // Stop
    // ===========================================

    function stopRecording(){

        if(!mediaRecorderRef.current) return;

        mediaRecorderRef.current.stop();

        stopTimer();

        setIsRecording(false);

        setIsPaused(false);

    }

    // ===========================================
    // Cancel
    // ===========================================

    function cancelRecording(){

        stopTimer();

        if(mediaRecorderRef.current){

            mediaRecorderRef.current.stop();

        }

        setRecordingTime(0);

        setAudioBlob(null);

        setAudioURL("");

        chunksRef.current=[];

        setIsRecording(false);

        setIsPaused(false);

    }

    // ===========================================
    // Cleanup
    // ===========================================

    useEffect(()=>{

        return()=>{

            stopTimer();

            if(streamRef.current){

                streamRef.current

                    .getTracks()

                    .forEach(track=>track.stop());

            }

        };

    },[]);

    // ===========================================
    // Export
    // ===========================================

    return{

        permission,

        isRecording,

        isPaused,

        recordingTime,

        audioBlob,

        audioURL,

        error,

        startRecording,

        stopRecording,

        pauseRecording,

        resumeRecording,

        cancelRecording

    };

}

export default useRecorder;