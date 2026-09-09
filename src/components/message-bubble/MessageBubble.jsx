// ======================================================
// DEVCHAT MESSAGE BUBBLE
// ======================================================

import "./MessageBubble.css";

function MessageBubble({ message }) {

    const isOwn = message.sender === "me";

    return (

        <div
            className={`message-row ${
                isOwn ? "own" : ""
            }`}
        >

            <div
                className={`message-bubble ${
                    isOwn ? "own" : ""
                }`}
            >

                <div className="message-text">

                    {message.text}

                </div>

                <div className="message-footer">

                    <span>

                        {message.time}

                    </span>

                    {isOwn && (

                        <span className="message-seen">

                            {message.seen
                                ? "✓✓"
                                : "✓"}

                        </span>

                    )}

                </div>

            </div>

        </div>

    );

}

export default MessageBubble;