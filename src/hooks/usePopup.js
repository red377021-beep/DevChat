import { useEffect, useRef, useState } from "react";

function usePopup() {

    const popupRef = useRef(null);

    const buttonRef = useRef(null);

    const [open, setOpen] = useState(false);

    // ==========================
    // Toggle
    // ==========================

    function toggle() {

        setOpen((prev) => !prev);

    }

    // ==========================
    // Open
    // ==========================

    function show() {

        setOpen(true);

    }

    // ==========================
    // Close
    // ==========================

    function close() {

        setOpen(false);

    }

    // ==========================
    // Outside Click
    // ==========================

    useEffect(() => {

        function handleClick(event) {

            if (
                popupRef.current &&
                !popupRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {

                close();

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

    // ==========================
    // ESC
    // ==========================

    useEffect(() => {

        function handleKey(event) {

            if (event.key === "Escape") {

                close();

            }

        }

        document.addEventListener("keydown", handleKey);

        return () => {

            document.removeEventListener(
                "keydown",
                handleKey
            );

        };

    }, []);

    return {

        open,

        toggle,

        show,

        close,

        popupRef,

        buttonRef

    };

}

export default usePopup;