import "./ReelCard.css";

import ReelActions from "../ReelActions/ReelActions";

import {
    Play,
    Volume2,
    VolumeX,
    Heart,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";


function ReelCard({
    reel,
    onCreateReel,
    onUpdateReel,
    onLikeReel,
    onSaveReel,
    onCommentAdded,
    onShareReel,
}) {

    const videoRef = useRef(null);
    const cardRef = useRef(null);
    const progressRef = useRef(null);

    const lastTapRef = useRef(0);
    const heartTimerRef = useRef(null);

    const isDraggingProgressRef = useRef(false);


    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const [following, setFollowing] = useState(false);

    const [showHeart, setShowHeart] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [localVideoUrl, setLocalVideoUrl] = useState("");


    // ======================================================
    // CREATE VIDEO URL FOR UPLOADED REEL
    // ======================================================

    useEffect(() => {

        if (!reel?.videoFile) {

            setLocalVideoUrl("");

            return;

        }


        const objectUrl =
            URL.createObjectURL(
                reel.videoFile
            );


        setLocalVideoUrl(objectUrl);


        return () => {

            URL.revokeObjectURL(
                objectUrl
            );

        };

    }, [reel?.videoFile]);


    // ======================================================
    // VIDEO URL
    // ======================================================

    const videoUrl =
        reel?.videoUrl ||
        localVideoUrl ||
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";


    // ======================================================
    // FORMAT TIME
    // ======================================================

    const formatTime = (time) => {

        if (
            !Number.isFinite(time) ||
            time < 0
        ) {

            return "0:00";

        }


        const totalSeconds =
            Math.floor(time);


        const minutes =
            Math.floor(
                totalSeconds / 60
            );


        const seconds =
            totalSeconds % 60;


        return `${minutes}:${String(
            seconds
        ).padStart(2, "0")}`;

    };


    // ======================================================
    // PROGRESS PERCENTAGE
    // ======================================================

    const progressPercentage =
        duration > 0
            ? (currentTime / duration) * 100
            : 0;


    // ======================================================
    // AUTO PLAY / PAUSE ON SCROLL
    // ======================================================

    useEffect(() => {

        const card =
            cardRef.current;

        const video =
            videoRef.current;


        if (!card || !video) {
            return;
        }


        const observer =
            new IntersectionObserver(

                ([entry]) => {

                    if (
                        entry.isIntersecting
                    ) {

                        video.play()
                            .then(() => {

                                setIsPlaying(
                                    true
                                );

                            })
                            .catch(() => {

                                setIsPlaying(
                                    false
                                );

                            });

                    } else {

                        video.pause();

                        setIsPlaying(
                            false
                        );

                    }

                },

                {
                    threshold: 0.75,
                }

            );


        observer.observe(card);


        return () => {

            observer.disconnect();

        };

    }, [videoUrl]);


    // ======================================================
    // CLEANUP HEART TIMER
    // ======================================================

    useEffect(() => {

        return () => {

            if (
                heartTimerRef.current
            ) {

                clearTimeout(
                    heartTimerRef.current
                );

            }

        };

    }, []);


    // ======================================================
    // VIDEO METADATA
    // ======================================================

    const handleLoadedMetadata = () => {

        const video =
            videoRef.current;


        if (!video) {
            return;
        }


        if (
            Number.isFinite(
                video.duration
            )
        ) {

            setDuration(
                video.duration
            );

        }

    };


    // ======================================================
    // VIDEO TIME UPDATE
    // ======================================================

    const handleTimeUpdate = () => {

        const video =
            videoRef.current;


        if (!video) {
            return;
        }


        if (
            !isDraggingProgressRef.current
        ) {

            setCurrentTime(
                video.currentTime
            );

        }

    };


    // ======================================================
    // VIDEO PLAY
    // ======================================================

    const handleVideoPlay = () => {

        setIsPlaying(true);

    };


    // ======================================================
    // VIDEO PAUSE
    // ======================================================

    const handleVideoPause = () => {

        setIsPlaying(false);

    };


    // ======================================================
    // PLAY / PAUSE
    // ======================================================

    const handleVideoClick = () => {

        const video =
            videoRef.current;


        if (!video) {
            return;
        }


        const now =
            Date.now();


        const timeSinceLastTap =
            now - lastTapRef.current;


        // ==================================================
        // DOUBLE TAP
        // ==================================================

        if (
            timeSinceLastTap < 350
        ) {

            handleDoubleLike();

            lastTapRef.current = 0;

            return;

        }


        lastTapRef.current = now;


        // ==================================================
        // PLAY
        // ==================================================

        if (video.paused) {

            video.play()
                .then(() => {

                    setIsPlaying(
                        true
                    );

                })
                .catch(() => {

                    setIsPlaying(
                        false
                    );

                });

        }

        // ==================================================
        // PAUSE
        // ==================================================

        else {

            video.pause();

            setIsPlaying(false);

        }

    };


    // ======================================================
    // DOUBLE TAP LIKE
    // ======================================================

    const handleDoubleLike = () => {

        // --------------------------------------------------
        // SHOW HEART
        // --------------------------------------------------

        setShowHeart(true);


        if (
            heartTimerRef.current
        ) {

            clearTimeout(
                heartTimerRef.current
            );

        }


        heartTimerRef.current =
            setTimeout(() => {

                setShowHeart(false);

            }, 900);


        // --------------------------------------------------
        // LIKE REEL
        // --------------------------------------------------

        if (
            reel?.id &&
            !reel?.liked
        ) {

            onLikeReel?.(
                reel.id
            );

        }

    };


    // ======================================================
    // MUTE / UNMUTE
    // ======================================================

    const handleMuteToggle = (
        event
    ) => {

        event.stopPropagation();


        const video =
            videoRef.current;


        if (!video) {
            return;
        }


        const nextMuted =
            !isMuted;


        video.muted =
            nextMuted;


        setIsMuted(
            nextMuted
        );

    };


    // ======================================================
    // FOLLOW
    // ======================================================

    const handleFollow = (
        event
    ) => {

        event.stopPropagation();


        setFollowing(
            (prev) => !prev
        );

    };


    // ======================================================
    // CALCULATE SEEK TIME
    // ======================================================

    const getSeekTimeFromEvent = (
        event
    ) => {

        const progress =
            progressRef.current;


        if (
            !progress ||
            !duration
        ) {

            return 0;

        }


        const rect =
            progress.getBoundingClientRect();


        const clientX =
            event.clientX;


        let position =
            clientX - rect.left;


        position =
            Math.max(
                0,
                Math.min(
                    position,
                    rect.width
                )
            );


        const percentage =
            position / rect.width;


        return percentage * duration;

    };


    // ======================================================
    // SEEK VIDEO
    // ======================================================

    const seekVideo = (
        event
    ) => {

        const video =
            videoRef.current;


        if (
            !video ||
            !duration
        ) {

            return;

        }


        const newTime =
            getSeekTimeFromEvent(
                event
            );


        video.currentTime =
            newTime;


        setCurrentTime(
            newTime
        );

    };


    // ======================================================
    // PROGRESS CLICK
    // ======================================================

    const handleProgressClick = (
        event
    ) => {

        event.stopPropagation();

        seekVideo(event);

    };


    // ======================================================
    // POINTER DOWN
    // ======================================================

    const handleProgressPointerDown = (
        event
    ) => {

        event.stopPropagation();


        isDraggingProgressRef.current =
            true;


        const progress =
            progressRef.current;


        if (
            progress &&
            progress.setPointerCapture
        ) {

            progress.setPointerCapture(
                event.pointerId
            );

        }


        seekVideo(event);

    };


    // ======================================================
    // POINTER MOVE
    // ======================================================

    const handleProgressPointerMove = (
        event
    ) => {

        if (
            !isDraggingProgressRef.current
        ) {

            return;

        }


        event.stopPropagation();

        seekVideo(event);

    };


    // ======================================================
    // POINTER UP
    // ======================================================

    const handleProgressPointerUp = (
        event
    ) => {

        if (
            !isDraggingProgressRef.current
        ) {

            return;

        }


        event.stopPropagation();


        isDraggingProgressRef.current =
            false;


        const progress =
            progressRef.current;


        if (
            progress &&
            progress.releasePointerCapture
        ) {

            try {

                progress.releasePointerCapture(
                    event.pointerId
                );

            } catch {

                // Pointer capture may already
                // have been released.

            }

        }

    };


    // ======================================================
    // POINTER CANCEL
    // ======================================================

    const handleProgressPointerCancel = (
        event
    ) => {

        event.stopPropagation();


        isDraggingProgressRef.current =
            false;

    };


    // ======================================================
    // KEYBOARD SEEK
    // ======================================================

    const handleProgressKeyDown = (
        event
    ) => {

        const video =
            videoRef.current;


        if (
            !video ||
            !duration
        ) {

            return;

        }


        let newTime =
            video.currentTime;


        if (
            event.key === "ArrowRight"
        ) {

            event.preventDefault();


            newTime =
                Math.min(
                    duration,
                    video.currentTime + 5
                );

        }


        if (
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();


            newTime =
                Math.max(
                    0,
                    video.currentTime - 5
                );

        }


        if (
            event.key === "Home"
        ) {

            event.preventDefault();

            newTime = 0;

        }


        if (
            event.key === "End"
        ) {

            event.preventDefault();

            newTime = duration;

        }


        if (
            newTime !==
            video.currentTime
        ) {

            video.currentTime =
                newTime;


            setCurrentTime(
                newTime
            );

        }

    };


    // ======================================================
    // VIDEO ENDED
    // ======================================================

    const handleVideoEnded = () => {

        const video =
            videoRef.current;


        if (!video) {
            return;
        }


        setCurrentTime(0);


        if (video.loop) {

            video.currentTime = 0;

        }

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <article
            ref={cardRef}
            className="reel-card"
        >

            {/* ==================================================
                VIDEO
            ================================================== */}

            <div
                className="reel-card__video"
                onClick={handleVideoClick}
            >

                <video
                    ref={videoRef}
                    className="reel-card__video-element"
                    src={videoUrl}
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={
                        handleLoadedMetadata
                    }
                    onTimeUpdate={
                        handleTimeUpdate
                    }
                    onPlay={
                        handleVideoPlay
                    }
                    onPause={
                        handleVideoPause
                    }
                    onEnded={
                        handleVideoEnded
                    }
                />

            </div>


            {/* ==================================================
                VIDEO GRADIENT
            ================================================== */}

            <div className="reel-card__gradient" />


            {/* ==================================================
                DOUBLE TAP HEART
            ================================================== */}

            {showHeart && (

                <div
                    className="reel-card__double-heart"
                    aria-hidden="true"
                >

                    <Heart
                        size={105}
                        fill="currentColor"
                    />

                </div>

            )}


            {/* ==================================================
                PLAY INDICATOR
            ================================================== */}

            {!isPlaying &&
                !showHeart && (

                    <div
                        className="reel-card__play-indicator"
                        aria-hidden="true"
                    >

                        <Play
                            size={34}
                            fill="currentColor"
                        />

                    </div>

                )}


            {/* ==================================================
                SOUND BUTTON
            ================================================== */}

            <button
                className="reel-card__sound"
                type="button"
                onClick={
                    handleMuteToggle
                }
                aria-label={
                    isMuted
                        ? "Unmute video"
                        : "Mute video"
                }
            >

                {isMuted ? (

                    <VolumeX size={21} />

                ) : (

                    <Volume2 size={21} />

                )}

            </button>


            {/* ==================================================
                TOP BAR
            ================================================== */}

            <div className="reel-card__top">

                <span className="reel-card__title">
                    Reels
                </span>


                <button
                    className="reel-card__camera"
                    type="button"
                    aria-label="Create Reel"
                    onClick={
                        onCreateReel
                    }
                >
                    +
                </button>

            </div>


            {/* ==================================================
                USER INFO
            ================================================== */}

            <div className="reel-card__info">

                <div className="reel-card__user">

                    <div className="reel-card__avatar">

                        {reel?.username
                            ?.charAt(0)
                            .toUpperCase() ||
                            "D"}

                    </div>


                    <strong>
                        @{reel?.username ||
                            "devuser"}
                    </strong>


                    <button
                        className={`reel-card__follow ${
                            following
                                ? "following"
                                : ""
                        }`}
                        type="button"
                        onClick={
                            handleFollow
                        }
                    >

                        {following
                            ? "Following"
                            : "Follow"}

                    </button>

                </div>


                <p>

                    {reel?.caption ||
                        "Welcome to DevChat Reels 🚀"}

                </p>


                <div className="reel-card__music">

                    ♪{" "}
                    {reel?.music ||
                        "Original audio"}

                </div>

            </div>


            {/* ==================================================
                REEL ACTIONS
            ================================================== */}

            <ReelActions
                reel={reel}

                onUpdateReel={
                    onUpdateReel
                }

                onLikeReel={
                    onLikeReel
                }

                onSaveReel={
                    onSaveReel
                }

                onCommentAdded={
                    onCommentAdded
                }

                onShareReel={
                    onShareReel
                }
            />


            {/* ==================================================
                PROGRESS BAR
            ================================================== */}

            <div
                className="reel-card__progress-container"
            >

                <div
                    ref={progressRef}
                    className="reel-card__progress"
                    role="slider"
                    tabIndex={0}
                    aria-label="Video progress"
                    aria-valuemin={0}
                    aria-valuemax={
                        duration || 0
                    }
                    aria-valuenow={
                        currentTime
                    }
                    onClick={
                        handleProgressClick
                    }
                    onPointerDown={
                        handleProgressPointerDown
                    }
                    onPointerMove={
                        handleProgressPointerMove
                    }
                    onPointerUp={
                        handleProgressPointerUp
                    }
                    onPointerCancel={
                        handleProgressPointerCancel
                    }
                    onKeyDown={
                        handleProgressKeyDown
                    }
                >

                    <div
                        className="reel-card__progress-filled"
                        style={{
                            width: `${progressPercentage}%`,
                        }}
                    />


                    <div
                        className="reel-card__progress-thumb"
                        style={{
                            left: `${progressPercentage}%`,
                        }}
                    />

                </div>


                <div className="reel-card__time">

                    <span>
                        {formatTime(
                            currentTime
                        )}
                    </span>

                    <span>
                        {formatTime(
                            duration
                        )}
                    </span>

                </div>

            </div>

        </article>

    );

}


export default ReelCard;