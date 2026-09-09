import { Mic, Square } from "lucide-react";

function VoiceButton({
  isRecording,
  onStart,
  onStop,
}) {
  return (
    <button
      type="button"
      className="input-btn mic-btn"
      onClick={
        isRecording
          ? onStop
          : onStart
      }
    >
      {isRecording ? (
        <Square size={18} />
      ) : (
        <Mic size={20} />
      )}
    </button>
  );
}

export default VoiceButton;