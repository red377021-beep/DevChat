import "./AIHistory.css";

import {
    MessageSquare,
    Clock3,
    MoreVertical,
    Trash2,
} from "lucide-react";


function AIHistory({
    conversations = [],
    onSelect,
    onDelete,
    onMore,
}) {

    return (
        <aside className="ai-history">

            <div className="ai-history__header">

                <div>
                    <h3>Recent Chats</h3>
                    <span>
                        {conversations.length} conversations
                    </span>
                </div>

            </div>


            <div className="ai-history__list">

                {conversations.length === 0 ? (

                    <div className="ai-history__empty">

                        <div className="ai-history__empty-icon">
                            <MessageSquare size={20} />
                        </div>

                        <strong>
                            No conversations yet
                        </strong>

                        <span>
                            Your AI chats will appear here.
                        </span>

                    </div>

                ) : (

                    conversations.map((conversation) => (

                        <button
                            key={conversation.id}
                            type="button"
                            className="ai-history__item"
                            onClick={() =>
                                onSelect?.(conversation)
                            }
                        >

                            <div className="ai-history__item-icon">
                                <MessageSquare size={16} />
                            </div>


                            <div className="ai-history__item-content">

                                <strong>
                                    {conversation.title ||
                                        "Untitled conversation"}
                                </strong>

                                <div className="ai-history__meta">

                                    <Clock3 size={11} />

                                    <span>
                                        {conversation.time ||
                                            "Recently"}
                                    </span>

                                </div>

                            </div>


                            <div className="ai-history__item-actions">

                                <span
                                    className="ai-history__more"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        onMore?.(conversation);
                                    }}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" ||
                                            event.key === " "
                                        ) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onMore?.(conversation);
                                        }
                                    }}
                                    aria-label="More options"
                                >
                                    <MoreVertical size={16} />
                                </span>

                            </div>

                        </button>

                    ))

                )}

            </div>

        </aside>
    );
}


export default AIHistory;