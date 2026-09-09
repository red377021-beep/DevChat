import { Smile } from "lucide-react";

function EmojiButton({ onClick }) {
  return (
    <button
      type="button"
      className="input-btn emoji-btn"
      onClick={onClick}
    >
      <Smile size={20} />
    </button>
  );
}

export default EmojiButton;