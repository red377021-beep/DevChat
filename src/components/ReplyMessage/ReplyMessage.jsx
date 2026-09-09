import "./ReplyMessage.css";

function ReplyMessage({ reply }) {

    if (!reply) return null;

    return (

        <div className="reply-message">

            <div className="reply-message-line"></div>

            <div className="reply-message-content">

                <span>

                    {reply.sender}

                </span>

                <p>

                    {reply.text}

                </p>

            </div>

        </div>

    );

}

export default ReplyMessage;