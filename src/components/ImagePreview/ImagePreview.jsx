import "./ImagePreview.css";

import {
    X,
    Plus,
    Image as ImageIcon
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState
} from "react";

import { useChat } from "../../context/ChatContext";

function ImagePreview() {

    const {
        selectedImages = [],
        addSelectedImages,
        removeSelectedImage,
        clearSelectedImages
    } = useChat();

    const [activeIndex, setActiveIndex] = useState(0);

    const addMoreInput = useRef(null);

    // =====================================================
    // SAFETY
    // =====================================================

    const images = Array.isArray(selectedImages)
        ? selectedImages
        : [];

    // =====================================================
    // ACTIVE IMAGE
    // =====================================================

    useEffect(() => {

        if (images.length === 0) {

            setActiveIndex(0);

            return;
        }

        if (activeIndex >= images.length) {

            setActiveIndex(images.length - 1);

        }

    }, [images.length, activeIndex]);

    // =====================================================
    // CREATE PREVIEW URL
    // =====================================================

    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {

        const urls = images.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setPreviewUrls(urls);

        return () => {

            urls.forEach(item => {

                URL.revokeObjectURL(item.url);

            });

        };

    }, [images]);

    // =====================================================
    // ADD MORE
    // =====================================================

    function handleAddMore(event) {

        const files = Array.from(
            event.target.files || []
        );

        if (!files.length) {

            event.target.value = "";

            return;

        }

        addSelectedImages(files);

        event.target.value = "";

    }

    // =====================================================
    // REMOVE
    // =====================================================

    function handleRemove(index) {

        removeSelectedImage(index);

        setActiveIndex(prev => {

            if (index < prev) {

                return prev - 1;

            }

            if (
                index === prev &&
                prev > 0
            ) {

                return prev - 1;

            }

            return prev;

        });

    }

    // =====================================================
    // CLEAR
    // =====================================================

    function handleClear() {

        clearSelectedImages();

        setActiveIndex(0);

    }

    // =====================================================
    // NOTHING SELECTED
    // =====================================================

    if (!images.length) {

        return null;

    }

    const activeImage =
        previewUrls[activeIndex];

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="image-preview-panel">

            {/* HEADER */}

            <div className="image-preview-header">

                <div className="image-preview-title">

                    <ImageIcon size={15} />

                    <span>
                        {images.length}/20 Photos
                    </span>

                </div>

                <button
                    type="button"
                    className="image-preview-clear"
                    onClick={handleClear}
                >
                    <X size={16} />
                </button>

            </div>


            {/* MAIN IMAGE */}

            <div className="image-preview-main">

                {activeImage && (

                    <img
                        src={activeImage.url}
                        alt={`Preview ${activeIndex + 1}`}
                    />

                )}

            </div>


            {/* THUMBNAILS */}

            <div className="image-preview-thumbnails">

                {previewUrls.map(
                    (item, index) => (

                        <div
                            key={`${item.file.name}-${index}`}
                            className={
                                index === activeIndex
                                    ? "image-preview-thumbnail active"
                                    : "image-preview-thumbnail"
                            }
                        >

                            <button
                                type="button"
                                className="image-preview-thumbnail-button"
                                onClick={() =>
                                    setActiveIndex(index)
                                }
                            >

                                <img
                                    src={item.url}
                                    alt={`Thumbnail ${index + 1}`}
                                />

                            </button>


                            <button
                                type="button"
                                className="image-preview-remove"
                                onClick={() =>
                                    handleRemove(index)
                                }
                            >

                                <X size={10} />

                            </button>

                        </div>

                    )
                )}


                {/* ADD MORE */}

                {images.length < 20 && (

                    <button
                        type="button"
                        className="image-preview-add"
                        onClick={() =>
                            addMoreInput.current?.click()
                        }
                    >

                        <Plus size={19} />

                    </button>

                )}

            </div>


            {/* HIDDEN INPUT */}

            <input
                ref={addMoreInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleAddMore}
            />

        </div>

    );

}

export default ImagePreview;