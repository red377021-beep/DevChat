import { Camera } from "lucide-react";

function CameraButton({ onClick }) {
  return (
    <button
      type="button"
      className="input-btn camera-btn"
      onClick={onClick}
    >
      <Camera size={20} />
    </button>
  );
}

export default CameraButton;