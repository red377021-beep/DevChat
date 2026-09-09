import "./CreateStoryModal.css";

import {
    Image,
    Video,
    X,
    Upload,
    CheckCircle2,
    FileImage,
    FileVideo,
    RefreshCw,
    Plus,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";


/* =========================================================
   CONSTANTS
========================================================= */

const MAX_IMAGE_SIZE =
    20 * 1024 * 1024;

const MAX_VIDEO_SIZE =
    100 * 1024 * 1024;

const MAX_CAPTION_LENGTH = 180;

const STORY_DURATION =
    24 * 60 * 60 * 1000;


/* =========================================================
   HELPERS
========================================================= */

const formatFileSize = (bytes = 0) => {

    if (!bytes || bytes <= 0) {
        return "0 B";
    }

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.min(
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        ),
        units.length - 1
    );

    const size =
        bytes /
        Math.pow(
            1024,
            index
        );

    return `${size.toFixed(
        index === 0 ? 0 : 1
    )} ${units[index]}`;
};


const isImageFile = (file) => {

    return Boolean(
        file?.type?.startsWith("image/")
    );

};


const isVideoFile = (file) => {

    return Boolean(
        file?.type?.startsWith("video/")
    );

};


const createStoryId = () => {

    return (
        `story-${Date.now()}-` +
        Math.random()
            .toString(36)
            .slice(2, 10)
    );

};


/* =========================================================
   COMPONENT
========================================================= */

