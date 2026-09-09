import "./EmojiButton.css";

import { useEffect, useRef, useState } from "react";
import { Smile } from "lucide-react";

import EmojiPicker from "../EmojiPicker";

function EmojiButton({

    value = "",

    onChange,

    onEmojiSelect,

    icon,

}) {

    // =====================================================
    // States
    // =====================================================

    const [open, setOpen] = useState(false);

    const buttonRef = useRef(null);

    const popupRef = useRef(null);

    // =====================================================
    // Toggle
    // =====================================================

    function togglePicker() {

        setOpen((prev) => !prev);

    }

    // =====================================================
    // Emoji Selected
    // =====================================================

    function handleEmojiClick(emojiData) {

        // ==========================================
        // Reaction Mode
        // ==========================================

        if (onEmojiSelect) {

            onEmojiSelect(emojiData.emoji);

            setOpen(false);

            return;

        }

        // ==========================================
        // Input Mode
        // ==========================================

        if (onChange) {

            onChange(value + emojiData.emoji);

        }

        // Message Input me picker open hi rahega

    }

    // =====================================================
    // Outside Click
    // =====================================================

    useEffect(() => {

        function handleOutside(event) {

            if (

                popupRef.current &&
                !popupRef.current.contains(event.target) &&

                buttonRef.current &&
                !buttonRef.current.contains(event.target)

            ) {

                setOpen(false);

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

    }, []);

    // =====================================================
    // ESC Close
    // =====================================================

    useEffect(() => {

        function handleEscape(event) {

            if (event.key === "Escape") {

                setOpen(false);

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

    }, []);

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="emoji-button-wrapper">

            <button

                ref={buttonRef}

                type="button"

                className={`emoji-btn ${open ? "active" : ""}`}

                onClick={togglePicker}

            >

                {

                    icon ||

                    <Smile size={19} />

                }

            </button>

            {

                open && (

                    <div

                        ref={popupRef}

                        className="emoji-popup"

                    >

                        <EmojiPicker

                            onEmojiClick={handleEmojiClick}

                        />

                    </div>

                )

            }

        </div>

    );

}

export default EmojiButton;