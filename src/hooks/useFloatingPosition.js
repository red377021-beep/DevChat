import { useEffect, useLayoutEffect, useState } from "react";

function useFloatingPosition(

    triggerRef,
    popupRef,
    offset = 10

) {

    const [style, setStyle] = useState({

        top: 0,
        left: 0,
        visibility: "hidden"

    });

    function updatePosition() {

        if (

            !triggerRef.current ||

            !popupRef.current

        ) return;

        const trigger =

            triggerRef.current.getBoundingClientRect();

        const popup =

            popupRef.current.getBoundingClientRect();

        let top =

            trigger.bottom + offset;

        let left =

            trigger.left;

        // Bottom Overflow

        if (

            top + popup.height >

            window.innerHeight

        ) {

            top =

                trigger.top -

                popup.height -

                offset;

        }

        // Right Overflow

        if (

            left + popup.width >

            window.innerWidth

        ) {

            left =

                window.innerWidth -

                popup.width -

                12;

        }

        // Left Overflow

        if (left < 12) {

            left = 12;

        }

        // Top Overflow

        if (top < 12) {

            top = 12;

        }

        setStyle({

            top,

            left,

            visibility: "visible"

        });

    }

    useLayoutEffect(() => {

        updatePosition();

    });

    useEffect(() => {

        window.addEventListener(

            "resize",

            updatePosition

        );

        window.addEventListener(

            "scroll",

            updatePosition,

            true

        );

        return () => {

            window.removeEventListener(

                "resize",

                updatePosition

            );

            window.removeEventListener(

                "scroll",

                updatePosition,

                true

            );

        };

    }, []);

    return style;

}

export default useFloatingPosition;