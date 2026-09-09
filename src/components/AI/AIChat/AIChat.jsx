import "./AIChat.css";

import AIMessage from "../AIMessage/AIMessage";


function AIChat({
    messages = [],
    onCopy,
    onRegenerate,
}) {

    return (
        <section className="ai-chat">

            <div className="ai-chat__messages">

                {messages.length === 0 ? (

                    <div className="ai-chat__empty">

                        <div className="ai-chat__empty-icon">
                            ✦
                        </div>

                        <h2>
                            How can I help you?
                        </h2>

                        <p>
                            Ask DevChat AI anything. You can write,
                            code, learn, brainstorm, or solve problems.
                        </p>

                    </div>

                ) : (

                    messages.map((message) => (

                        <AIMessage
                            key={message.id}
                            message={message}
                            onCopy={onCopy}
                            onRegenerate={onRegenerate}
                        />

                    ))

                )}

            </div>

        </section>
    );
}


export default AIChat;