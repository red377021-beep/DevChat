import "./MessageActions.css";

import { Smile, Reply, MoreHorizontal, Info } from "lucide-react";

import { useChat } from "../../context/ChatContext";

function MessageActions({
    own = false,
    visible = false,
    message,
    onReaction,
    onReply,
    onMore,
    onInfo
}) {

    // =====================================================
    // Context
    // =====================================================

    const {
    startSelection,
    closeContextMenu
} = useChat();

    // =====================================================
    // Hide
    // =====================================================

    if (!visible) {

        return null;

    }

    // =====================================================
    // Handlers
    // =====================================================

    function handleReaction(event) {

        event.stopPropagation();

        onReaction?.();

    }

    function handleReply(event) {

        event.stopPropagation();

        onReply?.();

    }

    function handleMore(event) {

        event.stopPropagation();

        onMore?.(event);

    }

    function handleSelect(event) {

        event.stopPropagation();

        if (!message) {

            return;

        }

        startSelection(message.id);

        closeContextMenu();

    }

    // =====================================================
    // UI
    // =====================================================

    return (

        <div
                className={`message-actions ${own ? "own" : "other"} show`}
            onClick={(event) => event.stopPropagation()}
        >

            {/* ====================================== */}
            {/* React */}
            {/* ====================================== */}

            <button
    type="button"
    className="action-btn"
    title="React"
    onClick={handleReaction}
>
    <Smile size={16} />
</button>



            
            {/* ====================================== */}
            {/* Reply */}
            {/* ====================================== */}

            <button
                type="button"
                className="action-btn"
                title="Reply"
                onClick={handleReply}
            >

                <Reply size={16} />

            </button>

            {/* ====================================== */}
            {/* Select */}
            {/* ====================================== */}

            <button
                type="button"
                className="action-btn"
                title="Select"
                onClick={handleSelect}
            >

                ✓

            </button>

           

            {/* ====================================== */}
            {/* info */}
            {/* ====================================== */}

          <button
    type="button"
    className="action-btn"
    title="Message Info"
    onClick={(event) => {
        event.stopPropagation();

        if (!message) {
            return;
        }

        onInfo?.(message);
    }}
>
    <Info size={16} />
</button>



            {/* ====================================== */}
            {/* More */}
            {/* ====================================== */}

            <button
                type="button"
                className="action-btn"
                title="More"
                onClick={handleMore}
            >

                <MoreHorizontal size={16} />

            </button>

        </div>

    );

}

export default MessageActions;