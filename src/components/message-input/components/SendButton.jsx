import { SendHorizontal } from "lucide-react";

function SendButton({ onClick }) {
  return (
    <button
      type="button"
      className="input-btn send-btn"
      onClick={onClick}
    >
      <SendHorizontal size={20} />
    </button>
  );
}

export default SendButton;