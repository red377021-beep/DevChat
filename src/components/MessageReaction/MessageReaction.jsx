import "./MessageReaction.css";

function MessageReaction({ reactions = [] }) {

    if (!reactions.length) return null;

    return (

        <div className="message-reactions">

            {reactions.map((reaction, index) => (

                <div

                    key={index}

                    className="reaction-chip"

                >

                    <span>{reaction.emoji}</span>

                    {

                        reaction.count > 1 && (

                            <small>

                                {reaction.count}

                            </small>

                        )

                    }

                </div>

            ))}

        </div>

    );

}

export default MessageReaction;