import "./MessageInfo.css";

import {
    X,
    Check,
    CheckCheck,
    Info,
    Image as ImageIcon,
    Video,
    FileText,
    Mic,
    Reply
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

function MessageInfo() {

    const {
        messageInfo,
        setMessageInfo
    } = useChat();


    // ==========================================================
    // SAFETY
    // ==========================================================

    if (!messageInfo) {
        return null;
    }


    // ==========================================================
    // CLOSE
    // ==========================================================

    function closeInfo() {
        setMessageInfo(null);
    }


    // ==========================================================
    // MESSAGE PREVIEW
    // ==========================================================

    function getMessagePreview() {

        if (messageInfo.deleted) {
            return "This message was deleted";
        }

        if (messageInfo.text) {
            return messageInfo.text;
        }

        if (messageInfo.image) {
            return "Image";
        }

        if (messageInfo.video) {
            return "Video";
        }

        if (messageInfo.file) {
            return "File";
        }

        if (messageInfo.audio) {
            return "Voice Message";
        }

        return "Message";
    }


    // ==========================================================
    // ATTACHMENT TYPE
    // ==========================================================

    function getAttachmentInfo() {

        if (messageInfo.image) {
            return {
                label: "Image",
                icon: ImageIcon
            };
        }

        if (messageInfo.video) {
            return {
                label: "Video",
                icon: Video
            };
        }

        if (messageInfo.file) {
            return {
                label: "File",
                icon: FileText
            };
        }

        if (messageInfo.audio) {
            return {
                label: "Voice Message",
                icon: Mic
            };
        }

        return null;
    }


    const attachment = getAttachmentInfo();

    const AttachmentIcon =
        attachment?.icon;


    // ==========================================================
    // DELIVERY STATUS
    // ==========================================================

    const isSeen = Boolean(
        messageInfo.seen
    );


    // ==========================================================
    // UI
    // ==========================================================

    return (

        <div
            className="message-info-overlay"
            onClick={closeInfo}
        >

            <div
                className="message-info-panel"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="message-info-header">

                    <div className="message-info-title">

                        <Info size={19} />

                        <h3>
                            Message Info
                        </h3>

                    </div>


                    <button
                        type="button"
                        className="message-info-close"
                        onClick={closeInfo}
                        aria-label="Close message info"
                        title="Close"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* ==================================================
                    MESSAGE PREVIEW
                ================================================== */}

                <div className="message-info-message">

                    <span className="message-info-preview-label">
                        Message
                    </span>

                    <div className="message-info-preview">

                        {getMessagePreview()}

                    </div>

                </div>


                {/* ==================================================
                    DELIVERED
                ================================================== */}

                <div className="message-info-row">

                    <Check size={18} />

                    <div>

                        <span>
                            Delivered
                        </span>

                        <strong>
                            {messageInfo.time || "Unknown"}
                        </strong>

                    </div>

                </div>


                {/* ==================================================
                    SEEN
                ================================================== */}

                <div className="message-info-row">

                    {isSeen ? (
                        <CheckCheck size={18} />
                    ) : (
                        <Check size={18} />
                    )}

                    <div>

                        <span>
                            Seen
                        </span>

                        <strong>
                            {isSeen
                                ? messageInfo.time || "Seen"
                                : "Not seen yet"
                            }
                        </strong>

                    </div>

                </div>


                {/* ==================================================
                    REPLY
                ================================================== */}

                {messageInfo.reply && (

                    <div className="message-info-row">

                        <Reply size={18} />

                        <div>

                            <span>
                                Replying To
                            </span>

                            <strong>
                                {messageInfo.reply.text ||
                                    "Message"
                                }
                            </strong>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    ATTACHMENT
                ================================================== */}

                {attachment && (

                    <div className="message-info-row">

                        {AttachmentIcon && (
                            <AttachmentIcon size={18} />
                        )}

                        <div>

                            <span>
                                Attachment
                            </span>

                            <strong>
                                {attachment.label}
                            </strong>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    MESSAGE TYPE
                ================================================== */}

                <div className="message-info-row">

                    <Info size={18} />

                    <div>

                        <span>
                            Message Type
                        </span>

                        <strong>
                            {messageInfo.own
                                ? "Sent Message"
                                : "Received Message"
                            }
                        </strong>

                    </div>

                </div>


                {/* ==================================================
                    EDITED
                ================================================== */}

                {messageInfo.edited && (

                    <div className="message-info-row">

                        <Check size={18} />

                        <div>

                            <span>
                                Status
                            </span>

                            <strong>
                                Edited
                            </strong>

                        </div>

                    </div>

                )}


                {/* ==================================================
                    DELETED
                ================================================== */}

                {messageInfo.deleted && (

                    <div className="message-info-row message-info-danger">

                        <X size={18} />

                        <div>

                            <span>
                                Status
                            </span>

                            <strong>
                                Deleted
                            </strong>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );
}

export default MessageInfo;