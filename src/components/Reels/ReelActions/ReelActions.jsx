import "./ReelActions.css";

import ReelComments from "../ReelComments/ReelComments";
import ReelShare from "../ReelShare/ReelShare";

import {
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    MoreVertical,
    Link,
    Flag,
    Ban,
    BellOff,
    X,
} from "lucide-react";

import {
    useState,
} from "react";


function ReelActions({
    reel = null,
    onUpdateReel,
    onLikeReel,
    onSaveReel,
    onCommentAdded,
    onShareReel,
}) {

    // ======================================================
    // REEL DATA
    // ======================================================

    const liked =
        Boolean(reel?.liked);

    const saved =
        Boolean(reel?.saved);

    const likeCount =
        Number(reel?.likes) || 0;

    const commentCount =
        Number(reel?.comments) || 0;

    const shareCount =
        Number(reel?.shares) || 0;


    // ======================================================
    // COMMENTS STATE
    // ======================================================

    const [commentsOpen, setCommentsOpen] =
        useState(false);


    // ======================================================
    // SHARE STATE
    // ======================================================

    const [shareOpen, setShareOpen] =
        useState(false);


    // ======================================================
    // MORE MENU STATE
    // ======================================================

    const [moreOpen, setMoreOpen] =
        useState(false);


    // ======================================================
    // ACTION TOAST
    // ======================================================

    const [actionMessage, setActionMessage] =
        useState("");


    // ======================================================
    // SHOW ACTION MESSAGE
    // ======================================================

    const showActionMessage = (
        message,
        duration = 2500
    ) => {

        setActionMessage(message);

        setTimeout(() => {

            setActionMessage("");

        }, duration);

    };


    // ======================================================
    // LIKE
    // ======================================================

    const handleLike = () => {

        if (!reel?.id) {
            return;
        }


        if (onLikeReel) {

            onLikeReel(
                reel.id
            );

            return;

        }


        // Fallback
        onUpdateReel?.(
            reel.id,
            {
                liked: !liked,
                likes:
                    liked
                        ? Math.max(
                            0,
                            likeCount - 1
                        )
                        : likeCount + 1,
            }
        );

    };


    // ======================================================
    // OPEN COMMENTS
    // ======================================================

    const handleComments = () => {

        setCommentsOpen(true);

        setShareOpen(false);

        setMoreOpen(false);

    };


    // ======================================================
    // CLOSE COMMENTS
    // ======================================================

    const handleCloseComments = () => {

        setCommentsOpen(false);

    };


    // ======================================================
    // COMMENT ADDED
    // ======================================================

    const handleCommentAdded = (
        reelId
    ) => {

        if (onCommentAdded) {

            onCommentAdded(
                reelId || reel?.id
            );

        }

    };


    // ======================================================
    // OPEN SHARE
    // ======================================================

    const handleShare = () => {

        setShareOpen(true);

        setCommentsOpen(false);

        setMoreOpen(false);

    };


    // ======================================================
    // CLOSE SHARE
    // ======================================================

    const handleCloseShare = () => {

        setShareOpen(false);

    };


    // ======================================================
    // SHARE COMPLETED
    // ======================================================

    const handleShareCompleted = () => {

        if (onShareReel && reel?.id) {

            onShareReel(
                reel.id
            );

        }

    };


    // ======================================================
    // SAVE
    // ======================================================

    const handleSave = () => {

        if (!reel?.id) {
            return;
        }


        if (onSaveReel) {

            onSaveReel(
                reel.id
            );

            return;

        }


        // Fallback
        onUpdateReel?.(
            reel.id,
            {
                saved: !saved,
            }
        );

    };


    // ======================================================
    // COPY REEL LINK
    // ======================================================

    const handleCopyLink = async () => {

        try {

            if (
                typeof navigator !== "undefined" &&
                navigator.clipboard &&
                window.isSecureContext
            ) {

                await navigator.clipboard.writeText(
                    window.location.href
                );


                showActionMessage(
                    "Link copied!",
                    2000
                );

            } else {

                showActionMessage(
                    "Copy is not available in this browser."
                );

            }

        } catch (error) {

            console.error(
                "Failed to copy link:",
                error
            );


            showActionMessage(
                "Unable to copy link."
            );

        }

    };


    // ======================================================
    // NATIVE DEVICE SHARE
    // ======================================================

    const handleNativeShare = async () => {

        if (
            typeof navigator === "undefined" ||
            !navigator.share
        ) {

            return;

        }


        try {

            await navigator.share({

                title:
                    "DevChat Reel",

                text:
                    "Check out this Reel on DevChat!",

                url:
                    window.location.href,

            });


            handleShareCompleted();

        } catch (error) {

            if (
                error?.name !==
                "AbortError"
            ) {

                console.error(
                    "Share failed:",
                    error
                );

            }

        }

    };


    // ======================================================
    // OPEN MORE MENU
    // ======================================================

    const handleMoreOpen = () => {

        setMoreOpen(true);

        setShareOpen(false);

        setCommentsOpen(false);

    };


    // ======================================================
    // CLOSE MORE MENU
    // ======================================================

    const handleMoreClose = () => {

        setMoreOpen(false);

    };


    // ======================================================
    // MORE MENU - COPY LINK
    // ======================================================

    const handleMoreCopyLink = async () => {

        await handleCopyLink();

        setMoreOpen(false);

    };


    // ======================================================
    // NOT INTERESTED
    // ======================================================

    const handleNotInterested = () => {

        setMoreOpen(false);

        showActionMessage(
            "We'll show you fewer Reels like this."
        );

    };


    // ======================================================
    // DON'T RECOMMEND
    // ======================================================

    const handleDontRecommend = () => {

        setMoreOpen(false);

        showActionMessage(
            "Similar content will be reduced."
        );

    };


    // ======================================================
    // REPORT
    // ======================================================

    const handleReport = () => {

        setMoreOpen(false);

        showActionMessage(
            "Thanks. Your report has been received."
        );

    };


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <>

            {/* ==================================================
                REEL ACTIONS
            ================================================== */}

            <div className="reel-actions">


                {/* ==================================================
                    LIKE
                ================================================== */}

                <button
                    className={`reel-action ${
                        liked
                            ? "liked"
                            : ""
                    }`}
                    type="button"
                    onClick={handleLike}
                    aria-label={
                        liked
                            ? "Unlike Reel"
                            : "Like Reel"
                    }
                >

                    <Heart
                        size={28}
                        fill={
                            liked
                                ? "currentColor"
                                : "none"
                        }
                    />

                    <span>
                        {likeCount}
                    </span>

                </button>


                {/* ==================================================
                    COMMENTS
                ================================================== */}

                <button
                    className="reel-action"
                    type="button"
                    onClick={handleComments}
                    aria-label="Comments"
                >

                    <MessageCircle
                        size={27}
                    />

                    <span>
                        {commentCount}
                    </span>

                </button>


                {/* ==================================================
                    SHARE
                ================================================== */}

                <button
                    className="reel-action"
                    type="button"
                    onClick={handleShare}
                    aria-label="Share Reel"
                >

                    <Send
                        size={27}
                    />

                    <span>
                        {shareCount > 0
                            ? shareCount
                            : "Share"}
                    </span>

                </button>


                {/* ==================================================
                    SAVE
                ================================================== */}

                <button
                    className={`reel-action ${
                        saved
                            ? "saved"
                            : ""
                    }`}
                    type="button"
                    onClick={handleSave}
                    aria-label={
                        saved
                            ? "Unsave Reel"
                            : "Save Reel"
                    }
                >

                    <Bookmark
                        size={27}
                        fill={
                            saved
                                ? "currentColor"
                                : "none"
                        }
                    />

                    <span>
                        {
                            saved
                                ? "Saved"
                                : "Save"
                        }
                    </span>

                </button>


                {/* ==================================================
                    MORE
                ================================================== */}

                <button
                    className="reel-action"
                    type="button"
                    onClick={handleMoreOpen}
                    aria-label="More options"
                >

                    <MoreVertical
                        size={27}
                    />

                </button>


            </div>


            {/* ==================================================
                ACTION TOAST
            ================================================== */}

            {actionMessage && (

                <div
                    className="reel-action-toast"
                    role="status"
                >

                    {actionMessage}

                </div>

            )}


            {/* ==================================================
                REEL COMMENTS
            ================================================== */}

            <ReelComments
                open={commentsOpen}
                onClose={handleCloseComments}
                reelId={reel?.id}
                username={
                    reel?.username ||
                    "devuser"
                }
                onCommentAdded={
                    handleCommentAdded
                }
            />


            {/* ==================================================
                REEL SHARE
            ================================================== */}

            <ReelShare
                open={shareOpen}
                onClose={handleCloseShare}
                reel={reel}
                onShareCompleted={
                    handleShareCompleted
                }
                onNativeShare={
                    handleNativeShare
                }
            />


            {/* ==================================================
                MORE MENU
            ================================================== */}

            {moreOpen && (

                <div
                    className="reel-more-overlay"
                    onClick={handleMoreClose}
                >

                    <div
                        className="reel-more-menu"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* MORE HEADER */}

                        <div className="reel-more-header">

                            <strong>
                                Reel Options
                            </strong>

                            <button
                                type="button"
                                onClick={
                                    handleMoreClose
                                }
                                aria-label="Close options"
                            >

                                <X
                                    size={20}
                                />

                            </button>

                        </div>


                        {/* COPY LINK */}

                        <button
                            className="reel-more-item"
                            type="button"
                            onClick={
                                handleMoreCopyLink
                            }
                        >

                            <span className="reel-more-icon">

                                <Link
                                    size={19}
                                />

                            </span>

                            <div>

                                <strong>
                                    Copy Link
                                </strong>

                                <small>
                                    Copy this Reel link
                                </small>

                            </div>

                        </button>


                        {/* NOT INTERESTED */}

                        <button
                            className="reel-more-item"
                            type="button"
                            onClick={
                                handleNotInterested
                            }
                        >

                            <span className="reel-more-icon">

                                <Ban
                                    size={19}
                                />

                            </span>

                            <div>

                                <strong>
                                    Not Interested
                                </strong>

                                <small>
                                    Show fewer Reels like this
                                </small>

                            </div>

                        </button>


                        {/* DON'T RECOMMEND */}

                        <button
                            className="reel-more-item"
                            type="button"
                            onClick={
                                handleDontRecommend
                            }
                        >

                            <span className="reel-more-icon">

                                <BellOff
                                    size={19}
                                />

                            </span>

                            <div>

                                <strong>
                                    Don't Recommend
                                </strong>

                                <small>
                                    Reduce similar content
                                </small>

                            </div>

                        </button>


                        {/* REPORT */}

                        <button
                            className="reel-more-item report"
                            type="button"
                            onClick={
                                handleReport
                            }
                        >

                            <span className="reel-more-icon">

                                <Flag
                                    size={19}
                                />

                            </span>

                            <div>

                                <strong>
                                    Report
                                </strong>

                                <small>
                                    Report this Reel
                                </small>

                            </div>

                        </button>


                    </div>

                </div>

            )}

        </>

    );

}


export default ReelActions;