import {
  Image,
  FileVideo,
  File,
  Music,
} from "lucide-react";

function AttachmentMenu({
  open,
  imageInputRef,
  videoInputRef,
  fileInputRef,
  audioInputRef,
}) {
  if (!open) return null;

  return (
    <div className="attachment-menu">

      <button
        type="button"
        className="attachment-item"
        onClick={() => imageInputRef.current?.click()}
      >
        <Image size={20} />
        <span>Image</span>
      </button>

      <button
        type="button"
        className="attachment-item"
        onClick={() => videoInputRef.current?.click()}
      >
        <FileVideo size={20} />
        <span>Video</span>
      </button>

      <button
        type="button"
        className="attachment-item"
        onClick={() => fileInputRef.current?.click()}
      >
        <File size={20} />
        <span>Document</span>
      </button>

      <button
        type="button"
        className="attachment-item"
        onClick={() => audioInputRef.current?.click()}
      >
        <Music size={20} />
        <span>Audio</span>
      </button>

    </div>
  );
}

export default AttachmentMenu;