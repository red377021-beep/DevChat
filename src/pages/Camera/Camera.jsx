import "./Camera.css";

import {
    Camera as CameraIcon,
    Image as ImageIcon,
    Video,
    X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";


function Camera() {

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [cameraStarted, setCameraStarted] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const [capturedImage, setCapturedImage] = useState(null);
    const [isRecording, setIsRecording] = useState(false);


    // =====================================================
    // START CAMERA
    // =====================================================

    const startCamera = async () => {

        try {

            setCameraError("");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setCameraStarted(true);

        } catch (error) {

            console.error("Camera error:", error);

            setCameraError(
                "Camera access denied or unavailable."
            );

        }

    };


    // =====================================================
    // STOP CAMERA
    // =====================================================

    const stopCamera = () => {

        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            streamRef.current = null;

        }

        setCameraStarted(false);
        setIsRecording(false);

    };


    // =====================================================
    // TAKE PHOTO
    // =====================================================

    const takePhoto = () => {

        if (!videoRef.current) {
            return;
        }

        const video = videoRef.current;

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const image = canvas.toDataURL("image/jpeg");

        setCapturedImage(image);

    };


    // =====================================================
    // TOGGLE RECORDING
    // =====================================================

    const toggleRecording = () => {

        setIsRecording((previous) => !previous);

    };


    // =====================================================
    // CLEANUP
    // =====================================================

    useEffect(() => {

        return () => {
            stopCamera();
        };

    }, []);


    return (
        <section className="camera-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="camera-header">

                <div className="camera-title">

                    <CameraIcon size={20} />

                    <span>
                        Camera
                    </span>

                </div>

            </header>


            {/* =================================================
                CAMERA AREA
            ================================================= */}

            <main className="camera-content">

                {!cameraStarted && !capturedImage && (

                    <div className="camera-start-screen">

                        <div className="camera-start-icon">

                            <CameraIcon size={42} />

                        </div>

                        <h2>
                            DevChat Camera
                        </h2>

                        <p>
                            Take photos or record videos
                            directly from DevChat.
                        </p>


                        {cameraError && (
                            <div className="camera-error">
                                {cameraError}
                            </div>
                        )}


                        <button
                            type="button"
                            className="camera-start-button"
                            onClick={startCamera}
                        >
                            <CameraIcon size={18} />

                            Open Camera
                        </button>

                    </div>

                )}


                {cameraStarted && !capturedImage && (

                    <div className="camera-preview-wrapper">

                        <video
                            ref={videoRef}
                            className="camera-preview"
                            autoPlay
                            playsInline
                            muted
                        />


                        <div className="camera-controls">

                            <button
                                type="button"
                                className="camera-control secondary"
                                onClick={stopCamera}
                                aria-label="Close camera"
                            >
                                <X size={22} />
                            </button>


                            <button
                                type="button"
                                className={`camera-capture-button ${
                                    isRecording
                                        ? "recording"
                                        : ""
                                }`}
                                onClick={
                                    isRecording
                                        ? toggleRecording
                                        : takePhoto
                                }
                                aria-label={
                                    isRecording
                                        ? "Stop recording"
                                        : "Take photo"
                                }
                            >
                                <span />
                            </button>


                            <button
                                type="button"
                                className="camera-control secondary"
                                onClick={() => {
                                    // Gallery functionality will be
                                    // connected in the next step.
                                }}
                                aria-label="Open gallery"
                            >
                                <ImageIcon size={22} />
                            </button>

                        </div>

                    </div>

                )}


                {capturedImage && (

                    <div className="camera-preview-wrapper">

                        <img
                            src={capturedImage}
                            alt="Captured"
                            className="camera-captured-image"
                        />


                        <div className="camera-photo-actions">

                            <button
                                type="button"
                                className="camera-control secondary"
                                onClick={() => {
                                    setCapturedImage(null);
                                }}
                            >
                                <X size={22} />

                                Retake
                            </button>


                            <button
                                type="button"
                                className="camera-start-button"
                                onClick={() => {
                                    setCapturedImage(null);
                                }}
                            >
                                <ImageIcon size={18} />

                                Use Photo
                            </button>

                        </div>

                    </div>

                )}

            </main>

        </section>
    );
}


export default Camera;

