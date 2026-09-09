import "./ReactionPicker.css";

import {

    useEffect,
    useRef

} from "react";

import EmojiButton from "../EmojiButton";

const quickReactions = [

    "❤️",
    "😂",
    "😍",
    "🔥",
    "👍",
    "👏",
    "😎",
    "😭",
    "🎉"

];

function ReactionPicker({

    onSelect,

    onClose

}) {

    // =====================================================
    // Refs
    // =====================================================

    const pickerRef = useRef(null);

    // =====================================================
    // Outside Click
    // =====================================================

    useEffect(() => {

        function handleOutside(event) {

            if (

                pickerRef.current &&
                !pickerRef.current.contains(event.target)

            ) {

                onClose?.();

            }

        }

        document.addEventListener(

            "mousedown",

            handleOutside

        );

        return () => {

            document.removeEventListener(

                "mousedown",

                handleOutside

            );

        };

    }, [onClose]);

    // =====================================================
    // ESC
    // =====================================================

    useEffect(() => {

        function handleEscape(event) {

            if (event.key === "Escape") {

                onClose?.();

            }

        }

        document.addEventListener(

            "keydown",

            handleEscape

        );

        return () => {

            document.removeEventListener(

                "keydown",

                handleEscape

            );

        };

    }, [onClose]);

    // =====================================================
    // Scroll Close
    // =====================================================

    useEffect(() => {

        function handleScroll() {

            onClose?.();

        }

        window.addEventListener(

            "scroll",

            handleScroll,

            true

        );

        return () => {

            window.removeEventListener(

                "scroll",

                handleScroll,

                true

            );

        };

    }, [onClose]);

    // =====================================================
    // Resize Close
    // =====================================================

    useEffect(() => {

        function handleResize() {

            onClose?.();

        }

        window.addEventListener(

            "resize",

            handleResize

        );

        return () => {

            window.removeEventListener(

                "resize",

                handleResize

            );

        };

    }, [onClose]);

    // =====================================================
    // UI
    // =====================================================

    return (

        <div

            ref={pickerRef}

            className="reaction-picker"

        >

            {/* ====================================== */}
            {/* Quick Reactions */}
            {/* ====================================== */}

            {

                quickReactions.map((emoji) => (

                    <button

                        key={emoji}

                        className="reaction-btn"

                        onClick={() => {

                            onSelect?.(emoji);

                            onClose?.();

                        }}

                    >

                        {emoji}

                    </button>

                ))

            }

            {/* ====================================== */}
            {/* Custom Emoji */}
            {/* ====================================== */}

            <EmojiButton

                icon={

                    <span className="reaction-plus-icon">

                        +

                    </span>

                }

                onEmojiSelect={(emoji) => {

                    onSelect?.(emoji);

                    onClose?.();

                }}

            />

        </div>

    );

}

export default ReactionPicker;