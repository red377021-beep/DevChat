import EmojiPickerReact from "emoji-picker-react";

import "./EmojiPicker.css";

function EmojiPicker({ onSelect }) {
  return (
    <div className="emoji-picker">

      <EmojiPickerReact
        onEmojiClick={(emojiData) =>
          onSelect(emojiData.emoji)
        }

        width="100%"
        height={420}

        searchDisabled={false}
        skinTonesDisabled={false}

        lazyLoadEmojis={true}

        previewConfig={{
          showPreview: false,
        }}

        autoFocusSearch={true}
      />

    </div>
  );
}

export default EmojiPicker;