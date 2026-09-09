import "./BubbleAudio.css";

import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Download
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";


function BubbleAudio({ audio }) {

    const audioRef = useRef(null);
    const objectUrlRef = useRef(null);

    const [audioUrl, setAudioUrl] = useState("");

    const [playing, setPlaying] =
        useState(false);

    const [muted, setMuted] =
        useState(false);

    const [duration, setDuration] =
        useState(0);

    const [currentTime, setCurrentTime] =
        useState(0);


    // =====================================================
    // CREATE AUDIO SOURCE
    // =====================================================

    useEffect(() => {

        // Cleanup previous object URL
        if (objectUrlRef.current) {

            URL.revokeObjectURL(
                objectUrlRef.current
            );

            objectUrlRef.current = null;
        }

        setAudioUrl("");
        setPlaying(false);
        setMuted(false);
        setDuration(0);
        setCurrentTime(0);


        if (!audio) {
            return;
        }


        // =================================================
        // FILE / BLOB
        // =================================================

        if (
            audio instanceof File ||
            audio instanceof Blob
        ) {

            const url =
                URL.createObjectURL(audio);

            objectUrlRef.current = url;

            setAudioUrl(url);

            return;
        }


        // =================================================
        // STRING URL
        // =================================================

        if (
            typeof audio === "string"
        ) {

            setAudioUrl(audio);

            return;
        }


        // =================================================
        // OBJECT URL
        // =================================================

        if (
            typeof audio === "object"
        ) {

            if (audio.url) {

                setAudioUrl(
                    audio.url
                );

                return;
            }

            if (audio.src) {

                setAudioUrl(
                    audio.src
                );

                return;
            }

            if (audio.file) {

                if (
                    audio.file instanceof File ||
                    audio.file instanceof Blob
                ) {

                    const url =
                        URL.createObjectURL(
                            audio.file
                        );

                    objectUrlRef.current =
                        url;

                    setAudioUrl(url);

                    return;
                }
            }
        }


        console.warn(
            "BubbleAudio: unsupported audio source",
            audio
        );

    }, [audio]);


    // =====================================================
    // CLEANUP
    // =====================================================

    useEffect(() => {

        return () => {

            if (
                objectUrlRef.current
            ) {

                URL.revokeObjectURL(
                    objectUrlRef.current
                );

                objectUrlRef.current = null;
            }

        };

    }, []);


    // =====================================================
    // LOAD AUDIO
    // =====================================================

    useEffect(() => {

        const player =
            audioRef.current;

        if (!player || !audioUrl) {
            return;
        }

        player.pause();

        player.currentTime = 0;

        player.muted = false;

        player.volume = 1;

        setPlaying(false);
        setMuted(false);
        setCurrentTime(0);

        // Force browser to load new source
        player.load();

    }, [audioUrl]);


    // =====================================================
    // LOADED METADATA
    // =====================================================

    function handleLoadedMetadata() {

        const player =
            audioRef.current;

        if (!player) {
            return;
        }

        if (
            Number.isFinite(
                player.duration
            )
        ) {

            setDuration(
                player.duration
            );
        }

    }


    // =====================================================
    // CAN PLAY
    // =====================================================

    function handleCanPlay() {

        const player =
            audioRef.current;

        if (!player) {
            return;
        }

        if (
            Number.isFinite(
                player.duration
            )
        ) {

            setDuration(
                player.duration
            );
        }

    }


    // =====================================================
    // TIME UPDATE
    // =====================================================

    function handleTimeUpdate() {

        const player =
            audioRef.current;

        if (!player) {
            return;
        }

        setCurrentTime(
            player.currentTime
        );

    }


    // =====================================================
    // PLAY
    // =====================================================

    async function handlePlayClick(event) {

        event?.stopPropagation();

        const player =
            audioRef.current;

        if (!player) {
            return;
        }


        try {

            // Make absolutely sure audio isn't muted
            player.muted = false;
            player.volume = 1;

            setMuted(false);


            if (player.paused) {

                await player.play();

            } else {

                player.pause();

            }

        } catch (error) {

            console.error(
                "BubbleAudio playback failed:",
                error
            );

            console.error(
                "Audio source:",
                audioUrl
            );

        }

    }


    // =====================================================
    // PLAY EVENT
    // =====================================================

    function handlePlay() {

        setPlaying(true);

    }


    // =====================================================
    // PAUSE EVENT
    // =====================================================

    function handlePause() {

        setPlaying(false);

    }


    // =====================================================
    // ENDED
    // =====================================================

    function handleEnded() {

        setPlaying(false);
        setCurrentTime(0);

    }


    // =====================================================
    // MUTE
    // =====================================================

    function toggleMute(event) {

        event?.stopPropagation();

        const player =
            audioRef.current;

        if (!player) {
            return;
        }


        const nextMuted =
            !player.muted;


        player.muted =
            nextMuted;


        if (nextMuted) {

            player.volume = 0;

        } else {

            player.volume = 1;

        }


        setMuted(
            nextMuted
        );

    }


    // =====================================================
    // SEEK
    // =====================================================

    function handleSeek(event) {

        event?.stopPropagation();

        const player =
            audioRef.current;

        if (
            !player ||
            !Number.isFinite(duration) ||
            duration <= 0
        ) {

            return;
        }


        const value =
            Number(
                event.target.value
            );


        player.currentTime =
            value;


        setCurrentTime(
            value
        );

    }


    // =====================================================
    // DOWNLOAD
    // =====================================================

    function handleDownload(event) {

        event?.stopPropagation();

        if (!audioUrl) {
            return;
        }


        const link =
            document.createElement("a");


        link.href =
            audioUrl;


        link.download =
            audio?.name ||
            "audio";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );

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
            .padStart(2, "0");


        return `${minutes}:${seconds}`;

    }


    // =====================================================
    // NO AUDIO
    // =====================================================

    if (!audioUrl) {

        return null;

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className="bubble-audio"
            onClick={(event) =>
                event.stopPropagation()
            }
        >

            <audio
                ref={audioRef}
                src={audioUrl}
                preload="metadata"
                onLoadedMetadata={
                    handleLoadedMetadata
                }
                onCanPlay={
                    handleCanPlay
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
            />


            {/* =========================================
                PLAY / PAUSE
            ========================================= */}

            <button
                type="button"
                className="bubble-audio-play"
                onClick={
                    handlePlayClick
                }
                aria-label={
                    playing
                        ? "Pause audio"
                        : "Play audio"
                }
            >

                {playing ? (

                    <Pause size={18} />

                ) : (

                    <Play
                        size={18}
                        fill="currentColor"
                    />

                )}

            </button>


            {/* =========================================
                MAIN
            ========================================= */}

            <div className="bubble-audio-main">

                <div className="bubble-audio-top">

                    <span className="bubble-audio-name">

                        {
                            audio?.name ||
                            audio?.file?.name ||
                            "Audio"
                        }

                    </span>


                    <span className="bubble-audio-time">

                        {formatTime(
                            currentTime
                        )}

                        <span>/</span>

                        {formatTime(
                            duration
                        )}

                    </span>

                </div>


                {/* =====================================
                    PROGRESS
                ===================================== */}

                <input
                    type="range"
                    className="bubble-audio-progress"
                    min="0"
                    max={duration || 0}
                    step="0.01"
                    value={
                        Math.min(
                            currentTime,
                            duration || 0
                        )
                    }
                    onChange={
                        handleSeek
                    }
                    disabled={
                        !duration
                    }
                    aria-label="Audio progress"
                />

            </div>


            {/* =========================================
                MUTE
            ========================================= */}

            <button
                type="button"
                className="bubble-audio-control"
                onClick={
                    toggleMute
                }
                aria-label={
                    muted
                        ? "Unmute audio"
                        : "Mute audio"
                }
            >

                {muted ? (

                    <VolumeX size={17} />

                ) : (

                    <Volume2 size={17} />

                )}

            </button>


            {/* =========================================
                DOWNLOAD
            ========================================= */}

            <button
                type="button"
                className="bubble-audio-control"
                onClick={
                    handleDownload
                }
                aria-label="Download audio"
            >

                <Download size={17} />

            </button>

        </div>

    );

}


export default BubbleAudio;