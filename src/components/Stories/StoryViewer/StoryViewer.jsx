import "./StoryViewer.css";

import {
    ChevronLeft,
    ChevronRight,
    X,
    Volume2,
    VolumeX,
    Pause,
    Play,
    MoreHorizontal,
    Eye,
    Clock3,
    AlertCircle,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";


/* =========================================================
   CONSTANTS
========================================================= */

const IMAGE_DURATION = 5000;

const SWIPE_THRESHOLD = 55;

const CONTROLS_HIDE_DELAY = 3500;


/* =========================================================
   HELPERS
========================================================= */

const formatTimeAgo = (timestamp) => {

    if (!timestamp) {
        return "";
    }

    const time = Number(timestamp);

    if (!Number.isFinite(time)) {
        return "";
    }

    const difference =
        Math.max(
            0,
            Date.now() - time
        );


    if (difference < 60 * 1000) {
        return "Just now";
    }


    const minutes =
        Math.floor(
            difference /
            (60 * 1000)
        );


    if (minutes < 60) {
        return `${minutes}m`;
    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {
        return `${hours}h`;
    }


    const days =
        Math.floor(
            hours / 24
        );


    return `${days}d`;
};


const getInitial = (username) => {

    return (
        username ||
        "D"
    )
        .charAt(0)
        .toUpperCase();
};


/* =========================================================
   COMPONENT
========================================================= */

function StoryViewer({
    open = false,
    stories = [],
    initialIndex = 0,
    onClose,
    onStoryViewed,
}) {

    /* =====================================================
       STATE
    ===================================================== */

    const [currentIndex, setCurrentIndex] =
        useState(initialIndex);

    const [progress, setProgress] =
        useState(0);

    const [paused, setPaused] =
        useState(false);

    const [muted, setMuted] =
        useState(true);

    const [mediaLoading, setMediaLoading] =
        useState(true);

    const [mediaError, setMediaError] =
        useState(false);

    const [showControls, setShowControls] =
        useState(true);

    const [showMore, setShowMore] =
        useState(false);

    const [mediaRetryKey, setMediaRetryKey] =
        useState(0);


    /* =====================================================
       REFS
    ===================================================== */

    const videoRef =
        useRef(null);

    const timerRef =
        useRef(null);

    const progressIntervalRef =
        useRef(null);

    const controlsTimerRef =
        useRef(null);

    const touchStartXRef =
        useRef(0);

    const touchStartYRef =
        useRef(0);

    const isPointerDownRef =
        useRef(false);


    /* =====================================================
       CURRENT STORY
    ===================================================== */

    const currentStory =
        stories[currentIndex] ||
        null;


    const mediaUrl =
        currentStory?.mediaUrl ||
        currentStory?.imageUrl ||
        currentStory?.videoUrl ||
        "";


    const isVideo =
        currentStory?.type === "video" ||
        Boolean(
            currentStory?.videoUrl
        );


    const username =
        currentStory?.username ||
        "devuser";


    const avatar =
        currentStory?.avatar ||
        "";


    /* =====================================================
       STORY TIME
    ===================================================== */

    const storyTime =
        useMemo(() => {

            return formatTimeAgo(
                currentStory?.createdAt
            );

        }, [
            currentStory?.createdAt,
        ]);


    /* =====================================================
       CLEAR MEDIA TIMERS
    ===================================================== */

    const clearTimers =
        useCallback(() => {

            if (timerRef.current) {

                clearTimeout(
                    timerRef.current
                );

                timerRef.current =
                    null;
            }


            if (
                progressIntervalRef.current
            ) {

                clearInterval(
                    progressIntervalRef.current
                );

                progressIntervalRef.current =
                    null;
            }

        }, []);


    /* =====================================================
       CLEAR CONTROLS TIMER
    ===================================================== */

    const clearControlsTimer =
        useCallback(() => {

            if (
                controlsTimerRef.current
            ) {

                clearTimeout(
                    controlsTimerRef.current
                );

                controlsTimerRef.current =
                    null;
            }

        }, []);


    /* =====================================================
       REVEAL CONTROLS
    ===================================================== */

    const revealControls =
        useCallback(() => {

            setShowControls(true);

            clearControlsTimer();

            controlsTimerRef.current =
                setTimeout(() => {

                    setShowControls(false);

                }, CONTROLS_HIDE_DELAY);

        }, [
            clearControlsTimer,
        ]);


    /* =====================================================
       RESET MEDIA
    ===================================================== */

    const resetMediaState =
        useCallback(() => {

            clearTimers();

            setProgress(0);

            setPaused(false);

            setMediaLoading(true);

            setMediaError(false);

            setShowMore(false);

            setMediaRetryKey(
                (previous) =>
                    previous + 1
            );

        }, [
            clearTimers,
        ]);


    /* =====================================================
       RESET INDEX WHEN OPENING
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }

        const safeIndex =
            Math.max(
                0,
                Math.min(
                    Number(initialIndex) || 0,
                    Math.max(
                        stories.length - 1,
                        0
                    )
                )
            );


        setCurrentIndex(
            safeIndex
        );

        setProgress(0);

        setPaused(false);

        setMediaLoading(true);

        setMediaError(false);

        setShowMore(false);

        revealControls();

    }, [
        open,
        initialIndex,
        stories.length,
        revealControls,
    ]);


    /* =====================================================
       CURRENT STORY CHANGE
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }

        clearTimers();

        setProgress(0);

        setPaused(false);

        setMediaLoading(true);

        setMediaError(false);

        setShowMore(false);

        setMediaRetryKey(
            (previous) =>
                previous + 1
        );

        revealControls();

    }, [
        currentIndex,
        open,
        clearTimers,
        revealControls,
    ]);


    /* =====================================================
       MARK STORY VIEWED
    ===================================================== */

    useEffect(() => {

        if (
            !open ||
            !currentStory?.id
        ) {
            return;
        }

        onStoryViewed?.(
            currentStory.id
        );

    }, [
        open,
        currentStory?.id,
        onStoryViewed,
    ]);


    /* =====================================================
       NEXT STORY
    ===================================================== */

    const goNext =
        useCallback(() => {

            clearTimers();

            setShowMore(false);

            if (
                currentIndex >=
                stories.length - 1
            ) {

                onClose?.();

                return;
            }


            setCurrentIndex(
                (previousIndex) =>
                    previousIndex + 1
            );

        }, [
            clearTimers,
            currentIndex,
            stories.length,
            onClose,
        ]);


    /* =====================================================
       PREVIOUS STORY
    ===================================================== */

    const goPrevious =
        useCallback(() => {

            clearTimers();

            setShowMore(false);


            if (
                currentIndex <= 0
            ) {

                const video =
                    videoRef.current;


                if (video) {

                    try {

                        video.currentTime = 0;

                    } catch {
                        // Ignore seek errors.
                    }

                }


                setProgress(0);

                return;
            }


            setCurrentIndex(
                (previousIndex) =>
                    previousIndex - 1
            );

        }, [
            clearTimers,
            currentIndex,
        ]);


    /* =====================================================
       IMAGE STORY TIMER
    ===================================================== */

    useEffect(() => {

        if (
            !open ||
            !currentStory ||
            isVideo ||
            paused ||
            mediaLoading ||
            mediaError
        ) {
            return;
        }

        clearTimers();

        const startTime =
            Date.now();


        setProgress(0);


        progressIntervalRef.current =
            setInterval(() => {

                const elapsed =
                    Date.now() -
                    startTime;


                const percentage =
                    Math.min(
                        100,
                        (
                            elapsed /
                            IMAGE_DURATION
                        ) * 100
                    );


                setProgress(
                    percentage
                );

            }, 40);


        timerRef.current =
            setTimeout(() => {

                clearTimers();

                goNext();

            }, IMAGE_DURATION);


        return clearTimers;

    }, [
        open,
        currentStory,
        isVideo,
        paused,
        mediaLoading,
        mediaError,
        clearTimers,
        goNext,
    ]);


    /* =====================================================
       VIDEO TIME UPDATE
    ===================================================== */

    const handleVideoTimeUpdate =
        useCallback(() => {

            const video =
                videoRef.current;


            if (
                !video ||
                !Number.isFinite(
                    video.duration
                ) ||
                video.duration <= 0
            ) {
                return;
            }


            const percentage =
                Math.min(
                    100,
                    (
                        video.currentTime /
                        video.duration
                    ) * 100
                );


            setProgress(
                percentage
            );

        }, []);


    /* =====================================================
       VIDEO LOADED
    ===================================================== */

    const handleVideoLoaded =
        useCallback(() => {

            setMediaLoading(false);

            setMediaError(false);


            const video =
                videoRef.current;


            if (!video) {
                return;
            }


            video.muted =
                muted;


            if (!paused) {

                video.play()
                    .then(() => {

                        setPaused(false);

                    })
                    .catch(() => {

                        setPaused(true);

                    });

            }

        }, [
            muted,
            paused,
        ]);


    /* =====================================================
       VIDEO PLAY
    ===================================================== */

    const handleVideoPlay =
        useCallback(() => {

            setPaused(false);

            setMediaLoading(false);

        }, []);


    /* =====================================================
       VIDEO PAUSE
    ===================================================== */

    const handleVideoPause =
        useCallback(() => {

            const video =
                videoRef.current;


            if (
                video &&
                !video.ended
            ) {

                setPaused(true);

            }

        }, []);


    /* =====================================================
       VIDEO ENDED
    ===================================================== */

    const handleVideoEnded =
        useCallback(() => {

            setProgress(100);

            goNext();

        }, [
            goNext,
        ]);


    /* =====================================================
       MEDIA ERROR
    ===================================================== */

    const handleMediaError =
        useCallback(() => {

            clearTimers();

            setMediaLoading(false);

            setMediaError(true);

        }, [
            clearTimers,
        ]);


    /* =====================================================
       RETRY MEDIA
    ===================================================== */

    const retryMedia =
        useCallback(() => {

            clearTimers();

            setMediaError(false);

            setMediaLoading(true);

            setProgress(0);

            setPaused(false);

            setMediaRetryKey(
                (previous) =>
                    previous + 1
            );

        }, [
            clearTimers,
        ]);


    /* =====================================================
       TOGGLE PAUSE
    ===================================================== */

    const togglePause =
        useCallback(() => {

            revealControls();


            if (isVideo) {

                const video =
                    videoRef.current;


                if (!video) {
                    return;
                }


                if (video.paused) {

                    video.play()
                        .then(() => {

                            setPaused(false);

                        })
                        .catch(() => {

                            setPaused(true);

                        });

                } else {

                    video.pause();

                    setPaused(true);

                }

                return;
            }


            setPaused(
                (previous) =>
                    !previous
            );

        }, [
            isVideo,
            revealControls,
        ]);


    /* =====================================================
       TOGGLE MUTE
    ===================================================== */

    const toggleMute =
        useCallback(() => {

            revealControls();


            const nextMuted =
                !muted;


            setMuted(
                nextMuted
            );


            const video =
                videoRef.current;


            if (video) {

                video.muted =
                    nextMuted;

            }

        }, [
            muted,
            revealControls,
        ]);


    /* =====================================================
       CLOSE
    ===================================================== */

    const handleClose =
        useCallback(() => {

            clearTimers();

            clearControlsTimer();


            const video =
                videoRef.current;


            if (video) {

                video.pause();

            }


            setShowMore(false);

            onClose?.();

        }, [
            clearTimers,
            clearControlsTimer,
            onClose,
        ]);


    /* =====================================================
       MEDIA CLICK
    ===================================================== */

    const handleMediaClick =
        useCallback((event) => {

            event.stopPropagation();

            revealControls();


            const rect =
                event.currentTarget
                    .getBoundingClientRect();


            const clickX =
                event.clientX -
                rect.left;


            const width =
                rect.width;


            if (
                clickX <
                width * 0.28
            ) {

                goPrevious();

                return;
            }


            if (
                clickX >
                width * 0.72
            ) {

                goNext();

                return;
            }


            togglePause();

        }, [
            revealControls,
            goPrevious,
            goNext,
            togglePause,
        ]);


    /* =====================================================
       TOUCH START
    ===================================================== */

    const handleTouchStart =
        useCallback((event) => {

            const touch =
                event.touches?.[0];


            if (!touch) {
                return;
            }


            isPointerDownRef.current =
                true;


            touchStartXRef.current =
                touch.clientX;


            touchStartYRef.current =
                touch.clientY;


            revealControls();

        }, [
            revealControls,
        ]);


    /* =====================================================
       TOUCH END
    ===================================================== */

    const handleTouchEnd =
        useCallback((event) => {

            if (
                !isPointerDownRef.current
            ) {
                return;
            }


            isPointerDownRef.current =
                false;


            const touch =
                event.changedTouches?.[0];


            if (!touch) {
                return;
            }


            const deltaX =
                touch.clientX -
                touchStartXRef.current;


            const deltaY =
                touch.clientY -
                touchStartYRef.current;


            if (
                Math.abs(deltaX) <
                SWIPE_THRESHOLD
            ) {
                return;
            }


            if (
                Math.abs(deltaX) <=
                Math.abs(deltaY)
            ) {
                return;
            }


            if (deltaX < 0) {

                goNext();

            } else {

                goPrevious();

            }

        }, [
            goNext,
            goPrevious,
        ]);


    /* =====================================================
       KEYBOARD
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }


        const handleKeyDown =
            (event) => {

                switch (
                    event.key
                ) {

                    case "Escape":

                        event.preventDefault();

                        handleClose();

                        break;


                    case "ArrowRight":
                    case "ArrowDown":

                        event.preventDefault();

                        goNext();

                        break;


                    case "ArrowLeft":
                    case "ArrowUp":

                        event.preventDefault();

                        goPrevious();

                        break;


                    case " ":
                    case "Spacebar":

                        event.preventDefault();

                        togglePause();

                        break;


                    case "m":
                    case "M":

                        if (isVideo) {

                            event.preventDefault();

                            toggleMute();

                        }

                        break;


                    default:
                        break;

                }

            };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        open,
        handleClose,
        goNext,
        goPrevious,
        togglePause,
        toggleMute,
        isVideo,
    ]);


    /* =====================================================
       BODY SCROLL LOCK
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [open]);


    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {

        return () => {

            clearTimers();

            clearControlsTimer();


            const video =
                videoRef.current;


            if (video) {

                video.pause();

            }

        };

    }, [
        clearTimers,
        clearControlsTimer,
    ]);


    /* =====================================================
       STORY COUNTER
    ===================================================== */

    const storyCounter =
        `${currentIndex + 1} / ${stories.length}`;


    /* =====================================================
       EMPTY / CLOSED
    ===================================================== */

    if (
        !open ||
        !currentStory
    ) {
        return null;
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="story-viewer"
            role="dialog"
            aria-modal="true"
            aria-label="Story viewer"
        >

            {/* =================================================
                BACKDROP
            ================================================= */}

            <div
                className="story-viewer__backdrop"
                onClick={handleClose}
                aria-hidden="true"
            />


            {/* =================================================
                CONTENT
            ================================================= */}

            <div
                className="story-viewer__content"
                onMouseMove={revealControls}
                onMouseEnter={revealControls}
            >

                {/* =================================================
                    PROGRESS
                ================================================= */}

                <div
                    className="story-viewer__progress"
                    aria-label="Story progress"
                >

                    {stories.map(
                        (story, index) => (

                            <div
                                className="story-viewer__progress-track"
                                key={
                                    story?.id ??
                                    `progress-${index}`
                                }
                            >

                                <div
                                    className="story-viewer__progress-bar"
                                    style={{
                                        width:
                                            index <
                                            currentIndex
                                                ? "100%"
                                                : index >
                                                  currentIndex
                                                    ? "0%"
                                                    : `${progress}%`,
                                    }}
                                />

                            </div>

                        )
                    )}

                </div>


                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className={`
                        story-viewer__header
                        ${
                            showControls
                                ? ""
                                : "story-viewer__header--hidden"
                        }
                    `}
                >

                    {/* USER */}

                    <div
                        className="story-viewer__user"
                    >

                        <div
                            className="story-viewer__avatar"
                        >

                            {avatar ? (

                                <img
                                    src={avatar}
                                    alt=""
                                    draggable="false"
                                />

                            ) : (

                                getInitial(
                                    username
                                )

                            )}

                        </div>


                        <div
                            className="story-viewer__user-info"
                        >

                            <strong>
                                @
                                {username}
                            </strong>


                            {storyTime && (

                                <span>

                                    <Clock3
                                        size={11}
                                    />

                                    {storyTime}

                                </span>

                            )}

                        </div>

                    </div>


                    {/* CONTROLS */}

                    <div
                        className="story-viewer__controls"
                    >

                        {isVideo && (

                            <button
                                type="button"
                                onClick={toggleMute}
                                aria-label={
                                    muted
                                        ? "Unmute story"
                                        : "Mute story"
                                }
                            >

                                {muted ? (
                                    <VolumeX
                                        size={19}
                                    />
                                ) : (
                                    <Volume2
                                        size={19}
                                    />
                                )}

                            </button>

                        )}


                        <button
                            type="button"
                            onClick={togglePause}
                            aria-label={
                                paused
                                    ? "Play story"
                                    : "Pause story"
                            }
                        >

                            {paused ? (
                                <Play
                                    size={19}
                                />
                            ) : (
                                <Pause
                                    size={19}
                                />
                            )}

                        </button>


                        <button
                            type="button"
                            onClick={() => {

                                setShowMore(
                                    (previous) =>
                                        !previous
                                );

                                revealControls();

                            }}
                            aria-label="More story options"
                            aria-expanded={
                                showMore
                            }
                        >

                            <MoreHorizontal
                                size={20}
                            />

                        </button>


                        <button
                            type="button"
                            onClick={handleClose}
                            aria-label="Close story"
                        >

                            <X
                                size={23}
                            />

                        </button>

                    </div>


                    {/* MORE MENU */}

                    {showMore && (

                        <div
                            className="story-viewer__more-menu"
                            role="menu"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {

                                    setShowMore(
                                        false
                                    );

                                    onStoryViewed?.(
                                        currentStory.id
                                    );

                                    revealControls();

                                }}
                            >

                                <Eye
                                    size={15}
                                />

                                Mark as viewed

                            </button>

                        </div>

                    )}

                </div>


                {/* =================================================
                    MEDIA
                ================================================= */}

                <div
                    className="story-viewer__media"
                    onClick={handleMediaClick}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={() => {
                        isPointerDownRef.current =
                            false;
                    }}
                >

                    {/* LOADING */}

                    {mediaLoading &&
                        !mediaError && (

                            <div
                                className="story-viewer__loading"
                                aria-label="Loading story"
                            >

                                <span />

                                <small>
                                    Loading
                                </small>

                            </div>

                        )}


                    {/* ERROR */}

                    {mediaError ? (

                        <div
                            className="story-viewer__media-error"
                        >

                            <div className="story-viewer__error-icon">

                                <AlertCircle
                                    size={34}
                                />

                            </div>


                            <strong>
                                Unable to load story
                            </strong>


                            <span>
                                The media could not
                                be displayed.
                            </span>


                            <button
                                type="button"
                                onClick={(event) => {

                                    event.stopPropagation();

                                    retryMedia();

                                }}
                            >
                                Try Again
                            </button>

                        </div>

                    ) : isVideo ? (

                        <video
                            key={`
                                ${currentStory.id}
                                -
                                ${mediaRetryKey}
                            `}
                            ref={videoRef}
                            className="story-viewer__video"
                            src={mediaUrl}
                            autoPlay
                            muted={muted}
                            playsInline
                            preload="auto"
                            controls={false}
                            onLoadedData={
                                handleVideoLoaded
                            }
                            onCanPlay={
                                handleVideoLoaded
                            }
                            onPlay={
                                handleVideoPlay
                            }
                            onPause={
                                handleVideoPause
                            }
                            onTimeUpdate={
                                handleVideoTimeUpdate
                            }
                            onEnded={
                                handleVideoEnded
                            }
                            onError={
                                handleMediaError
                            }
                        />

                    ) : mediaUrl ? (

                        <img
                            key={`
                                ${currentStory.id}
                                -
                                ${mediaRetryKey}
                            `}
                            className="story-viewer__image"
                            src={mediaUrl}
                            alt={
                                currentStory.caption ||
                                `${username}'s story`
                            }
                            draggable="false"
                            onLoad={() =>
                                setMediaLoading(
                                    false
                                )
                            }
                            onError={
                                handleMediaError
                            }
                        />

                    ) : (

                        <div
                            className="story-viewer__empty"
                        >

                            <AlertCircle
                                size={30}
                            />

                            <span>
                                No story media
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        LEFT NAV
                    ================================================= */}

                    <button
                        type="button"
                        className="
                            story-viewer__nav
                            story-viewer__nav--left
                        "
                        onClick={(event) => {

                            event.stopPropagation();

                            goPrevious();

                        }}
                        aria-label="Previous story"
                    >

                        <ChevronLeft
                            size={28}
                        />

                    </button>


                    {/* =================================================
                        RIGHT NAV
                    ================================================= */}

                    <button
                        type="button"
                        className="
                            story-viewer__nav
                            story-viewer__nav--right
                        "
                        onClick={(event) => {

                            event.stopPropagation();

                            goNext();

                        }}
                        aria-label="Next story"
                    >

                        <ChevronRight
                            size={28}
                        />

                    </button>


                    {/* =================================================
                        PAUSED INDICATOR
                    ================================================= */}

                    {paused && (

                        <div
                            className="story-viewer__paused"
                            aria-hidden="true"
                        >

                            <Play
                                size={26}
                                fill="currentColor"
                            />

                        </div>

                    )}

                </div>


                {/* =================================================
                    BOTTOM
                ================================================= */}

                <div
                    className="story-viewer__bottom"
                >

                    {currentStory.caption && (

                        <div
                            className="story-viewer__caption"
                        >
                            {currentStory.caption}
                        </div>

                    )}


                    <div
                        className="story-viewer__counter"
                    >

                        {storyCounter}

                    </div>

                </div>

            </div>

        </div>
    );
}


export default StoryViewer;