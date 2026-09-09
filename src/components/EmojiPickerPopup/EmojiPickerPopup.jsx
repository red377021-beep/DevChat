import "./EmojiPickerPopup.css";

import {

    useEffect,
    useRef

} from "react";

import useFloatingPosition from "../../hooks/useFloatingPosition";

import EmojiGrid from "../Emoji/EmojiGrid";

function EmojiPickerPopup({

    anchorRef,

    onSelect,

    onClose

}) {

    // =====================================================
    // Refs
    // =====================================================

    const popupRef = useRef(null);

    // =====================================================
    // Smart Position
    // =====================================================

    const popupStyle = useFloatingPosition(

        anchorRef,

        popupRef,

        12

    );

    // =====================================================
    // Outside Click
    // =====================================================

    useEffect(() => {

        function handleOutside(event) {

            if (

                popupRef.current &&
                !popupRef.current.contains(event.target) &&

                anchorRef?.current &&
                !anchorRef.current.contains(event.target)

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

    }, [anchorRef, onClose]);

    // =====================================================
    // ESC
    // =====================================================

    useEffect(() => {

        function handleEscape(event) {

            if (

                event.key === "Escape"

            ) {

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
    // Select Emoji
    // =====================================================

    function handleEmoji(emoji) {

        onSelect?.(emoji);

        onClose?.();

    }

    // =====================================================
    // UI
    // =====================================================

    return (

        <div

            ref={popupRef}

            className="emoji-popup"

            style={popupStyle}

        >

            <EmojiGrid

                onSelect={handleEmoji}

            />

        </div>

    );

}

export default EmojiPickerPopup;