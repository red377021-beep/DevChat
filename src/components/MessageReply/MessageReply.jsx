import "./MessageReply.css";

import { CornerUpLeft, X } from "lucide-react";

function MessageReply({

    sender = "Red Devil",

    message = "This is a reply message...",

    onClose

}) {

    return (

        <div className="message-reply">

            <div className="reply-bar" />

            <div className="reply-content">

                <div className="reply-header">

                    <CornerUpLeft size={15} />

                    <span>{sender}</span>

                </div>

                <p>{message}</p>

            </div>

            <button
                className="reply-close"
                onClick={onClose}
            >
                <X size={16} />
            </button>

        </div>

    );

}

export default MessageReply;