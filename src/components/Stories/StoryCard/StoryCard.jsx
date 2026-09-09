import "./StoryCard.css";

import {
    Plus,
    Play,
    Clock3,
    CheckCircle2,
    MoreHorizontal,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";


function StoryCard({
    story = null,

    onOpenStory,

    onDeleteStory,

    onStoryAction,

    showMenu = false,
}) {

    const videoRef = useRef(null);
    const menuRef = useRef(null);


    const [videoReady, setVideoReady] =
        useState(false);

    const [videoError, setVideoError] =
        useState(false);

    const [imageError, setImageError] =
        useState(false);

    const [menuOpen, setMenuOpen] =
        useState(false);


    /* =========================================================
       STORY DATA
    ========================================================= */

    const username =
        story?.username ||
        "devuser";


    const avatar =
        story?.avatar ||
        "";


    const mediaUrl =
        story?.mediaUrl ||
        story?.imageUrl ||
        story?.videoUrl ||
        "";


    const caption =
        story?.caption ||
        "";


    const isVideo =
        story?.type === "video" ||
        Boolean(story?.videoUrl);


    const isViewed =
        Boolean(story?.viewed);


    const isOwnStory =
        Boolean(story?.isOwn);


    const isVerified =
        Boolean(story?.verified);


    /* =========================================================
       STORY EXPIRY
    ========================================================= */

    const expiryInfo = useMemo(() => {

        if (!story?.expiresAt) {

            return {
                expired: false,
                urgent: false,
                text: "",
            };

        }


        const expiresAt =
            Number(story.expiresAt);


        if (!Number.isFinite(expiresAt)) {

            return {
                expired: false,
                urgent: false,
                text: "",
            };

        }


        const remaining =
            expiresAt - Date.now();


        if (remaining <= 0) {

            return {
                expired: true,
                urgent: true,
                text: "Expired",
            };

        }


        const totalMinutes =
            Math.floor(
                remaining /
                (60 * 1000)
            );


        const hours =
            Math.floor(
                totalMinutes / 60
            );


        const minutes =
            totalMinutes % 60;


        if (hours < 1) {

            return {
                expired: false,
                urgent: true,
                text:
                    `${Math.max(
                        minutes,
                        1
                    )}m`,
            };

        }


        if (hours < 24) {

            return {
                expired: false,
                urgent: hours <= 3,
                text:
                    `${hours}h`,
            };

        }


        const days =
            Math.floor(
                hours / 24
            );


        return {
            expired: false,
            urgent: false,
            text:
                `${days}d`,
        };

    }, [
        story?.expiresAt,
    ]);


    /* =========================================================
       VIDEO PREVIEW
    ========================================================= */

    useEffect(() => {

        const video =
            videoRef.current;


        if (
            !video ||
            !isVideo ||
            !mediaUrl
        ) {

            return;

        }


        setVideoReady(false);
        setVideoError(false);


        video.muted = true;


        const handleCanPlay = () => {

            setVideoReady(true);

            video
                .play()
                .catch(() => {
                    // Autoplay can be blocked.
                });

        };


        const handleError = () => {

            setVideoError(true);
            setVideoReady(false);

        };


        video.addEventListener(
            "canplay",
            handleCanPlay
        );


        video.addEventListener(
            "error",
            handleError
        );


        video
            .play()
            .then(() => {

                setVideoReady(true);

            })
            .catch(() => {
                // Browser autoplay restriction.
            });


        return () => {

            video.pause();

            video.removeEventListener(
                "canplay",
                handleCanPlay
            );

            video.removeEventListener(
                "error",
                handleError
            );

        };

    }, [
        isVideo,
        mediaUrl,
    ]);


    /* =========================================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ========================================================= */

    useEffect(() => {

        if (!menuOpen) {
            return;
        }


        const handleOutsideClick = (
            event
        ) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    event.target
                )
            ) {

                setMenuOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, [
        menuOpen,
    ]);


    /* =========================================================
       ESCAPE TO CLOSE MENU
    ========================================================= */

    useEffect(() => {

        if (!menuOpen) {
            return;
        }


        const handleEscape = (
            event
        ) => {

            if (
                event.key === "Escape"
            ) {

                setMenuOpen(false);

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [
        menuOpen,
    ]);


    /* =========================================================
       OPEN STORY
    ========================================================= */

    const handleOpenStory = () => {

        if (!story) {
            return;
        }


        onOpenStory?.(
            story
        );

    };


    /* =========================================================
       CREATE STORY
    ========================================================= */

    const handleCreateStory = () => {

        onOpenStory?.(
            story
        );

    };


    /* =========================================================
       MENU TOGGLE
    ========================================================= */

    const handleMenuClick = (
        event
    ) => {

        event.preventDefault();
        event.stopPropagation();


        setMenuOpen(
            previous =>
                !previous
        );

    };


    /* =========================================================
       DELETE STORY
    ========================================================= */

    const handleDelete = (
        event
    ) => {

        event.preventDefault();
        event.stopPropagation();


        setMenuOpen(false);


        if (!story?.id) {
            return;
        }


        onDeleteStory?.(
            story.id
        );


        onStoryAction?.(
            "delete",
            story
        );

    };


    /* =========================================================
       STORY ACTION
    ========================================================= */

    const handleAction = (
        action,
        event
    ) => {

        event?.preventDefault();
        event?.stopPropagation();


        setMenuOpen(false);


        onStoryAction?.(
            action,
            story
        );

    };


    /* =========================================================
       IMAGE ERROR
    ========================================================= */

    const handleImageError = () => {

        setImageError(true);

    };


    /* =========================================================
       VIDEO ERROR
    ========================================================= */

    const handleVideoError = () => {

        setVideoError(true);
        setVideoReady(false);

    };


    /* =========================================================
       CREATE STORY CARD
    ========================================================= */

    if (story?.isCreate) {

        return (
            <button
                type="button"
                className="
                    story-card
                    story-card--create
                "
                onClick={
                    handleCreateStory
                }
                aria-label="Add a new story"
            >

                <div
                    className="
                        story-card__media
                        story-card__media--create
                    "
                >

                    <div
                        className="
                            story-card__create-icon
                        "
                    >

                        <Plus
                            size={25}
                            strokeWidth={2.4}
                        />

                    </div>

                </div>


                <span
                    className="
                        story-card__username
                    "
                >
                    Add Story
                </span>

            </button>
        );

    }


    /* =========================================================
       INVALID / EXPIRED STORY
    ========================================================= */

    if (
        !story ||
        expiryInfo.expired
    ) {

        return null;

    }


    /* =========================================================
       STORY CARD
    ========================================================= */

    return (
        <article
            ref={menuRef}
            className={`
                story-card-wrapper

                ${
                    isOwnStory
                        ? "story-card-wrapper--own"
                        : ""
                }

                ${
                    menuOpen
                        ? "story-card-wrapper--menu-open"
                        : ""
                }
            `}
        >

            {/* =================================================
               MAIN STORY BUTTON
            ================================================= */}

            <button
                type="button"
                className={`
                    story-card

                    ${
                        isViewed
                            ? "story-card--viewed"
                            : "story-card--unviewed"
                    }

                    ${
                        expiryInfo.urgent
                            ? "story-card--expiring"
                            : ""
                    }
                `}
                onClick={
                    handleOpenStory
                }
                aria-label={
                    `Open ${username}'s story`
                }
            >

                {/* =============================================
                   MEDIA
                ============================================= */}

                <div
                    className="
                        story-card__media
                    "
                >

                    {/* =========================================
                       VIDEO
                    ========================================= */}

                    {isVideo &&
                    mediaUrl &&
                    !videoError ? (

                        <>

                            <video
                                ref={videoRef}
                                className="
                                    story-card__video
                                "
                                src={mediaUrl}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                aria-label={
                                    `${username}'s video story`
                                }
                                onLoadedData={() =>
                                    setVideoReady(
                                        true
                                    )
                                }
                                onError={
                                    handleVideoError
                                }
                            />


                            {!videoReady && (

                                <div
                                    className="
                                        story-card__video-loading
                                    "
                                    aria-hidden="true"
                                >

                                    <Play
                                        size={20}
                                        fill="currentColor"
                                    />

                                </div>

                            )}

                        </>

                    ) : (

                        /* =====================================
                           IMAGE
                        ===================================== */

                        !isVideo &&
                        mediaUrl &&
                        !imageError ? (

                            <img
                                className="
                                    story-card__image
                                "
                                src={mediaUrl}
                                alt={
                                    `${username}'s story`
                                }
                                loading="lazy"
                                decoding="async"
                                onError={
                                    handleImageError
                                }
                            />

                        ) : (

                            /* ================================
                               FALLBACK
                            ================================= */

                            <div
                                className="
                                    story-card__placeholder
                                "
                                aria-hidden="true"
                            >

                                {username
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>

                        )

                    )}


                    {/* =========================================
                       MEDIA GRADIENT
                    ========================================= */}

                    <div
                        className="
                            story-card__gradient
                        "
                        aria-hidden="true"
                    />


                    {/* =========================================
                       AVATAR
                    ========================================= */}

                    <div
                        className="
                            story-card__avatar
                        "
                    >

                        {avatar ? (

                            <img
                                src={avatar}
                                alt=""
                                loading="lazy"
                                decoding="async"
                            />

                        ) : (

                            username
                                .charAt(0)
                                .toUpperCase()

                        )}

                    </div>


                    {/* =========================================
                       VERIFIED
                    ========================================= */}

                    {isVerified && (

                        <span
                            className="
                                story-card__verified
                            "
                            aria-label="Verified account"
                            title="Verified"
                        >

                            <CheckCircle2
                                size={14}
                                fill="currentColor"
                            />

                        </span>

                    )}


                    {/* =========================================
                       VIEWED INDICATOR
                    ========================================= */}

                    {isViewed && (

                        <span
                            className="
                                story-card__viewed
                            "
                            aria-label="Story viewed"
                        />

                    )}


                    {/* =========================================
                       VIDEO INDICATOR
                    ========================================= */}

                    {isVideo && (

                        <span
                            className="
                                story-card__video-indicator
                            "
                            aria-label="Video story"
                            title="Video"
                        >

                            <Play
                                size={11}
                                fill="currentColor"
                            />

                        </span>

                    )}


                    {/* =========================================
                       EXPIRY
                    ========================================= */}

                    {expiryInfo.text && (

                        <span
                            className={`
                                story-card__expiry

                                ${
                                    expiryInfo.urgent
                                        ? "story-card__expiry--urgent"
                                        : ""
                                }
                            `}
                        >

                            <Clock3
                                size={10}
                            />

                            {expiryInfo.text}

                        </span>

                    )}

                </div>


                {/* =============================================
                   USERNAME
                ============================================= */}

                <span
                    className="
                        story-card__username
                    "
                >
                    {username}
                </span>


                {/* =============================================
                   CAPTION
                ============================================= */}

                {caption && (

                    <span
                        className="
                            story-card__caption
                        "
                    >
                        {caption}
                    </span>

                )}

            </button>


            {/* =================================================
               MENU BUTTON

               IMPORTANT:
               This is outside the main button.
               Prevents nested <button> HTML issue.
            ================================================= */}

            {showMenu && (

                <button
                    type="button"
                    className="
                        story-card__menu
                    "
                    onClick={
                        handleMenuClick
                    }
                    aria-label="Story options"
                    aria-expanded={
                        menuOpen
                    }
                    aria-haspopup="menu"
                >

                    <MoreHorizontal
                        size={18}
                    />

                </button>

            )}


            {/* =================================================
               ACTION MENU
            ================================================= */}

            {showMenu &&
            menuOpen && (

                <div
                    className="
                        story-card__dropdown
                    "
                    role="menu"
                >

                    <button
                        type="button"
                        role="menuitem"
                        onClick={(event) =>
                            handleAction(
                                "view",
                                event
                            )
                        }
                    >
                        View Story
                    </button>


                    <button
                        type="button"
                        role="menuitem"
                        onClick={(event) =>
                            handleAction(
                                "share",
                                event
                            )
                        }
                    >
                        Share Story
                    </button>


                    {isOwnStory && (

                        <button
                            type="button"
                            role="menuitem"
                            className="
                                story-card__dropdown-delete
                            "
                            onClick={
                                handleDelete
                            }
                        >
                            Delete Story
                        </button>

                    )}

                </div>

            )}

        </article>
    );

}


export default StoryCard;