import "./CreateGroupModal.css";

import {
    X,
    Users,
    ImagePlus,
    Globe2,
    LockKeyhole,
    ChevronDown,
    Check,
    AlertCircle,
    Upload,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";


function CreateGroupModal({
    isOpen = false,
    onClose,
    onCreate,
}) {
    const fileInputRef = useRef(null);
    const nameInputRef = useRef(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState("Public");
    const [category, setCategory] = useState("General");

    const [avatar, setAvatar] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);

    const [error, setError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isCreating, setIsCreating] = useState(false);


    const categories = [
        "General",
        "Technology",
        "Gaming",
        "Education",
        "Entertainment",
        "Sports",
        "Music",
        "Creative",
        "Business",
    ];


    // =====================================================
    // RESET MODAL
    // =====================================================

    const resetForm = () => {
        setName("");
        setDescription("");
        setPrivacy("Public");
        setCategory("General");
        setAvatar("");
        setAvatarFile(null);
        setError("");
        setIsDragging(false);
        setIsCreating(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    // =====================================================
    // OPEN / CLOSE EFFECT
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        resetForm();

        const timer = setTimeout(() => {
            nameInputRef.current?.focus();
        }, 100);

        return () => clearTimeout(timer);
    }, [isOpen]);


    // =====================================================
    // ESCAPE KEY + BODY LOCK
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape" && !isCreating) {
                onClose?.();
            }
        };

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.body.style.overflow =
                originalOverflow;

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, isCreating, onClose]);


    // =====================================================
    // OVERLAY CLICK
    // =====================================================

    const handleOverlayClick = (event) => {
        if (
            event.target === event.currentTarget &&
            !isCreating
        ) {
            onClose?.();
        }
    };


    // =====================================================
    // IMAGE VALIDATION
    // =====================================================

    const processImage = (file) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size must be less than 5MB."
            );
            return;
        }

        setError("");
        setAvatarFile(file);

        const reader = new FileReader();

        reader.onload = () => {
            setAvatar(reader.result);
        };

        reader.onerror = () => {
            setAvatar("");
            setAvatarFile(null);

            setError(
                "Unable to read the selected image."
            );
        };

        reader.readAsDataURL(file);
    };


    // =====================================================
    // FILE INPUT
    // =====================================================

    const handleAvatarClick = () => {
        if (!isCreating) {
            fileInputRef.current?.click();
        }
    };


    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        processImage(file);
    };


    // =====================================================
    // DRAG & DROP
    // =====================================================

    const handleDragOver = (event) => {
        event.preventDefault();

        if (!isCreating) {
            setIsDragging(true);
        }
    };


    const handleDragLeave = (event) => {
        event.preventDefault();

        if (
            event.currentTarget === event.target ||
            !event.currentTarget.contains(event.relatedTarget)
        ) {
            setIsDragging(false);
        }
    };


    const handleDrop = (event) => {
        event.preventDefault();

        setIsDragging(false);

        if (isCreating) {
            return;
        }

        const file = event.dataTransfer.files?.[0];

        processImage(file);
    };


    // =====================================================
    // CREATE GROUP
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanName = name.trim();
        const cleanDescription =
            description.trim();

        setError("");


        if (!cleanName) {
            setError(
                "Please enter a group name."
            );
            nameInputRef.current?.focus();
            return;
        }


        if (cleanName.length < 2) {
            setError(
                "Group name must contain at least 2 characters."
            );
            nameInputRef.current?.focus();
            return;
        }


        if (cleanName.length > 50) {
            setError(
                "Group name cannot exceed 50 characters."
            );
            nameInputRef.current?.focus();
            return;
        }


        if (cleanDescription.length > 250) {
            setError(
                "Description cannot exceed 250 characters."
            );
            return;
        }


        const newGroup = {
            id: `group-${Date.now()}`,

            name: cleanName,

            description:
                cleanDescription,

            avatar,

            avatarFile,

            privacy:
                privacy.toLowerCase(),

            category,

            members: 1,

            onlineMembers: 1,

            createdAt:
                new Date().toISOString(),
        };


        setIsCreating(true);


        try {
            await Promise.resolve(
                onCreate?.(newGroup)
            );

            onClose?.();
        } catch (createError) {
            console.error(
                "Create group error:",
                createError
            );

            setError(
                "Something went wrong while creating the group."
            );

            setIsCreating(false);
        }
    };


    // =====================================================
    // CLOSE
    // =====================================================

    const handleClose = () => {
        if (isCreating) {
            return;
        }

        onClose?.();
    };


    // =====================================================
    // RENDER
    // =====================================================

    if (!isOpen) {
        return null;
    }


    return (
        <div
            className="create-group-modal"
            onMouseDown={handleOverlayClick}
        >

            <div
                className="create-group-modal__backdrop"
                aria-hidden="true"
            />


            <div
                className="create-group-modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-group-title"
                aria-describedby="create-group-description"
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="create-group-modal__header">

                    <div className="create-group-modal__heading">

                        <div className="create-group-modal__icon">
                            <Users size={20} />
                        </div>


                        <div className="create-group-modal__title-wrapper">

                            <h2 id="create-group-title">
                                Create Group
                            </h2>

                            <p id="create-group-description">
                                Build your own community
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="create-group-modal__close"
                        onClick={handleClose}
                        disabled={isCreating}
                        aria-label="Close create group modal"
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form
                    className="create-group-modal__form"
                    onSubmit={handleSubmit}
                >

                    {/* ================================================= */}
                    {/* GROUP IMAGE */}
                    {/* ================================================= */}

                    <div className="create-group-modal__avatar-wrapper">

                        <button
                            type="button"
                            className={`create-group-modal__upload ${
                                isDragging
                                    ? "is-dragging"
                                    : ""
                            } ${
                                avatar
                                    ? "has-image"
                                    : ""
                            }`}
                            onClick={handleAvatarClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            disabled={isCreating}
                            aria-label="Upload group picture"
                        >

                            {avatar ? (
                                <>
                                    <img
                                        src={avatar}
                                        alt="Group preview"
                                        className="create-group-modal__preview"
                                    />

                                    <span className="create-group-modal__upload-overlay">
                                        <ImagePlus size={18} />
                                        <span>
                                            Change
                                        </span>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <div className="create-group-modal__upload-icon">
                                        <Users size={30} />
                                    </div>

                                    <span className="create-group-modal__upload-plus">
                                        <ImagePlus size={13} />
                                    </span>
                                </>
                            )}

                        </button>


                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleAvatarChange}
                            hidden
                        />


                        <div className="create-group-modal__avatar-info">

                            <div className="create-group-modal__avatar-title">
                                <strong>
                                    Group Picture
                                </strong>

                                <span>
                                    Optional
                                </span>
                            </div>


                            <p>
                                Upload an image to represent
                                your community.
                            </p>


                            <div className="create-group-modal__upload-hint">
                                <Upload size={13} />
                                <span>
                                    JPG, PNG or WEBP · Max 5MB
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* GROUP NAME */}
                    {/* ================================================= */}

                    <div className="create-group-modal__field">

                        <div className="create-group-modal__label-row">

                            <label htmlFor="group-name">
                                Group Name
                            </label>

                            <span>
                                {name.length}/50
                            </span>

                        </div>


                        <div
                            className={`create-group-modal__input-wrapper ${
                                name.length > 45
                                    ? "is-near-limit"
                                    : ""
                            }`}
                        >

                            <input
                                ref={nameInputRef}
                                id="group-name"
                                type="text"
                                value={name}
                                onChange={(event) => {
                                    setName(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                placeholder="e.g. DevChat Community"
                                maxLength={50}
                                autoComplete="off"
                                disabled={isCreating}
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* DESCRIPTION */}
                    {/* ================================================= */}

                    <div className="create-group-modal__field">

                        <div className="create-group-modal__label-row">

                            <label htmlFor="group-description">
                                Description

                                <span className="is-optional">
                                    Optional
                                </span>
                            </label>

                            <span>
                                {description.length}/250
                            </span>

                        </div>


                        <textarea
                            id="group-description"
                            value={description}
                            onChange={(event) => {
                                setDescription(
                                    event.target.value
                                );
                                setError("");
                            }}
                            placeholder="Tell people what this group is about..."
                            maxLength={250}
                            rows={3}
                            disabled={isCreating}
                        />

                    </div>


                    {/* ================================================= */}
                    {/* PRIVACY */}
                    {/* ================================================= */}

                    <div className="create-group-modal__field">

                        <div className="create-group-modal__label-row">
                            <label>
                                Group Privacy
                            </label>
                        </div>


                        <div
                            className="create-group-modal__privacy"
                            role="radiogroup"
                            aria-label="Group privacy"
                        >

                            {/* PUBLIC */}

                            <button
                                type="button"
                                role="radio"
                                aria-checked={
                                    privacy === "Public"
                                }
                                className={`create-group-modal__privacy-option ${
                                    privacy === "Public"
                                        ? "is-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    setPrivacy("Public");
                                    setError("");
                                }}
                                disabled={isCreating}
                            >

                                <div className="create-group-modal__privacy-icon">
                                    <Globe2 size={18} />
                                </div>


                                <span className="create-group-modal__privacy-content">

                                    <strong>
                                        Public
                                    </strong>

                                    <small>
                                        Anyone can find and join
                                    </small>

                                </span>


                                <span className="create-group-modal__radio">

                                    {privacy === "Public" && (
                                        <Check size={12} />
                                    )}

                                </span>

                            </button>


                            {/* PRIVATE */}

                            <button
                                type="button"
                                role="radio"
                                aria-checked={
                                    privacy === "Private"
                                }
                                className={`create-group-modal__privacy-option ${
                                    privacy === "Private"
                                        ? "is-active"
                                        : ""
                                }`}
                                onClick={() => {
                                    setPrivacy("Private");
                                    setError("");
                                }}
                                disabled={isCreating}
                            >

                                <div className="create-group-modal__privacy-icon">
                                    <LockKeyhole size={18} />
                                </div>


                                <span className="create-group-modal__privacy-content">

                                    <strong>
                                        Private
                                    </strong>

                                    <small>
                                        Only invited people can join
                                    </small>

                                </span>


                                <span className="create-group-modal__radio">

                                    {privacy === "Private" && (
                                        <Check size={12} />
                                    )}

                                </span>

                            </button>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* CATEGORY */}
                    {/* ================================================= */}

                    <div className="create-group-modal__field">

                        <div className="create-group-modal__label-row">

                            <label htmlFor="group-category">
                                Category
                            </label>

                        </div>


                        <div className="create-group-modal__select">

                            <select
                                id="group-category"
                                value={category}
                                onChange={(event) => {
                                    setCategory(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                                disabled={isCreating}
                            >

                                {categories.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}

                            </select>


                            <ChevronDown
                                size={16}
                                className="create-group-modal__select-icon"
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (
                        <div
                            className="create-group-modal__error"
                            role="alert"
                        >

                            <AlertCircle size={16} />

                            <span>
                                {error}
                            </span>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* ACTIONS */}
                    {/* ================================================= */}

                    <div className="create-group-modal__actions">

                        <button
                            type="button"
                            className="create-group-modal__cancel"
                            onClick={handleClose}
                            disabled={isCreating}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="create-group-modal__create"
                            disabled={isCreating}
                        >

                            {isCreating ? (
                                <>
                                    <span className="create-group-modal__spinner" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Users size={16} />
                                    Create Group
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default CreateGroupModal;