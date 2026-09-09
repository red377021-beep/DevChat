import {
  CornerUpLeft,
  Copy,
  Pencil,
  Pin,
  Trash2,
  Sparkles,
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

import "./MessageMenu.css";

function MessageMenu({ message, onClose }) {
  const { setReplyMessage } = useChat();

  const handleReply = () => {
    setReplyMessage(message);
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
    } catch {}

    onClose();
  };

  return (
    <div className="message-menu">

      <button onClick={handleReply}>
        <CornerUpLeft size={18} />
        Reply
      </button>

      <button onClick={handleCopy}>
        <Copy size={18} />
        Copy
      </button>

      <button>
        <Pencil size={18} />
        Edit
      </button>

      <button>
        <Pin size={18} />
        Pin
      </button>

      <button>
        <Sparkles size={18} />
        AI
      </button>

      <button className="delete-btn">
        <Trash2 size={18} />
        Delete
      </button>

    </div>
  );
}

export default MessageMenu;