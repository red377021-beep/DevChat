// ======================================================
// DEVCHAT
// MESSAGE INPUT
// ======================================================

// ======================================================
// Styles
// ======================================================

import "./MessageInput.css";

// ======================================================
// Icons
// ======================================================

import {
  Smile,
  Paperclip,
  Camera,
  Mic,
  SendHorizontal,
} from "lucide-react";

// ======================================================
// Component
// ======================================================

function MessageInput() {
  return (
    <footer className="message-input">

      {/* Left Icons */}

      <div className="input-left">

        <button className="input-btn">
          <Smile size={20} />
        </button>

        <button className="input-btn">
          <Paperclip size={20} />
        </button>

      </div>

      {/* Input */}

      <input
        type="text"
        placeholder="Type a message..."
      />

      {/* Right Icons */}

      <div className="input-right">

        <button className="input-btn">
          <Camera size={20} />
        </button>

        <button className="input-btn">
          <Mic size={20} />
        </button>

        <button className="send-btn">
          <SendHorizontal size={20} />
        </button>

      </div>

    </footer>
  );
}

export default MessageInput;