import "./BubbleVideo.css";

import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";


function BubbleVideo({ src }) {

    const videoRef = useRef(null);

    const [videoUrl, setVideoUrl] = useState("");
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [ready, setReady] = useState(false);


    // =====================================================
    // ONE VIDEO PLAY EVENT
    // =====================================================

    const VIDEO_EVENT =
        "devchat-video-play";


    // =====================================================
    // NORMALIZE VIDEO SOURCE + DEBUG
    // =====================================================

    useEffect(() => {

        console.log(
            "================================="
        );

        console.log(
            "BUBBLE VIDEO DEBUG"
        );

        console.log(
            "RAW SRC:",
            src
        );

        console.log(
            "SRC TYPE:",
            typeof src
        );

        console.log(
            "IS FILE:",
            src instanceof File
        );

        console.log(
            "IS BLOB:",
            src instanceof Blob
        );

        console.log(
            "================================="
        );


        // -------------------------------------------------
        // NO SOURCE
        // -------------------------------------------------

        if (!src) {

            console.log(
                "VIDEO SRC EMPTY"
            );

            setVideoUrl("");

            return;

        }


        // -------------------------------------------------
        // FILE / BLOB
        // -------------------------------------------------

        if (
            src instanceof File ||
            src instanceof Blob
        ) {

            const objectUrl =
                URL.createObjectURL(src);


            console.log(
                "VIDEO OBJECT URL:",
                objectUrl
            );

            console.log(
                "FILE TYPE:",
                src.type
            );

            console.log(
                "FILE SIZE:",
                src.size
            );


            setVideoUrl(
                objectUrl
            );


            return () => {

                URL.revokeObjectURL(
                    objectUrl
                );

            };

        }


        // -------------------------------------------------
        // STRING URL
        // -------------------------------------------------

        if (
            typeof src === "string"
        ) {

            console.log(
                "VIDEO STRING URL:",
                src
            );


            setVideoUrl(
                src
            );


            return;

        }


        // -------------------------------------------------
        // OBJECT URL
        // -------------------------------------------------

        if (
            typeof src === "object" &&
            src?.url
        ) {

            console.log(
                "VIDEO OBJECT:",
                src
            );

            console.log(
                "VIDEO OBJECT URL:",
                src.url
            );

            console.log(
                "VIDEO OBJECT TYPE:",
                src.type
            );

            console.log(
                "VIDEO OBJECT NAME:",
                src.name
            );

            console.log(
                "VIDEO OBJECT SIZE:",
                src.size
            );


            setVideoUrl(
                src.url
            );


            return;

        }


        // -------------------------------------------------
        // UNKNOWN SOURCE
        // -------------------------------------------------

        console.log(
            "VIDEO SOURCE COULD NOT BE RESOLVED:",
            src
        );


        setVideoUrl("");

    }, [src]);


    // =====================================================
    // RESET VIDEO STATE
    // =====================================================

    useEffect(() => {

        setPlaying(false);

        setMuted(false);

        setDuration(0);

        setCurrentTime(0);

        setReady(false);

    }, [videoUrl]);


    // =====================================================
    // ONE VIDEO AT A TIME
    // =====================================================

    useEffect(() => {

        function handleAnotherVideoPlay(event) {

            const currentVideo =
                videoRef.current;

            const playingVideo =
                event.detail?.video;


            if (
                !currentVideo ||
                !playingVideo
            ) {

                return;

            }


            if (
                currentVideo !== playingVideo &&
                !currentVideo.paused
            ) {

                currentVideo.pause();

            }

        }


        window.addEventListener(
            VIDEO_EVENT,
            handleAnotherVideoPlay
        );


        return () => {

            window.removeEventListener(
                VIDEO_EVENT,
                handleAnotherVideoPlay
            );

        };

    }, []);


    // =====================================================
    // METADATA
    // =====================================================

    function handleLoadedMetadata() {

        const video =
            videoRef.current;


        if (!video) {

            return;

        }


        console.log(
            "VIDEO METADATA LOADED"
        );

        console.log(
            "VIDEO CURRENT SRC:",
            video.currentSrc
        );

        console.log(
            "VIDEO DURATION:",
            video.duration
        );


        if (
            Number.isFinite(
                video.duration
            )
        ) {

            setDuration(
                video.duration
            );

        }

    }


    // =====================================================
    // READY
    // =====================================================

    function handleLoadedData() {

        console.log(
            "VIDEO LOADED DATA"
        );


        setReady(true);

    }


    // =====================================================
    // TIME UPDATE
    // =====================================================

    function handleTimeUpdate() {

        const video =
            videoRef.current;


        if (!video) {

            return;

        }


        setCurrentTime(
            video.currentTime
        );

    }


    // =====================================================
    // PLAY / PAUSE
    // =====================================================

    async function togglePlay(event) {

        event?.stopPropagation();


        const video =
            videoRef.current;


        if (!video) {

            return;

        }


        try {

            if (
                video.paused
            ) {

                console.log(
                    "TRYING TO PLAY VIDEO"
                );

                console.log(
                    "PLAY URL:",
                    video.currentSrc
                );


                await video.play();

            }
            else {

                video.pause();

            }

        }
        catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "BUBBLE VIDEO PLAY ERROR"
            );

            console.error(
                "ERROR:",
                error
            );

            console.error(
                "ERROR NAME:",
                error?.name
            );

            console.error(
                "ERROR MESSAGE:",
                error?.message
            );

            console.error(
                "VIDEO SRC:",
                video.src
            );

            console.error(
                "VIDEO CURRENT SRC:",
                video.currentSrc
            );

            console.error(
                "VIDEO NETWORK STATE:",
                video.networkState
            );

            console.error(
                "VIDEO READY STATE:",
                video.readyState
            );

            console.error(
                "VIDEO ERROR:",
                video.error
            );

            console.error(
                "VIDEO ERROR CODE:",
                video.error?.code
            );

            console.error(
                "VIDEO ERROR MESSAGE:",
                video.error?.message
            );

            console.error(
                "================================="
            );

        }

    }


    // =====================================================
    // VIDEO EVENTS
    // =====================================================

    function handlePlay() {

        setPlaying(true);


        window.dispatchEvent(
            new CustomEvent(
                VIDEO_EVENT,
                {
                    detail: {
                        video:
                            videoRef.current
                    }
                }
            )
        );

    }


    function handlePause() {

        setPlaying(false);

    }


    function handleEnded() {

        setPlaying(false);

        setCurrentTime(0);

    }


    // =====================================================
    // VIDEO LOAD ERROR
    // =====================================================

    function handleVideoError(event) {

        const video =
            event.currentTarget;


        console.error(
            "================================="
        );

        console.error(
            "VIDEO LOAD ERROR"
        );

        console.error(
            "VIDEO URL:",
            video.src
        );

        console.error(
            "VIDEO CURRENT SRC:",
            video.currentSrc
        );

        console.error(
            "VIDEO NETWORK STATE:",
            video.networkState
        );

        console.error(
            "VIDEO READY STATE:",
            video.readyState
        );

        console.error(
            "VIDEO ERROR:",
            video.error
        );

        console.error(
            "VIDEO ERROR CODE:",
            video.error?.code
        );

        console.error(
            "VIDEO ERROR MESSAGE:",
            video.error?.message
        );

        console.error(
            "================================="
        );

    }


    // =====================================================
    // MUTE
    // =====================================================

    function toggleMute(event) {

        event?.stopPropagation();


        const video =
            videoRef.current;


        if (!video) {

            return;

        }


        video.muted =
            !video.muted;


        setMuted(
            video.muted
        );

    }


    // =====================================================
    // SEEK
    // =====================================================

    function handleSeek(event) {

        event?.stopPropagation();


        const video =
            videoRef.current;


        if (
            !video ||
            !duration
        ) {

            return;

        }


        const value =
            Number(
                event.target.value
            );


        video.currentTime =
            value;


        setCurrentTime(
            value
        );

    }


    // =====================================================
    // FULLSCREEN
    // =====================================================

    async function handleFullscreen(event) {

        event?.stopPropagation();


        const video =
            videoRef.current;


        if (!video) {

            return;

        }


        try {

            if (
                document.fullscreenElement
            ) {

                await document.exitFullscreen();

            }
            else {

                await video.requestFullscreen?.();

            }

        }
        catch (error) {

            console.error(
                "Fullscreen error:",
                error
            );

        }

    }


    // =====================================================
    // FORMAT TIME
    // =====================================================

    function formatTime(value) {

        if (
            !Number.isFinite(value) ||
            value < 0
        ) {

            return "0:00";

        }


        const minutes =
            Math.floor(
                value / 60
            );


        const seconds =
            Math.floor(
                value % 60
            )
            .toString()
            .padStart(
                2,
                "0"
            );


        return `${minutes}:${seconds}`;

    }


    // =====================================================
    // NO VIDEO
    // =====================================================

    if (!videoUrl) {

        return null;

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className="bubble-video"

            onClick={(event) =>
                event.stopPropagation()
            }
        >

            <div className="bubble-video-screen">

                <video
                    ref={videoRef}

                    className={
                        ready
                            ? "bubble-video-element ready"
                            : "bubble-video-element"
                    }

                    src={videoUrl}

                    playsInline

                    preload="metadata"

                    onLoadedMetadata={
                        handleLoadedMetadata
                    }

                    onLoadedData={
                        handleLoadedData
                    }

                    onTimeUpdate={
                        handleTimeUpdate
                    }

                    onPlay={
                        handlePlay
                    }

                    onPause={
                        handlePause
                    }

                    onEnded={
                        handleEnded
                    }

                    onError={
                        handleVideoError
                    }
                />


                {/* =================================================
                    PLAY OVERLAY
                ================================================= */}

                {!playing && (

                    <button
                        type="button"

                        className="bubble-video-preview"

                        onClick={
                            togglePlay
                        }

                        aria-label="Play video"
                    >

                        <span className="bubble-video-preview-icon">

                            <Play
                                size={27}
                                fill="currentColor"
                            />

                        </span>


                        {duration > 0 && (

                            <span className="bubble-video-preview-duration">

                                {
                                    formatTime(
                                        duration
                                    )
                                }

                            </span>

                        )}

                    </button>

                )}


                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div
                    className="bubble-video-controls"
                >


                    {/* PLAY / PAUSE */}

                    <button
                        type="button"

                        className="bubble-video-control"

                        onClick={
                            togglePlay
                        }
                    >

                        {playing ? (

                            <Pause
                                size={17}
                            />

                        ) : (

                            <Play
                                size={17}
                                fill="currentColor"
                            />

                        )}

                    </button>


                    {/* TIME */}

                    <span
                        className="bubble-video-time"
                    >

                        {
                            formatTime(
                                currentTime
                            )
                        }

                        <span>/</span>

                        {
                            formatTime(
                                duration
                            )
                        }

                    </span>


                    {/* PROGRESS */}

                    <input
                        type="range"

                        className="bubble-video-progress"

                        min="0"

                        max={
                            duration || 0
                        }

                        step="0.01"

                        value={Math.min(
                            currentTime,
                            duration || 0
                        )}

                        onChange={
                            handleSeek
                        }
                    />


                    {/* MUTE */}

                    <button
                        type="button"

                        className="bubble-video-control"

                        onClick={
                            toggleMute
                        }
                    >

                        {muted ? (

                            <VolumeX
                                size={17}
                            />

                        ) : (

                            <Volume2
                                size={17}
                            />

                        )}

                    </button>


                    {/* FULLSCREEN */}

                    <button
                        type="button"

                        className="bubble-video-control"

                        onClick={
                            handleFullscreen
                        }
                    >

                        <Maximize2
                            size={17}
                        />

                    </button>


                </div>

            </div>

        </div>

    );

}


export default BubbleVideo;