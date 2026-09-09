import "./ChatSearch.css";

import {
    Search,
    X,
    ChevronUp,
    ChevronDown
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import { useChat } from "../../context/ChatContext";

function ChatSearch({ onClose }) {

    const {
        messages
    } = useChat();

    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const inputRef = useRef(null);

    const allMessages = Array.isArray(messages)
        ? messages
        : [];

    // ==========================================
    // SEARCH RESULTS
    // ==========================================

    const results = useMemo(() => {

        const searchText = query.trim().toLowerCase();

        if (!searchText) {
            return [];
        }

        return allMessages.filter((message) => {

            if (!message) {
                return false;
            }

            const text =
                typeof message.text === "string"
                    ? message.text.toLowerCase()
                    : "";

            return text.includes(searchText);

        });

    }, [allMessages, query]);


    // ==========================================
    // RESET ACTIVE RESULT
    // ==========================================

    useEffect(() => {

        setActiveIndex(0);

    }, [query]);


    // ==========================================
    // FOCUS INPUT
    // ==========================================

    useEffect(() => {

        inputRef.current?.focus();

    }, []);


    // ==========================================
    // SCROLL TO RESULT
    // ==========================================

    useEffect(() => {

        if (!results.length) {
            return;
        }

        const message =
            results[activeIndex];

        if (!message?.id) {
            return;
        }

        const element =
            document.getElementById(
                `message-${message.id}`
            );

        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        element.classList.add(
            "chat-search-highlight"
        );

        const timer =
            window.setTimeout(() => {

                element.classList.remove(
                    "chat-search-highlight"
                );

            }, 1200);

        return () => {

            window.clearTimeout(timer);

            element.classList.remove(
                "chat-search-highlight"
            );

        };

    }, [results, activeIndex]);


    // ==========================================
    // NEXT RESULT
    // ==========================================

    function nextResult() {

        if (!results.length) {
            return;
        }

        setActiveIndex((previous) => {

            return (
                (previous + 1) %
                results.length
            );

        });

    }


    // ==========================================
    // PREVIOUS RESULT
    // ==========================================

    function previousResult() {

        if (!results.length) {
            return;
        }

        setActiveIndex((previous) => {

            return (
                (previous - 1 + results.length) %
                results.length
            );

        });

    }


    // ==========================================
    // KEYBOARD
    // ==========================================

    function handleKeyDown(event) {

        if (event.key === "Escape") {

            onClose?.();

            return;

        }

        if (event.key === "Enter") {

            if (event.shiftKey) {

                previousResult();

            } else {

                nextResult();

            }

        }

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="chat-search">

            <div className="chat-search-icon">

                <Search size={18} />

            </div>


            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) =>
                    setQuery(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Search messages..."
                className="chat-search-input"
                aria-label="Search messages"
            />


            <div className="chat-search-count">

                {query.trim()
                    ? results.length
                        ? `${activeIndex + 1}/${results.length}`
                        : "0"
                    : ""
                }

            </div>


            <button
                type="button"
                className="chat-search-btn"
                onClick={previousResult}
                disabled={!results.length}
                title="Previous result"
                aria-label="Previous result"
            >

                <ChevronUp size={18} />

            </button>


            <button
                type="button"
                className="chat-search-btn"
                onClick={nextResult}
                disabled={!results.length}
                title="Next result"
                aria-label="Next result"
            >

                <ChevronDown size={18} />

            </button>


            <button
                type="button"
                className="chat-search-close"
                onClick={onClose}
                title="Close search"
                aria-label="Close search"
            >

                <X size={18} />

            </button>

        </div>

    );

}

export default ChatSearch;