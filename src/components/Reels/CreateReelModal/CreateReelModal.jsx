import "./CreateReelModal.css";

import {
    X,
    Video,
    Upload,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";


function CreateReelModal({
    open = false,
    onClose,
    onPost,
}) {

    const fileInputRef = useRef(null);

    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");

    const [caption, setCaption] = useState("");


    // ======================================================
    // CLEAN VIDEO PREVIEW
    // ======================================================

    useEffect(() => {

        return () => {

            if (videoPreview) {
                URL.revokeObjectURL(videoPreview);
            }

        };

    }, [videoPreview]);


    // ======================================================
    // ESCAPE KEY
    // ======================================================

    useEffect(() => {

        if (!open) {
            return;
        }

        const handleKeyDown = (event) => {

            if (event.key === "Escape") {
                onClose?.();
            }

        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [open, onClose]);


    // ======================================================
    // SELECT VIDEO
    // ======================================================

    const handleFileChange = (event) => {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("video/")) {
            return;
        }

        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
        }

        const previewUrl = URL.createObjectURL(file);

        setVideoFile(file);
        setVideoPreview(previewUrl);

    };


    // ======================================================
    // OPEN FILE PICKER
    // ======================================================

    const handleSelectVideo = () => {

        fileInputRef.current?.click();

    };


    // ======================================================
    // REMOVE VIDEO
    // ======================================================

    const handleRemoveVideo = () => {

        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
        }

        setVideoFile(null);
        setVideoPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    };


    // ======================================================
    // POST REEL
    // ======================================================

    const handlePost = () => {

        if (!videoFile) {
            return;
        }

        const newReel = {

    id: Date.now(),

    username: "devuser",

    caption:
        caption.trim() ||
        "My new DevChat Reel 🎬",

    music: "Original audio",

    videoFile: videoFile,

};


        onPost?.(newReel);


        // Reset modal

        setVideoFile(null);
        setVideoPreview("");
        setCaption("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

    };


    // ======================================================
    // CLOSE
    // ======================================================

    const handleClose = () => {

        setVideoFile(null);
        setVideoPreview("");
        setCaption("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        onClose?.();

    };


    // ======================================================
    // DON'T RENDER
    // ======================================================

    if (!open) {
        return null;
    }


    // ======================================================
    // RENDER
    // ======================================================

    return (

        <div
            className="create-reel-modal__overlay"
            onMouseDown={(event) => {

                if (
                    event.target === event.currentTarget
                ) {
                    handleClose();
                }

            }}
        >

            <div
                className="create-reel-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-reel-title"
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <header className="create-reel-modal__header">

                    <div>

                        <span className="create-reel-modal__eyebrow">
                            DevChat
                        </span>

                        <h2 id="create-reel-title">
                            Create Reel
                        </h2>

                    </div>


                    <button
                        className="create-reel-modal__close"
                        type="button"
                        onClick={handleClose}
                        aria-label="Close"
                    >

                        <X size={20} />

                    </button>

                </header>


                {/* ==================================================
                    BODY
                ================================================== */}

                <div className="create-reel-modal__body">

                    {!videoPreview ? (

                        <button
                            className="create-reel-modal__upload"
                            type="button"
                            onClick={handleSelectVideo}
                        >

                            <span className="create-reel-modal__upload-icon">

                                <Video size={28} />

                            </span>


                            <strong>
                                Select a video
                            </strong>


                            <span>
                                Choose a video from your device
                            </span>


                            <span className="create-reel-modal__upload-button">

                                <Upload size={16} />

                                Choose Video

                            </span>

                        </button>

                    ) : (

                        <div className="create-reel-modal__preview">

                            <video
                                src={videoPreview}
                                controls
                                playsInline
                            />


                            <div className="create-reel-modal__preview-actions">

                                <button
                                    type="button"
                                    onClick={handleSelectVideo}
                                >
                                    Change Video
                                </button>


                                <button
                                    type="button"
                                    onClick={handleRemoveVideo}
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    )}


                    <input
                        ref={fileInputRef}
                        className="create-reel-modal__file-input"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                    />


                    {/* ==================================================
                        CAPTION
                    ================================================== */}

                    <div className="create-reel-modal__field">

                        <div className="create-reel-modal__label-row">

                            <label htmlFor="reel-caption">
                                Caption
                            </label>

                            <span>
                                {caption.length}/220
                            </span>

                        </div>


                        <textarea
                            id="reel-caption"
                            value={caption}
                            onChange={(event) =>
                                setCaption(
                                    event.target.value.slice(
                                        0,
                                        220
                                    )
                                )
                            }
                            placeholder="Write something about your Reel..."
                            maxLength={220}
                        />

                    </div>

                </div>


                {/* ==================================================
                    FOOTER
                ================================================== */}

                <footer className="create-reel-modal__footer">

                    <button
                        className="create-reel-modal__cancel"
                        type="button"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>


                    <button
                        className="create-reel-modal__post"
                        type="button"
                        disabled={!videoFile}
                        onClick={handlePost}
                    >
                        Post Reel
                    </button>

                </footer>

            </div>

        </div>

    );

}


export default CreateReelModal;