import { Camera, X } from "lucide-react";

function CameraModal({
  open,
  videoRef,
  canvasRef,
  onCapture,
  onClose,
}) {
  if (!open) return null;

  return (
    <div className="camera-overlay">

      <div className="camera-modal">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />

        <div className="camera-actions">

          <button
            type="button"
            className="camera-close"
            onClick={onClose}
          >
            <X size={22} />
          </button>

          <button
            type="button"
            className="camera-capture"
            onClick={onCapture}
          >
            <Camera size={24} />
          </button>

        </div>

      </div>

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

    </div>
  );
}

export default CameraModal;