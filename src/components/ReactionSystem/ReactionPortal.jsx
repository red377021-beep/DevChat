import "./ReactionPortal.css";

import { createPortal } from "react-dom";

function ReactionPortal({

    children,

    visible,

    x,

    y

}) {

    if(!visible) return null;

    return createPortal(

        <div

            className="reaction-portal"

            style={{

                left:x,

                top:y

            }}

        >

            {children}

        </div>,

        document.body

    );

}

export default ReactionPortal;