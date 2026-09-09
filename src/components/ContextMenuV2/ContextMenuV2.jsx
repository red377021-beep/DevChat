import "./ContextMenuV2.css";

import {

    useEffect,
    useLayoutEffect,
    useRef,
    useState

} from "react";

function ContextMenuV2({

    open,

    anchor,

    children,

    onClose

}) {

    const menuRef = useRef(null);

    const [

        position,

        setPosition

    ] = useState({

        left:0,

        top:0

    });

    // ============================================
    // Smart Position
    // ============================================

    useLayoutEffect(()=>{

        if(

            !open ||

            !anchor ||

            !menuRef.current

        ) return;

        const menu = menuRef.current;

        const rect =

            anchor.getBoundingClientRect();

        const menuRect =

            menu.getBoundingClientRect();

        let left =

            rect.left;

        let top =

            rect.bottom + 10;

        // Right Overflow

        if(

            left + menuRect.width >

            window.innerWidth - 12

        ){

            left =

                window.innerWidth -

                menuRect.width -

                12;

        }

        // Left Overflow

        if(left < 12){

            left = 12;

        }

        // Bottom Overflow

        if(

            top + menuRect.height >

            window.innerHeight - 12

        ){

            top =

                rect.top -

                menuRect.height -

                10;

        }

        // Top Overflow

        if(top < 12){

            top = 12;

        }

        setPosition({

            left,

            top

        });

    },[

        open,

        anchor

    ]);

    // ============================================
    // Outside Click
    // ============================================

    useEffect(()=>{

        function outside(e){

            if(

                menuRef.current &&

                !menuRef.current.contains(

                    e.target

                ) &&

                anchor &&

                !anchor.contains(

                    e.target

                )

            ){

                onClose?.();

            }

        }

        if(open){

            document.addEventListener(

                "mousedown",

                outside

            );

        }

        return()=>{

            document.removeEventListener(

                "mousedown",

                outside

            );

        };

    },[

        open,

        anchor,

        onClose

    ]);

    // ============================================
    // ESC
    // ============================================

    useEffect(()=>{

        function esc(e){

            if(

                e.key==="Escape"

            ){

                onClose?.();

            }

        }

        if(open){

            document.addEventListener(

                "keydown",

                esc

            );

        }

        return()=>{

            document.removeEventListener(

                "keydown",

                esc

            );

        };

    },[

        open,

        onClose

    ]);

    if(!open) return null;

    return(

        <div

            ref={menuRef}

            className="context-v2"

            style={position}

        >

            {children}

        </div>

    );

}

export default ContextMenuV2;