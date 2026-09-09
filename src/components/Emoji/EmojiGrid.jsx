import "./EmojiGrid.css";

import emojiData from "./emojiData";

function EmojiGrid({

    onSelect

}) {

    return (

        <div className="emoji-grid">

            {

                emojiData.map((emoji)=>(

                    <button

                        key={emoji}

                        className="emoji-item"

                        onClick={()=>onSelect?.(emoji)}

                    >

                        {emoji}

                    </button>

                ))

            }

        </div>

    );

}

export default EmojiGrid;