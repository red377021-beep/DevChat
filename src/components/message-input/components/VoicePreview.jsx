import { Trash2, SendHorizontal } from "lucide-react";

function VoicePreview({
  audioURL,
  onDelete,
  onSend,
}) {
  if (!audioURL) return null;

  return (
    <div className="voice-preview">

      <audio
        controls
        src={audioURL}
        className="voice-player"
      />

      <div className="voice-actions">

        <button
          type="button"
          className="voice-delete"
          onClick={onDelete}
        >
          <Trash2 size={20} />
        </button>

        <button
          type="button"
          className="voice-send"
          onClick={onSend}
        >
          <SendHorizontal size={20} />
        </button>

      </div>

    </div>
  );
}

export default VoicePreview;