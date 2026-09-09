import EmojiPickerReact from "emoji-picker-react";

function EmojiPicker({

  open,

  onEmojiClick,

}) {

  if (!open) return null;

  return (

    <div className="emoji-picker-popup">

      <EmojiPickerReact

        onEmojiClick={onEmojiClick}

        lazyLoadEmojis

        autoFocusSearch={false}

        searchDisabled={false}

        skinTonesDisabled={false}

        previewConfig={{
          showPreview: false,
        }}

        width={340}

        height={420}

      />

    </div>

  );

}

export default EmojiPicker;