function CreateStoryModal({
    open = false,
    onClose,
    onCreateStory,
    currentUser = null,
}) {

    /* =====================================================
       REFS
    ===================================================== */

    const fileInputRef =
        useRef(null);

    const previewUrlRef =
        useRef("");

    const isMountedRef =
        useRef(true);


    /* =====================================================
       STATE
    ===================================================== */

    const [file, setFile] =
        useState(null);

    const [previewUrl, setPreviewUrl] =
        useState("");

    const [caption, setCaption] =
        useState("");

    const [error, setError] =
        useState("");

    const [isDragging, setIsDragging] =
        useState(false);

    const [isPosting, setIsPosting] =
        useState(false);


    /* =====================================================
       USER DATA
    ===================================================== */

    const username =
        currentUser?.username ||
        currentUser?.name ||
        "devuser";


    const avatar =
        currentUser?.avatar ||
        currentUser?.profilePicture ||
        "";


    /* =====================================================
       MOUNT / UNMOUNT
    ===================================================== */

    useEffect(() => {

        isMountedRef.current = true;

        return () => {

            isMountedRef.current = false;

        };

    }, []);


    /* =====================================================
       REVOKE PREVIEW URL
    ===================================================== */

    const revokePreviewUrl =
        useCallback(() => {

            const currentUrl =
                previewUrlRef.current;

            if (currentUrl) {

                URL.revokeObjectURL(
                    currentUrl
                );

                previewUrlRef.current =
                    "";

            }

        }, []);


    /* =====================================================
       RESET FORM
    ===================================================== */

    const resetForm =
        useCallback(() => {

            revokePreviewUrl();

            setFile(null);
            setPreviewUrl("");
            setCaption("");
            setError("");
            setIsDragging(false);
            setIsPosting(false);


            if (fileInputRef.current) {

                fileInputRef.current.value =
                    "";

            }

        }, [
            revokePreviewUrl,
        ]);


    /* =====================================================
       RESET WHEN CLOSED
    ===================================================== */

    useEffect(() => {

        if (!open) {

            resetForm();

        }

    }, [
        open,
        resetForm,
    ]);


    /* =====================================================
       CREATE PREVIEW URL
    ===================================================== */

    useEffect(() => {

        if (!file) {

            setPreviewUrl("");

            return;

        }


        const objectUrl =
            URL.createObjectURL(file);


        previewUrlRef.current =
            objectUrl;


        setPreviewUrl(
            objectUrl
        );


        return () => {

            if (
                previewUrlRef.current ===
                objectUrl
            ) {

                URL.revokeObjectURL(
                    objectUrl
                );

                previewUrlRef.current =
                    "";

            }

        };

    }, [file]);


    /* =====================================================
       BODY SCROLL LOCK
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow =
            "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [open]);


    /* =====================================================
       FILE VALIDATION
    ===================================================== */

    const validateFile = useCallback(
        (selectedFile) => {

            if (!selectedFile) {

                return "Please select a file.";

            }


            const image =
                isImageFile(
                    selectedFile
                );


            const video =
                isVideoFile(
                    selectedFile
                );


            if (!image && !video) {

                return (
                    "Only image and video files are supported."
                );

            }


            if (
                image &&
                selectedFile.size >
                MAX_IMAGE_SIZE
            ) {

                return (
                    "Image must be under 20 MB."
                );

            }


            if (
                video &&
                selectedFile.size >
                MAX_VIDEO_SIZE
            ) {

                return (
                    "Video must be under 100 MB."
                );

            }


            return "";

        },
        []
    );


    /* =====================================================
       SELECT FILE
    ===================================================== */

    const selectFile =
        useCallback(
            (selectedFile) => {

                if (!selectedFile) {
                    return;
                }


                const validationError =
                    validateFile(
                        selectedFile
                    );


                if (validationError) {

                    setError(
                        validationError
                    );

                    return;

                }


                setError("");

                setFile(
                    selectedFile
                );

            },
            [validateFile]
        );


    /* =====================================================
       FILE INPUT CHANGE
    ===================================================== */

    const handleFileChange = (
        event
    ) => {

        const selectedFile =
            event.target.files?.[0];


        if (!selectedFile) {
            return;
        }


        selectFile(
            selectedFile
        );

    };


    /* =====================================================
       OPEN FILE PICKER
    ===================================================== */

    const openFilePicker = () => {

        if (isPosting) {
            return;
        }


        fileInputRef.current?.click();

    };


    /* =====================================================
       REMOVE FILE
    ===================================================== */

    const handleRemoveFile = () => {

        if (isPosting) {
            return;
        }


        revokePreviewUrl();

        setFile(null);
        setPreviewUrl("");
        setError("");


        if (fileInputRef.current) {

            fileInputRef.current.value =
                "";

        }

    };


    /* =====================================================
       DRAG ENTER
    ===================================================== */

    const handleDragEnter = (
        event
    ) => {

        event.preventDefault();
        event.stopPropagation();


        if (isPosting) {
            return;
        }


        setIsDragging(true);

    };


    /* =====================================================
       DRAG OVER
    ===================================================== */

    const handleDragOver = (
        event
    ) => {

        event.preventDefault();
        event.stopPropagation();


        if (isPosting) {
            return;
        }


        setIsDragging(true);

    };


    /* =====================================================
       DRAG LEAVE
    ===================================================== */

    const handleDragLeave = (
        event
    ) => {

        event.preventDefault();
        event.stopPropagation();


        setIsDragging(false);

    };


    /* =====================================================
       DROP
    ===================================================== */

    const handleDrop = (
        event
    ) => {

        event.preventDefault();
        event.stopPropagation();


        setIsDragging(false);


        if (isPosting) {
            return;
        }


        const droppedFile =
            event.dataTransfer
                ?.files?.[0];


        if (!droppedFile) {
            return;
        }


        selectFile(
            droppedFile
        );

    };


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const handleClose =
        useCallback(() => {

            if (isPosting) {
                return;
            }


            resetForm();

            onClose?.();

        }, [
            isPosting,
            resetForm,
            onClose,
        ]);


    /* =====================================================
       BACKDROP CLICK
    ===================================================== */

    const handleBackdropClick = (
        event
    ) => {

        if (
            event.target ===
            event.currentTarget
        ) {

            handleClose();

        }

    };


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }


        const handleKeyDown = (
            event
        ) => {

            if (
                event.key ===
                "Escape"
            ) {

                event.preventDefault();

                handleClose();

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

    }, [
        open,
        handleClose,
    ]);


    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {

        return () => {

            revokePreviewUrl();

        };

    }, [
        revokePreviewUrl,
    ]);


    /* =====================================================
       CREATE STORY
    ===================================================== */

    const handleCreate = async () => {

        if (isPosting) {
            return;
        }


        if (!file) {

            setError(
                "Please select an image or video first."
            );

            return;

        }


        const validationError =
            validateFile(file);


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        setError("");
        setIsPosting(true);


        const video =
            isVideoFile(file);


        const now =
            Date.now();


        const story = {

            id:
                createStoryId(),

            type:
                video
                    ? "video"
                    : "image",

            mediaUrl:
                previewUrl,

            mediaFile:
                file,

            fileName:
                file.name,

            fileSize:
                file.size,

            fileType:
                file.type,

            caption:
                caption.trim(),

            username,

            avatar,

            viewed:
                false,

            isOwn:
                true,

            createdAt:
                now,

            expiresAt:
                now +
                STORY_DURATION,

        };


        try {

            await Promise.resolve(
                onCreateStory?.(
                    story
                )
            );


            if (!isMountedRef.current) {
                return;
            }


            handleClose();

        } catch (creationError) {

            console.error(
                "Failed to create story:",
                creationError
            );


            if (!isMountedRef.current) {
                return;
            }


            setIsPosting(false);


            setError(
                "Something went wrong. Please try again."
            );

        }

    };


    /* =====================================================
       CHARACTER COUNT
    ===================================================== */

    const remainingCharacters =
        MAX_CAPTION_LENGTH -
        caption.length;


    /* =====================================================
       MEDIA TYPE
    ===================================================== */

    const selectedIsVideo =
        isVideoFile(file);


    const selectedIsImage =
        isImageFile(file);


    /* =====================================================
       RENDER
    ===================================================== */

    if (!open) {
        return null;
    }


    return (

        <div
            className="create-story-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-story-modal-title"
        >

            {/* =================================================
               BACKDROP
            ================================================= */}

            <div
                className="create-story-modal__backdrop"
                onClick={
                    handleBackdropClick
                }
                aria-hidden="true"
            />


            {/* =================================================
               MODAL CONTENT
            ================================================= */}

            <div
                className="create-story-modal__content"
            >

                {/* =============================================
                   HEADER
                ============================================= */}

                <header
                    className="create-story-modal__header"
                >

                    <div
                        className="create-story-modal__heading"
                    >

                        <div
                            className="
                                create-story-modal__heading-icon
                            "
                        >

                            <Plus
                                size={18}
                                strokeWidth={2.4}
                            />

                        </div>


                        <div>

                            <h2
                                id="create-story-modal-title"
                            >
                                Create Story
                            </h2>


                            <p>
                                Share a moment
                                with your friends
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="create-story-modal__close"
                        onClick={
                            handleClose
                        }
                        disabled={
                            isPosting
                        }
                        aria-label="Close create story"
                    >

                        <X
                            size={20}
                        />

                    </button>

                </header>


                {/* =============================================
                   BODY
                ============================================= */}

                <div
                    className="create-story-modal__body"
                >

                    {/* =========================================
                       MEDIA / UPLOAD
                    ========================================= */}

                    {file ? (

                        <div
                            className="
                                create-story-modal__preview
                            "
                        >

                            {/* IMAGE */}

                            {selectedIsImage && (

                                <img
                                    src={
                                        previewUrl
                                    }
                                    alt="Story preview"
                                />

                            )}


                            {/* VIDEO */}

                            {selectedIsVideo && (

                                <video
                                    src={
                                        previewUrl
                                    }
                                    controls
                                    muted
                                    playsInline
                                    preload="metadata"
                                />

                            )}


                            {/* OVERLAY */}

                            <div
                                className="
                                    create-story-modal__preview-overlay
                                "
                            />


                            {/* REMOVE */}

                            <button
                                type="button"
                                className="
                                    create-story-modal__remove
                                "
                                onClick={
                                    handleRemoveFile
                                }
                                disabled={
                                    isPosting
                                }
                                aria-label="Remove selected media"
                            >

                                <X
                                    size={17}
                                />

                            </button>


                            {/* MEDIA INFO */}

                            <div
                                className="
                                    create-story-modal__media-info
                                "
                            >

                                {selectedIsVideo ? (

                                    <FileVideo
                                        size={15}
                                    />

                                ) : (

                                    <FileImage
                                        size={15}
                                    />

                                )}


                                <span>
                                    {selectedIsVideo
                                        ? "Video"
                                        : "Image"}
                                </span>


                                <span>
                                    •
                                </span>


                                <span>
                                    {
                                        formatFileSize(
                                            file.size
                                        )
                                    }
                                </span>

                            </div>

                        </div>

                    ) : (

                        /* =====================================
                           UPLOAD AREA
                        ===================================== */

                        <button
                            type="button"
                            className={`
                                create-story-modal__upload
                                ${
                                    isDragging
                                        ? "create-story-modal__upload--dragging"
                                        : ""
                                }
                            `}
                            onClick={
                                openFilePicker
                            }
                            onDragEnter={
                                handleDragEnter
                            }
                            onDragOver={
                                handleDragOver
                            }
                            onDragLeave={
                                handleDragLeave
                            }
                            onDrop={
                                handleDrop
                            }
                            disabled={
                                isPosting
                            }
                        >

                            <div
                                className="
                                    create-story-modal__upload-icon
                                "
                            >

                                <Upload
                                    size={27}
                                />

                            </div>


                            <strong>
                                {isDragging
                                    ? "Drop Media Here"
                                    : "Choose Story Media"}
                            </strong>


                            <span>
                                Drag & drop or
                                click to browse
                            </span>


                            <small>
                                JPG, PNG, WEBP,
                                GIF or MP4
                            </small>


                            <div
                                className="
                                    create-story-modal__upload-limits
                                "
                            >

                                <span>
                                    Images up to 20 MB
                                </span>


                                <span>
                                    Videos up to 100 MB
                                </span>

                            </div>

                        </button>

                    )}


                    {/* =========================================
                       HIDDEN FILE INPUT
                    ========================================= */}

                    <input
                        ref={
                            fileInputRef
                        }
                        type="file"
                        accept="image/*,video/*"
                        onChange={
                            handleFileChange
                        }
                        hidden
                    />


                    {/* =========================================
                       CHANGE MEDIA
                    ========================================= */}

                    {file && (

                        <button
                            type="button"
                            className="
                                create-story-modal__change
                            "
                            onClick={
                                openFilePicker
                            }
                            disabled={
                                isPosting
                            }
                        >

                            {selectedIsVideo ? (

                                <Video
                                    size={16}
                                />

                            ) : (

                                <Image
                                    size={16}
                                />

                            )}


                            <span>
                                Change Media
                            </span>


                            <RefreshCw
                                size={14}
                            />

                        </button>

                    )}


                    {/* =========================================
                       CAPTION
                    ========================================= */}

                    <div
                        className="
                            create-story-modal__field
                        "
                    >

                        <div
                            className="
                                create-story-modal__field-header
                            "
                        >

                            <label
                                htmlFor="story-caption"
                            >
                                Caption
                            </label>


                            <span
                                className={
                                    remainingCharacters <
                                    20
                                        ? "is-warning"
                                        : ""
                                }
                            >
                                {caption.length}
                                /
                                {MAX_CAPTION_LENGTH}
                            </span>

                        </div>


                        <textarea
                            id="story-caption"
                            value={
                                caption
                            }
                            onChange={(
                                event
                            ) => {

                                setCaption(
                                    event.target.value
                                );

                            }}
                            placeholder="Write a caption..."
                            maxLength={
                                MAX_CAPTION_LENGTH
                            }
                            rows={3}
                            disabled={
                                isPosting
                            }
                        />

                    </div>


                    {/* =========================================
                       ERROR
                    ========================================= */}

                    {error && (

                        <div
                            className="
                                create-story-modal__error
                            "
                            role="alert"
                        >

                            <span>
                                !
                            </span>


                            <div>
                                {error}
                            </div>

                        </div>

                    )}


                    {/* =========================================
                       24 HOUR INFO
                    ========================================= */}

                    <div
                        className="
                            create-story-modal__info
                        "
                    >

                        <CheckCircle2
                            size={16}
                        />


                        <div>

                            <strong>
                                24-hour story
                            </strong>


                            <span>
                                Your story will
                                automatically
                                disappear after
                                24 hours.
                            </span>

                        </div>

                    </div>


                    {/* =========================================
                       ACTIONS
                    ========================================= */}

                    <div
                        className="
                            create-story-modal__actions
                        "
                    >

                        <button
                            type="button"
                            className="
                                create-story-modal__cancel
                            "
                            onClick={
                                handleClose
                            }
                            disabled={
                                isPosting
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            className="
                                create-story-modal__create
                            "
                            onClick={
                                handleCreate
                            }
                            disabled={
                                !file ||
                                isPosting
                            }
                        >

                            {isPosting ? (

                                <>

                                    <span
                                        className="
                                            create-story-modal__spinner
                                        "
                                    />

                                    Posting...

                                </>

                            ) : (

                                <>

                                    <Upload
                                        size={16}
                                    />

                                    Post Story

                                </>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default CreateStoryModal;