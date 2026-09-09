import "./EmojiPicker.css";

import EmojiPickerLib from "emoji-picker-react";

function EmojiPicker({

    onEmojiClick,

    theme = "dark"

}){

    return(

        <div className="devchat-emoji-picker">

            <EmojiPickerLib

                theme={theme}

                lazyLoadEmojis={true}

                searchDisabled={false}

                skinTonesDisabled={false}

                previewConfig={{

                    showPreview:false

                }}

                onEmojiClick={(emojiData)=>{

                    onEmojiClick(emojiData);

                }}

            />

        </div>

    );

}

export default EmojiPicker;