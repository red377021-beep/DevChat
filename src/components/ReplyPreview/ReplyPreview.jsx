import "./ReplyPreview.css";

import { X } from "lucide-react";

import { useChat } from "../../context/ChatContext";

function ReplyPreview() {

    const {

        replyMessage,

        setReplyMessage

    } = useChat();

    if (!replyMessage) return null;

    return (

        <div className="reply-preview">

            <div className="reply-line"></div>

            <div className="reply-content">

                <span className="reply-user">

                    {replyMessage.own ? "You" : "Reply"}

                </span>

                <p>

                    {replyMessage.text}

                </p>

            </div>

            <button

                className="reply-close"

                onClick={() => setReplyMessage(null)}

            >

                <X size={18} />

            </button>

        </div>

    );

}

export default ReplyPreview;