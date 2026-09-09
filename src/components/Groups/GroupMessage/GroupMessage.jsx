import "./GroupMessage.css";

import {
    MoreVertical,
    Reply,
    Check,
    CheckCheck,
} from "lucide-react";


function GroupMessage({
    message = {},
    isOwn = false,
    onReply,
    onMore,
}) {
    const senderName =
        message?.senderName || "Member";

    const text =
        message?.text || "";

    const time =
        message?.time ||
        message?.createdAt ||
        "";

    const status =
        String(
            message?.status || "sent"
        ).toLowerCase();

    const avatar =
        message?.avatar || "";

    const replyTo =
        message?.replyTo || null;


    const initial =
        String(senderName)
            .trim()
            .charAt(0)
            .toUpperCase() || "M";


    const hasText =
        Boolean(String(text).trim());


    return (
        <article
            className={`group-message ${
                isOwn
                    ? "group-message-own"
                    : ""
            }`}
        >

            {/* =====================================================
                SENDER NAME
            ===================================================== */}

            {!isOwn && (
                <div className="group-message-sender">
                    {senderName}
                </div>
            )}


            {/* =====================================================
                MESSAGE ROW
            ===================================================== */}

            <div className="group-message-row">

                {!isOwn && (
                    <button
                        type="button"
                        className="group-message-avatar-button"
                        onClick={() =>
                            onMore?.(message)
                        }
                        aria-label={`Options for ${senderName}`}
                    >
                        <div className="group-message-avatar">

                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={senderName}
                                    loading="lazy"
                                />
                            ) : (
                                <span>
                                    {initial}
                                </span>
                            )}

                        </div>
                    </button>
                )}


                <div className="group-message-content">

                    {/* =================================================
                        REPLY PREVIEW
                    ================================================= */}

                    {replyTo && (
                        <button
                            type="button"
                            className="group-message-reply"
                            onClick={() =>
                                onReply?.(
                                    replyTo
                                )
                            }
                            aria-label="View replied message"
                        >

                            <span>
                                {replyTo?.senderName ||
                                    "Member"}
                            </span>

                            <p>
                                {replyTo?.text ||
                                    "Message"}
                            </p>

                        </button>
                    )}


                    {/* =================================================
                        MESSAGE BUBBLE
                    ================================================= */}

                    {hasText && (
                        <div className="group-message-bubble">

                            <p>
                                {text}
                            </p>


                            <div className="group-message-meta">

                                {time && (
                                    <time>
                                        {time}
                                    </time>
                                )}


                                {isOwn && (
                                    <span
                                        className={`group-message-status ${
                                            status ===
                                            "read"
                                                ? "read"
                                                : ""
                                        }`}
                                        aria-label={
                                            status ===
                                            "read"
                                                ? "Read"
                                                : "Sent"
                                        }
                                    >
                                        {status ===
                                        "read" ? (
                                            <CheckCheck
                                                size={13}
                                                strokeWidth={2.2}
                                            />
                                        ) : (
                                            <Check
                                                size={13}
                                                strokeWidth={2.2}
                                            />
                                        )}
                                    </span>
                                )}

                            </div>

                        </div>
                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="group-message-actions">

                        <button
                            type="button"
                            onClick={() =>
                                onReply?.(
                                    message
                                )
                            }
                            aria-label="Reply to message"
                            title="Reply"
                        >
                            <Reply
                                size={14}
                                strokeWidth={2}
                            />
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onMore?.(
                                    message
                                )
                            }
                            aria-label="More message options"
                            title="More"
                        >
                            <MoreVertical
                                size={14}
                                strokeWidth={2}
                            />
                        </button>

                    </div>

                </div>

            </div>

        </article>
    );
}


export default GroupMessage;