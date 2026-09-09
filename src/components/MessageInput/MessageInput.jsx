
import "./MessageInput.css";

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Plus,
    Paperclip,
    Camera,
    Mic,
    SendHorizontal,
    Pencil,
    X,
    Image as ImageIcon,
    Video,
    FileText,
    Music,
    UserRound
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

import ReplyPreview from "../ReplyPreview";
import InputField from "../InputField";
import EmojiButton from "../EmojiButton";
import AttachmentMenu from "../AttachmentMenu";

import VoiceRecorder
    from "../Voice/Recorder/VoiceRecorder";


function MessageInput() {

    const {
        sendMessage,

        attachmentOpen,
        setAttachmentOpen,

        editMessage,
        setEditMessage,
        updateMessage,

        selectedImages,
        setSelectedImages,

        selectedVideo,
        setSelectedVideo,

        selectedFile,
        setSelectedFile,

        selectedAudio,
        setSelectedAudio,

        selectedLocation,
        setSelectedLocation,

        selectedContact,
        setSelectedContact

    } = useChat();


    // =====================================================
    // STATES
    // =====================================================

    const [text, setText] = useState("");

    const [showRecorder, setShowRecorder] =
        useState(false);

    const attachmentRef =
        useRef(null);


    // =====================================================
    // IMAGE PREVIEW URLS
    // =====================================================

    const imagePreviews = useMemo(() => {

        if (!Array.isArray(selectedImages)) {
            return [];
        }

        return selectedImages
            .filter(Boolean)
            .map((file, index) => ({

                file,

                url:
                    file instanceof File
                        ? URL.createObjectURL(file)
                        : file?.url || file,

                index

            }));

    }, [selectedImages]);


    // =====================================================
    // VIDEO PREVIEW URLS
    // =====================================================

    const videoPreviews = useMemo(() => {

        if (!selectedVideo) {
            return [];
        }

        const videos =
            Array.isArray(selectedVideo)
                ? selectedVideo
                : [selectedVideo];

        return videos
            .filter(Boolean)
            .map((file, index) => ({

                file,

                url:
                    file instanceof File
                        ? URL.createObjectURL(file)
                        : file?.url || file,

                index

            }));

    }, [selectedVideo]);


    // =====================================================
    // CLEAN IMAGE PREVIEW URLS
    // =====================================================

    useEffect(() => {

        return () => {

            imagePreviews.forEach(preview => {

                if (
                    preview.file instanceof File &&
                    preview.url?.startsWith("blob:")
                ) {

                    URL.revokeObjectURL(
                        preview.url
                    );

                }

            });

        };

    }, [imagePreviews]);


    // =====================================================
    // CLEAN VIDEO PREVIEW URLS
    // =====================================================

    useEffect(() => {

        return () => {

            videoPreviews.forEach(preview => {

                if (
                    preview.file instanceof File &&
                    preview.url?.startsWith("blob:")
                ) {

                    URL.revokeObjectURL(
                        preview.url
                    );

                }

            });

        };

    }, [videoPreviews]);


    // =====================================================
    // EDIT MESSAGE
    // =====================================================

    useEffect(() => {

        if (editMessage) {

            setText(
                editMessage.text || ""
            );

        } else {

            setText("");

        }

    }, [editMessage]);


    // =====================================================
    // ATTACHMENT CHECK
    // =====================================================

    const hasImages =
        Array.isArray(selectedImages) &&
        selectedImages.length > 0;

    const hasVideo =
        videoPreviews.length > 0;

    const hasFile =
        Boolean(selectedFile);

    const hasAudio =
        Boolean(selectedAudio);

    const hasLocation =
        Boolean(selectedLocation);

    const hasContact =
        Boolean(selectedContact);

    const hasAttachment =
        hasImages ||
        hasVideo ||
        hasFile ||
        hasAudio ||
        hasLocation ||
        hasContact;

    const hasText =
        text.trim().length > 0;

    const canSend =
        hasText ||
        hasAttachment;


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    function removeImage(index) {

        setSelectedImages(prev => {

            if (!Array.isArray(prev)) {
                return [];
            }

            return prev.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            );

        });

    }


    // =====================================================
    // REMOVE VIDEO
    // =====================================================

    function removeVideo(index) {

        if (!Array.isArray(selectedVideo)) {
            return;
        }

        const updatedVideos =
            selectedVideo.filter(
                (_, videoIndex) =>
                    videoIndex !== index
            );

        setSelectedVideo(updatedVideos);

    }


    // =====================================================
    // CLEAR ALL ATTACHMENTS
    // =====================================================

    function clearAttachments() {

        setSelectedImages([]);

        setSelectedVideo([]);

        setSelectedFile(null);

        setSelectedAudio(null);

        setSelectedLocation(null);

        setSelectedContact(null);

    }


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    function handleSend() {

        const cleanText =
            text.trim();


        // -------------------------------------------------
        // EDIT MODE
        // -------------------------------------------------

        if (editMessage) {

            if (!cleanText) {
                return;
            }

            updateMessage(
                editMessage.id,
                cleanText
            );

            setEditMessage(null);

            setText("");

            setAttachmentOpen(false);

            return;

        }


        // -------------------------------------------------
        // NOTHING TO SEND
        // -------------------------------------------------

        if (
            !cleanText &&
            !hasAttachment
        ) {

            return;

        }


        // -------------------------------------------------
        // SEND
        // -------------------------------------------------

        sendMessage(
            cleanText
        );

        setText("");

        setAttachmentOpen(false);

    }


    // =====================================================
    // VOICE SEND
    // =====================================================

    function handleVoiceSend(voice) {

        if (!voice) {
            return;
        }

        sendMessage({

            audio: voice.audio,

            blob: voice.blob,

            duration: voice.duration

        });

        setShowRecorder(false);

    }


    // =====================================================
    // VOICE CANCEL
    // =====================================================

    function handleVoiceCancel() {

        setShowRecorder(false);

    }


    // =====================================================
    // ENTER KEY
    // =====================================================

    function handleKeyDown(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSend();

        }

    }


    // =====================================================
    // OUTSIDE CLICK
    // =====================================================

    useEffect(() => {

        function handleOutside(event) {

            if (
                attachmentRef.current &&
                !attachmentRef.current.contains(
                    event.target
                )
            ) {

                setAttachmentOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutside
            );

        };

    }, [setAttachmentOpen]);


    // =====================================================
    // ESC
    // =====================================================

    useEffect(() => {

        function handleEscape(event) {

            if (event.key === "Escape") {

                setAttachmentOpen(false);

            }

        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, [setAttachmentOpen]);


    // =====================================================
    // IMAGE PREVIEW
    // =====================================================

    function renderImagePreview() {

        if (!hasImages) {
            return null;
        }

        return (

            <div className="selected-images-preview">

                <div className="selected-images-header">

                    <div className="selected-images-title">

                        <ImageIcon size={16} />

                        <span>
                            {selectedImages.length}{" "}
                            {selectedImages.length === 1
                                ? "Photo"
                                : "Photos"}
                        </span>

                    </div>

                    <button
                        type="button"
                        className="selected-images-clear"
                        onClick={
                            clearAttachments
                        }
                    >
                        Clear all
                    </button>

                </div>


                <div className="selected-images-grid">

                    {imagePreviews.map(
                        (preview, index) => (

                            <div
                                key={
                                    `${preview.file?.name || "image"}-${index}`
                                }
                                className="selected-image-item"
                            >

                                <img
                                    src={preview.url}
                                    alt={
                                        `Selected image ${
                                            index + 1
                                        }`
                                    }
                                />

                                <button
                                    type="button"
                                    className="selected-image-remove"
                                    onClick={() =>
                                        removeImage(
                                            index
                                        )
                                    }
                                    aria-label={
                                        `Remove image ${
                                            index + 1
                                        }`
                                    }
                                >

                                    <X size={14} />

                                </button>

                                {selectedImages.length > 1 && (

                                    <span className="selected-image-number">

                                        {index + 1}

                                    </span>

                                )}

                            </div>

                        )
                    )}

                </div>

            </div>

        );

    }


    // =====================================================
    // VIDEO PREVIEW
    // =====================================================

    function renderVideoPreview() {

        if (!hasVideo) {
            return null;
        }

        const videoCount =
            videoPreviews.length;

        return (

            <div className="selected-video-preview">

                <div className="selected-video-header">

                    <div className="selected-images-title">

                        <Video size={16} />

                        <span>

                            {videoCount}{" "}

                            {videoCount === 1
                                ? "Video"
                                : "Videos"}

                        </span>

                    </div>

                    <button
                        type="button"
                        className="selected-images-clear"
                        onClick={
                            clearAttachments
                        }
                    >
                        Clear all
                    </button>

                </div>


                <div className="selected-video-grid">

                    {videoPreviews.map(
                        (preview, index) => (

                            <div
                                key={
                                    `${preview.file?.name || "video"}-${index}`
                                }
                                className="selected-video-item"
                            >

                                <video
                                    src={preview.url}
                                    muted
                                    playsInline
                                    preload="metadata"
                                />


                                <div className="selected-video-overlay" />


                                <div className="selected-video-play-icon">

                                    <span>
                                        ▶
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="selected-video-remove"
                                    onClick={() =>
                                        removeVideo(
                                            index
                                        )
                                    }
                                    aria-label={
                                        `Remove video ${
                                            index + 1
                                        }`
                                    }
                                >

                                    <X size={14} />

                                </button>


                                {videoCount > 1 && (

                                    <span className="selected-video-number">

                                        {index + 1}

                                    </span>

                                )}

                            </div>

                        )
                    )}

                </div>

            </div>

        );

    }


    // =====================================================
    // CONTACT PREVIEW
    // =====================================================

    function renderContactPreview() {

        if (!hasContact) {
            return null;
        }

        const contact =
            selectedContact || {};


        const username =
            contact.username ||
            contact.userName ||
            contact.handle ||
            contact.tag ||
            contact.user?.username ||
            "";


        const displayName =
            contact.name ||
            contact.displayName ||
            contact.fullName ||
            contact.user?.name ||
            "Contact";


        const finalUsername =
            username
                ? (
                    username.startsWith("@")
                        ? username
                        : `@${username}`
                )
                : "";


        return (

            <div className="attachment-selected-preview">

                <div className="attachment-preview-item">

                    <span className="attachment-preview-icon">

                        {contact.avatar ? (

                            <img
                                src={contact.avatar}
                                alt={displayName}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "inherit"
                                }}
                            />

                        ) : (

                            <UserRound size={18} />

                        )}

                    </span>


                    <div className="attachment-preview-info">

                        <strong>
                            Contact
                        </strong>

                        <span>
                            {displayName}
                            {finalUsername
                                ? ` • ${finalUsername}`
                                : ""}
                        </span>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setSelectedContact(null)
                        }
                        aria-label="Remove contact"
                    >

                        <X size={15} />

                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // OTHER ATTACHMENTS
    // =====================================================

    function renderOtherAttachments() {

        if (
            !hasVideo &&
            !hasFile &&
            !hasAudio &&
            !hasLocation &&
            !hasContact
        ) {

            return null;

        }

        return (

            <>

                {renderVideoPreview()}


                {/* CONTACT */}

                {renderContactPreview()}


                {/* FILE */}

                {hasFile && (

                    <div className="attachment-selected-preview">

                        <div className="attachment-preview-item">

                            <span className="attachment-preview-icon">

                                <FileText size={18} />

                            </span>

                            <div className="attachment-preview-info">

                                <strong>
                                    Document
                                </strong>

                                <span>
                                    {selectedFile?.name ||
                                        "Document"}
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedFile(null)
                                }
                                aria-label="Remove document"
                            >

                                <X size={15} />

                            </button>

                        </div>

                    </div>

                )}


                {/* AUDIO */}

                {hasAudio && (

                    <div className="attachment-selected-preview">

                        <div className="attachment-preview-item">

                            <span className="attachment-preview-icon">

                                <Music size={18} />

                            </span>

                            <div className="attachment-preview-info">

                                <strong>
                                    Audio
                                </strong>

                                <span>
                                    {selectedAudio?.name ||
                                        "Audio attachment"}
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedAudio(null)
                                }
                                aria-label="Remove audio"
                            >

                                <X size={15} />

                            </button>

                        </div>

                    </div>

                )}


                {/* LOCATION */}

                {hasLocation && (

                    <div className="attachment-selected-preview">

                        <div className="attachment-preview-item">

                            <span className="attachment-preview-icon">

                                📍

                            </span>

                            <div className="attachment-preview-info">

                                <strong>
                                    Location
                                </strong>

                                <span>
                                    Current location selected
                                </span>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedLocation(null)
                                }
                                aria-label="Remove location"
                            >

                                <X size={15} />

                            </button>

                        </div>

                    </div>

                )}

            </>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="message-input-wrapper">

            <ReplyPreview />

            {renderImagePreview()}

            {renderOtherAttachments()}


            <div className="message-input">

                <button
                    type="button"
                    className="input-btn"
                    aria-label="More options"
                >

                    <Plus size={20} />

                </button>


                {showRecorder ? (

                    <VoiceRecorder
                        onSend={
                            handleVoiceSend
                        }
                        onCancel={
                            handleVoiceCancel
                        }
                    />

                ) : (

                    <>

                        <div className="input-box">

                            {editMessage && (

                                <button
                                    type="button"
                                    className="edit-cancel-btn"
                                    onClick={() => {

                                        setEditMessage(
                                            null
                                        );

                                        setText("");

                                    }}
                                >
                                    Cancel Edit
                                </button>

                            )}


                            <InputField
                                value={text}
                                onChange={setText}
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder={
                                    editMessage
                                        ? "Edit message..."
                                        : "Type a message..."
                                }
                            />


                            <div className="input-actions">

                                <EmojiButton
                                    value={text}
                                    onChange={
                                        setText
                                    }
                                />


                                <div
                                    ref={
                                        attachmentRef
                                    }
                                    className="attachment-wrapper"
                                >

                                    <button
                                        type="button"
                                        className="input-action-btn"
                                        onClick={() =>
                                            setAttachmentOpen(
                                                prev =>
                                                    !prev
                                            )
                                        }
                                        aria-label="Attach"
                                    >

                                        <Paperclip
                                            size={19}
                                        />

                                    </button>


                                    {attachmentOpen && (

                                        <div className="attachment-popup">

                                            <AttachmentMenu />

                                        </div>

                                    )}

                                </div>


                                <button
                                    type="button"
                                    className="input-action-btn"
                                    aria-label="Camera"
                                >

                                    <Camera
                                        size={19}
                                    />

                                </button>

                            </div>

                        </div>


                        {canSend ? (

                            <button
                                type="button"
                                className="send-btn"
                                onClick={
                                    handleSend
                                }
                                aria-label={
                                    editMessage
                                        ? "Update message"
                                        : "Send message"
                                }
                            >

                                {editMessage ? (

                                    <Pencil size={20} />

                                ) : (

                                    <SendHorizontal size={20} />

                                )}

                            </button>

                        ) : (

                            <button
                                type="button"
                                className="input-btn"
                                onClick={() =>
                                    setShowRecorder(
                                        true
                                    )
                                }
                                aria-label="Record voice"
                            >

                                <Mic size={20} />

                            </button>

                        )}

                    </>

                )}

            </div>

        </div>

    );

}


export default MessageInput;

