import "./PinnedMessageBar.css";import {
    Pin,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";


import { useState } from "react";
import { useChat } from "../../context/ChatContext";

function PinnedMessageBar() {

    const {

    pinnedMessages,
    unpinMessage

} = useChat();

    const [currentIndex, setCurrentIndex] = useState(0);

    // =====================================
    // Hide
    // =====================================

    if (!pinnedMessages || pinnedMessages.length === 0) {

        return null;

    }

    const current = pinnedMessages[currentIndex];

    // =====================================
    // Previous
    // =====================================

    function previous() {

        setCurrentIndex(prev =>

            prev === 0

                ? pinnedMessages.length - 1

                : prev - 1

        );

    }

    // =====================================
    // Next
    // =====================================

    function next() {

        setCurrentIndex(prev =>

            prev === pinnedMessages.length - 1

                ? 0

                : prev + 1

        );

    }

    // =====================================
    // Scroll To Message
    // =====================================

   function scrollToMessage() {

    const element = document.getElementById(
        `message-${current.id}`
    );

    if (!element) return;

    element.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    element.classList.remove("pinned-message-highlight");

    void element.offsetWidth;

    element.classList.add("pinned-message-highlight");

    setTimeout(() => {

        element.classList.remove(
            "pinned-message-highlight"
        );

    }, 2000);

}

    // =====================================
    // UI
    // =====================================

    return (

        <div className="pinned-message-bar">

            <button

                className="pin-nav"

                onClick={previous}

            >

                <ChevronLeft size={18} />

            </button>

            <div

                className="pinned-content"

                onClick={scrollToMessage}

            >

                <Pin size={16} />

                <span className="pinned-text">

                    {current.text || "Pinned Message"}

                </span>

            </div>

            <span className="pin-counter">

                {currentIndex + 1}/{pinnedMessages.length}

            </span>

            <button

    className="pin-nav"

    title="Unpin"

    onClick={(e) => {

        e.stopPropagation();

        unpinMessage(current.id);

        if (currentIndex > 0) {

            setCurrentIndex(prev => prev - 1);

        }

    }}

>

    <X size={17} />

</button>

            <button

                className="pin-nav"

                onClick={next}

            >

                <ChevronRight size={18} />

            </button>

        </div>

    );

}

export default PinnedMessageBar;