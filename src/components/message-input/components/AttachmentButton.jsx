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

}) {

  if (!open) return null;

  return (

    <div className="attachment-menu">

      {/* Image */}

      <button

        type="button"

        className="attachment-item"

        onClick={() =>
          imageInputRef.current?.click()
        }

      >

        <Image size={22} />

        <span>

          Image

        </span>

      </button>

      {/* Video */}

      <button

        type="button"

        className="attachment-item"

        onClick={() =>
          videoInputRef.current?.click()
        }

      >

        <FileVideo size={22} />

        <span>

          Video

        </span>

      </button>

      {/* File */}

      <button

        type="button"

        className="attachment-item"

        onClick={() =>
          fileInputRef.current?.click()
        }

      >

        <File size={22} />

        <span>

          Document

        </span>

      </button>

      {/* Audio */}

      <button

        type="button"

        className="attachment-item"

      >

        <Music size={22} />

        <span>

          Audio

        </span>

      </button>

    </div>

  );

}

export default AttachmentMenu;