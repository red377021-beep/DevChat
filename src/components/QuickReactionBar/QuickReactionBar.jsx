import "./QuickReactionBar.css";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function QuickReactionBar({

    onReaction

}) {

    // ==========================================
    // States
    // ==========================================

    const [pickerOpen, setPickerOpen] = useState(false);

    const pickerRef = useRef(null);

    // ==========================================
    // Outside Click
    // ==========================================

    useEffect(() => {

        function handleClick(e) {

            if (

                pickerRef.current &&
                !pickerRef.current.contains(e.target)

            ) {

                setPickerOpen(false);

            }

        }

        document.addEventListener("mousedown", handleClick);

        return () => {

            document.removeEventListener(

                "mousedown",
                handleClick

            );

        };

    }, []);

    // ==========================================
    // ESC Close
    // ==========================================

    useEffect(() => {

        function handleEsc(e) {

            if (e.key === "Escape") {

                setPickerOpen(false);

            }

        }

        document.addEventListener("keydown", handleEsc);

        return () => {

            document.removeEventListener(

                "keydown",
                handleEsc

            );

        };

    }, []);

    // ==========================================
    // Quick Reaction
    // ==========================================

    function react(emoji) {

        if (onReaction) {

            onReaction(emoji);

        }

        setPickerOpen(false);

    }

    // ==========================================
    // Emoji Selected
    // ==========================================

    function handleEmojiClick(data) {

        react(data.emoji);

    }

    // ==========================================
    // Toggle Picker
    // ==========================================

    function togglePicker(e) {

        e.stopPropagation();

        setPickerOpen(prev => !prev);

    }

    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="quick-reaction-bar">

            <button onClick={() => react("❤️")}>❤️</button>

            <button onClick={() => react("😂")}>😂</button>

            <button onClick={() => react("😮")}>😮</button>

            <button onClick={() => react("😢")}>😢</button>

            <button onClick={() => react("😡")}>😡</button>

            <button onClick={() => react("👍")}>👍</button>

            <button

                type="button"

                className="plus-btn"

                onClick={togglePicker}

            >

                <Plus size={16} />

            </button>

            {

                pickerOpen && (

                    <div

                        ref={pickerRef}

                        className="reaction-picker"

                        onClick={(e) => e.stopPropagation()}

                    >

                        <EmojiPicker

                            onEmojiClick={handleEmojiClick}

                            lazyLoadEmojis

                            skinTonesDisabled

                            previewConfig={{

                                showPreview:false

                            }}

                            searchDisabled={false}

                            width={320}

                            height={420}

                        />

                    </div>

                )

            }

        </div>

    );

}

export default QuickReactionBar;