import "./FloatingReactionBar.css";

import { Plus } from "lucide-react";

const DEFAULT_REACTIONS = [
    "❤️",
    "😂",
    "😮",
    "👍",
    "🔥",
    "😢"
];

function FloatingReactionBar({

    onReact,

    onOpenPicker,

    onMouseEnter,

    onMouseLeave

}) {

    return (

        <div

            className="floating-reaction-bar"

            onMouseEnter={onMouseEnter}

            onMouseLeave={onMouseLeave}

        >

            {

                DEFAULT_REACTIONS.map((emoji) => (

                    <button

                        key={emoji}

                        className="reaction-icon"

                        onClick={() => onReact(emoji)}

                    >

                        {emoji}

                    </button>

                ))

            }

            <button

                className="reaction-icon plus-icon"

                onClick={onOpenPicker}

            >

                <Plus size={18}/>

            </button>

        </div>

    );

}

export default FloatingReactionBar;