// ======================================================
// DevChat
// Reply Preview
// ======================================================

import "./ReplyPreview.css";

import { X } from "lucide-react";

function ReplyPreview({
  visible = false,
  sender = "Kinza",
  text = "Sample Reply...",
  onClose = () => {},
}) {

  if (!visible) return null;

  return (

    <div className="reply-preview">

      <div className="reply-content">

        <span className="reply-user">
          Replying to {sender}
        </span>

        <p>{text}</p>

      </div>

      <button
        className="reply-close"
        onClick={onClose}
      >
        <X size={18} />
      </button>

    </div>

  );

}

export default ReplyPreview;