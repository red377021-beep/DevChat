import "./ReplyBubble.css";

import { CornerUpLeft } from "lucide-react";

function ReplyBubble({

    sender,

    text

}) {

    if (!text) return null;

    return (

        <div className="reply-bubble">

            <div className="reply-line" />

            <div className="reply-body">

                <div className="reply-sender">

                    <CornerUpLeft size={13} />

                    <span>{sender}</span>

                </div>

                <p>{text}</p>

            </div>

        </div>

    );

}

export default ReplyBubble;