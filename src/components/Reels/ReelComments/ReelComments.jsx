import "./ReelComments.css";

import {
    MessageCircle,
    Send,
    X,
    Heart,
    MoreVertical,
    Reply,
    Pencil,
    Trash2,
    Flag,
    CornerDownRight,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";


// ======================================================
// PER-REEL COMMENTS STORE
// ======================================================

const commentsStore = new Map();


function ReelComments({
    open = false,
    onClose,
    reelId = null,
    username = "devuser",
    onCommentAdded,
}) {

    // ======================================================
    // COMMENT INPUT
    // ======================================================

    const [commentText, setCommentText] = useState("");


    // ======================================================
    // COMMENTS
    // ======================================================

    const [comments, setComments] = useState(() => {

        if (!reelId) {
            return [];
        }

        return commentsStore.get(reelId) || [];

    });


    // ======================================================
    // REPLY STATE
    // ======================================================

    const [replyingTo, setReplyingTo] = useState(null);

    const [replyText, setReplyText] = useState("");


    // ======================================================
    // EDIT STATE
    // ======================================================

    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editingText, setEditingText] =
        useState("");


    // ======================================================
    // MENU STATE
    // ======================================================

    const [activeMenu, setActiveMenu] =
        useState(null);


    // ======================================================
    // INPUT REF
    // ======================================================

    const commentInputRef = useRef(null);


    // ======================================================
    // CONSTANTS
    // ======================================================

    const MAX_COMMENT_LENGTH = 220;


    // ======================================================
    // LOAD COMMENTS WHEN REEL CHANGES
    // ======================================================

    useEffect(() => {

        if (!reelId) {

            setComments([]);

            return;

        }


        const savedComments =
            commentsStore.get(reelId) || [];


        setComments(savedComments);


        // Reset temporary UI state
        setCommentText("");

        setReplyingTo(null);

        setReplyText("");

        setEditingCommentId(null);

        setEditingText("");

        setActiveMenu(null);

    }, [reelId]);


    // ======================================================
    // SAVE COMMENTS FOR CURRENT REEL
    // ======================================================

    useEffect(() => {

        if (!reelId) {
            return;
        }


        commentsStore.set(
            reelId,
            comments
        );

    }, [reelId, comments]);


    // ======================================================
    // FOCUS INPUT
    // ======================================================

    useEffect(() => {

        if (!open) {
            return;
        }


        const timer = setTimeout(() => {

            commentInputRef.current?.focus();

        }, 150);


        return () => {

            clearTimeout(timer);

        };

    }, [open]);


    // ======================================================
    // CLOSE MENUS ON ESC
    // ======================================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key !== "Escape") {
                return;
            }


            setActiveMenu(null);

            setReplyingTo(null);

            setReplyText("");

            setEditingCommentId(null);

            setEditingText("");

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

    }, []);


    // ======================================================
    // FORMAT TIME
    // ======================================================

    const formatTime = (timestamp) => {

        const difference =
            Date.now() - timestamp;


        const seconds =
            Math.floor(
                difference / 1000
            );


        if (seconds < 10) {
            return "now";
        }


        if (seconds < 60) {
            return `${seconds}s`;
        }


        const minutes =
            Math.floor(
                seconds / 60
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


        if (days < 7) {
            return `${days}d`;
        }


        return new Date(timestamp)
            .toLocaleDateString();

    };


    // ======================================================
    // ADD MAIN COMMENT
    // ======================================================

    const handleAddComment = () => {

        const text =
            commentText.trim();


        if (!text) {
            return;
        }


        const newComment = {

            id:
                `${reelId || "reel"}-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,

            reelId: reelId,

            username: username,

            text: text,

            createdAt: Date.now(),

            liked: false,

            likeCount: 0,

            replies: [],

        };


        setComments((previousComments) => [

            ...previousComments,

            newComment,

        ]);


        setCommentText("");


        onCommentAdded?.(reelId);

    };


    // ======================================================
    // ENTER TO SEND COMMENT
    // ======================================================

    const handleCommentKeyDown = (event) => {

        if (event.key !== "Enter") {
            return;
        }


        if (event.shiftKey) {
            return;
        }


        event.preventDefault();


        handleAddComment();

    };


    // ======================================================
    // LIKE MAIN COMMENT
    // ======================================================

    const handleLikeComment = (commentId) => {

        setComments((previousComments) =>

            previousComments.map((comment) => {

                if (comment.id !== commentId) {
                    return comment;
                }


                const nextLiked =
                    !comment.liked;


                return {

                    ...comment,

                    liked: nextLiked,

                    likeCount:
                        nextLiked
                            ? comment.likeCount + 1
                            : Math.max(
                                0,
                                comment.likeCount - 1
                            ),

                };

            })

        );

    };


    // ======================================================
    // START REPLY
    // ======================================================

    const handleStartReply = (comment) => {

        setReplyingTo(comment.id);

        setReplyText(
            `@${comment.username} `
        );

        setEditingCommentId(null);

        setEditingText("");

        setActiveMenu(null);

    };


    // ======================================================
    // CANCEL REPLY
    // ======================================================

    const handleCancelReply = () => {

        setReplyingTo(null);

        setReplyText("");

    };


    // ======================================================
    // ADD REPLY
    // ======================================================

    const handleAddReply = (commentId) => {

        const text =
            replyText.trim();


        if (!text) {
            return;
        }


        const newReply = {

            id:
                `${reelId || "reel"}-reply-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}`,

            reelId: reelId,

            username: username,

            text: text,

            createdAt: Date.now(),

            liked: false,

            likeCount: 0,

        };


        setComments((previousComments) =>

            previousComments.map((comment) => {

                if (comment.id !== commentId) {
                    return comment;
                }


                return {

                    ...comment,

                    replies: [

                        ...(comment.replies || []),

                        newReply,

                    ],

                };

            })

        );


        setReplyText("");

        setReplyingTo(null);

    };


    // ======================================================
    // REPLY ENTER
    // ======================================================

    const handleReplyKeyDown = (
        event,
        commentId
    ) => {

        if (event.key !== "Enter") {
            return;
        }


        if (event.shiftKey) {
            return;
        }


        event.preventDefault();


        handleAddReply(commentId);

    };


    // ======================================================
    // LIKE REPLY
    // ======================================================

    const handleLikeReply = (
        commentId,
        replyId
    ) => {

        setComments((previousComments) =>

            previousComments.map((comment) => {

                if (comment.id !== commentId) {
                    return comment;
                }


                return {

                    ...comment,

                    replies:
                        (comment.replies || [])
                            .map((reply) => {

                                if (
                                    reply.id !==
                                    replyId
                                ) {
                                    return reply;
                                }


                                const nextLiked =
                                    !reply.liked;


                                return {

                                    ...reply,

                                    liked: nextLiked,

                                    likeCount:
                                        nextLiked
                                            ? reply.likeCount + 1
                                            : Math.max(
                                                0,
                                                reply.likeCount - 1
                                            ),

                                };

                            }),

                };

            })

        );

    };


    // ======================================================
    // START EDIT
    // ======================================================

    const handleStartEdit = (comment) => {

        setEditingCommentId(comment.id);

        setEditingText(comment.text);

        setReplyingTo(null);

        setReplyText("");

        setActiveMenu(null);

    };


    // ======================================================
    // CANCEL EDIT
    // ======================================================

    const handleCancelEdit = () => {

        setEditingCommentId(null);

        setEditingText("");

    };


    // ======================================================
    // SAVE EDIT
    // ======================================================

    const handleSaveEdit = (commentId) => {

        const text =
            editingText.trim();


        if (!text) {
            return;
        }


        setComments((previousComments) =>

            previousComments.map((comment) => {

                if (comment.id !== commentId) {
                    return comment;
                }


                return {

                    ...comment,

                    text: text,

                    edited: true,

                };

            })

        );


        setEditingCommentId(null);

        setEditingText("");

    };


    // ======================================================
    // DELETE COMMENT
    // ======================================================

    const handleDeleteComment = (commentId) => {

        setComments((previousComments) =>

            previousComments.filter(
                (comment) =>
                    comment.id !== commentId
            )

        );


        if (
            editingCommentId ===
            commentId
        ) {

            setEditingCommentId(null);

            setEditingText("");

        }


        if (
            replyingTo ===
            commentId
        ) {

            setReplyingTo(null);

            setReplyText("");

        }


        setActiveMenu(null);

    };


    // ======================================================
    // REPORT COMMENT
    // ======================================================

    const handleReportComment = () => {

        setActiveMenu(null);

        console.log(
            "Comment reported."
        );

    };


    // ======================================================
    // DON'T RENDER
    // ======================================================

    if (!open) {
        return null;
    }


    // ======================================================
    // TOTAL COMMENT COUNT
    // ======================================================

    const totalComments =
        comments.reduce(
            (total, comment) =>
                total +
                1 +
                (comment.replies?.length || 0),
            0
        );


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div className="reel-comments">


            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="reel-comments__header">

                <div>

                    <span className="reel-comments__eyebrow">
                        DevChat
                    </span>

                    <strong>
                        Comments
                    </strong>

                    <small>
                        {totalComments}{" "}
                        {totalComments === 1
                            ? "comment"
                            : "comments"}
                    </small>

                </div>


                <button
                    className="reel-comments__close"
                    type="button"
                    onClick={onClose}
                    aria-label="Close comments"
                >

                    <X size={20} />

                </button>

            </div>


            {/* ==================================================
                COMMENTS LIST
            ================================================== */}

            <div className="reel-comments__list">

                {comments.length === 0 ? (

                    <div className="reel-comments__empty">

                        <div className="reel-comments__empty-icon">

                            <MessageCircle
                                size={30}
                            />

                        </div>


                        <strong>
                            No comments yet
                        </strong>


                        <span>
                            Be the first to comment
                        </span>

                    </div>

                ) : (

                    comments.map((comment) => (

                        <div
                            className="reel-comment"
                            key={comment.id}
                        >


                            {/* ==================================================
                                AVATAR
                            ================================================== */}

                            <div className="reel-comment__avatar">

                                {comment.username
                                    ?.charAt(0)
                                    .toUpperCase() || "D"}

                            </div>


                            {/* ==================================================
                                COMMENT CONTENT
                            ================================================== */}

                            <div className="reel-comment__content">


                                {/* COMMENT TOP */}

                                <div className="reel-comment__top">

                                    <div>

                                        <strong>
                                            @{comment.username}
                                        </strong>

                                        <span>
                                            {formatTime(
                                                comment.createdAt
                                            )}
                                        </span>

                                        {comment.edited && (
                                            <span>
                                                edited
                                            </span>
                                        )}

                                    </div>


                                    {/* MORE */}

                                    <div className="reel-comment__menu-wrapper">

                                        <button
                                            className="reel-comment__more"
                                            type="button"
                                            onClick={() =>
                                                setActiveMenu(
                                                    activeMenu ===
                                                    comment.id
                                                        ? null
                                                        : comment.id
                                                )
                                            }
                                            aria-label="Comment options"
                                        >

                                            <MoreVertical
                                                size={17}
                                            />

                                        </button>


                                        {activeMenu ===
                                            comment.id && (

                                            <div className="reel-comment__menu">

                                                {comment.username ===
                                                    username && (

                                                    <>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleStartEdit(
                                                                    comment
                                                                )
                                                            }
                                                        >

                                                            <Pencil
                                                                size={15}
                                                            />

                                                            Edit

                                                        </button>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment.id
                                                                )
                                                            }
                                                        >

                                                            <Trash2
                                                                size={15}
                                                            />

                                                            Delete

                                                        </button>

                                                    </>

                                                )}


                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleReportComment
                                                    }
                                                >

                                                    <Flag
                                                        size={15}
                                                    />

                                                    Report

                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>


                                {/* ==================================================
                                    COMMENT TEXT / EDIT
                                ================================================== */}

                                {editingCommentId ===
                                comment.id ? (

                                    <div className="reel-comment__edit">

                                        <input
                                            type="text"
                                            value={editingText}
                                            maxLength={
                                                MAX_COMMENT_LENGTH
                                            }
                                            onChange={(event) =>
                                                setEditingText(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={(event) => {

                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {

                                                    event.preventDefault();

                                                    handleSaveEdit(
                                                        comment.id
                                                    );

                                                }


                                                if (
                                                    event.key ===
                                                    "Escape"
                                                ) {

                                                    handleCancelEdit();

                                                }

                                            }}
                                            autoFocus
                                        />


                                        <div>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleCancelEdit
                                                }
                                            >
                                                Cancel
                                            </button>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSaveEdit(
                                                        comment.id
                                                    )
                                                }
                                                disabled={
                                                    !editingText.trim()
                                                }
                                            >
                                                Save
                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <p>
                                        {comment.text}
                                    </p>

                                )}


                                {/* ==================================================
                                    COMMENT ACTIONS
                                ================================================== */}

                                <div className="reel-comment__actions">

                                    <button
                                        type="button"
                                        className={
                                            comment.liked
                                                ? "liked"
                                                : ""
                                        }
                                        onClick={() =>
                                            handleLikeComment(
                                                comment.id
                                            )
                                        }
                                    >

                                        <Heart
                                            size={15}
                                            fill={
                                                comment.liked
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />

                                        {comment.likeCount >
                                            0 && (
                                            <span>
                                                {
                                                    comment.likeCount
                                                }
                                            </span>
                                        )}

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStartReply(
                                                comment
                                            )
                                        }
                                    >

                                        <Reply
                                            size={15}
                                        />

                                        Reply

                                    </button>

                                </div>


                                {/* ==================================================
                                    REPLY INPUT
                                ================================================== */}

                                {replyingTo ===
                                    comment.id && (

                                    <div className="reel-comment__reply-box">

                                        <div className="reel-comment__reply-input">

                                            <input
                                                type="text"
                                                value={replyText}
                                                maxLength={
                                                    MAX_COMMENT_LENGTH
                                                }
                                                onChange={(event) =>
                                                    setReplyText(
                                                        event.target.value
                                                    )
                                                }
                                                onKeyDown={(event) =>
                                                    handleReplyKeyDown(
                                                        event,
                                                        comment.id
                                                    )
                                                }
                                                placeholder="Write a reply..."
                                                autoFocus
                                            />


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleAddReply(
                                                        comment.id
                                                    )
                                                }
                                                disabled={
                                                    !replyText.trim()
                                                }
                                                aria-label="Send reply"
                                            >

                                                <Send
                                                    size={16}
                                                />

                                            </button>

                                        </div>


                                        <button
                                            className="reel-comment__cancel-reply"
                                            type="button"
                                            onClick={
                                                handleCancelReply
                                            }
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                )}


                                {/* ==================================================
                                    REPLIES
                                ================================================== */}

                                {comment.replies?.length > 0 && (

                                    <div className="reel-comment__replies">

                                        {comment.replies.map(
                                            (reply) => (

                                            <div
                                                className="reel-comment__reply"
                                                key={reply.id}
                                            >

                                                <CornerDownRight
                                                    size={15}
                                                />


                                                <div className="reel-comment__avatar small">

                                                    {reply.username
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase() ||
                                                        "D"}

                                                </div>


                                                <div className="reel-comment__reply-content">

                                                    <div className="reel-comment__top">

                                                        <div>

                                                            <strong>
                                                                @
                                                                {
                                                                    reply.username
                                                                }
                                                            </strong>

                                                            <span>
                                                                {formatTime(
                                                                    reply.createdAt
                                                                )}
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <p>
                                                        {
                                                            reply.text
                                                        }
                                                    </p>


                                                    <button
                                                        type="button"
                                                        className={
                                                            reply.liked
                                                                ? "liked"
                                                                : ""
                                                        }
                                                        onClick={() =>
                                                            handleLikeReply(
                                                                comment.id,
                                                                reply.id
                                                            )
                                                        }
                                                    >

                                                        <Heart
                                                            size={14}
                                                            fill={
                                                                reply.liked
                                                                    ? "currentColor"
                                                                    : "none"
                                                            }
                                                        />

                                                        {reply.likeCount >
                                                            0 && (
                                                            <span>
                                                                {
                                                                    reply.likeCount
                                                                }
                                                            </span>
                                                        )}

                                                    </button>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    ))

                )}

            </div>


            {/* ==================================================
                MAIN COMMENT INPUT
            ================================================== */}

            <div className="reel-comments__input">

                <div className="reel-comments__input-box">

                    <input
                        ref={commentInputRef}
                        type="text"
                        value={commentText}
                        maxLength={
                            MAX_COMMENT_LENGTH
                        }
                        onChange={(event) =>
                            setCommentText(
                                event.target.value
                            )
                        }
                        onKeyDown={
                            handleCommentKeyDown
                        }
                        placeholder="Add a comment..."
                        aria-label="Add a comment"
                    />


                    <button
                        type="button"
                        onClick={handleAddComment}
                        disabled={
                            !commentText.trim()
                        }
                        aria-label="Send comment"
                    >

                        <Send size={18} />

                    </button>

                </div>


                <div className="reel-comments__input-meta">

                    <span>
                        {commentText.length}/
                        {MAX_COMMENT_LENGTH}
                    </span>

                    <span>
                        Enter to send
                    </span>

                </div>

            </div>

        </div>

    );

}


export default ReelComments;