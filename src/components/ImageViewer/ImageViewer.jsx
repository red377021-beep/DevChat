import "./ImageViewer.css";

import {
    X,
    ChevronLeft,
    ChevronRight,
    Download
} from "lucide-react";

import {
    createPortal
} from "react-dom";

import {
    useEffect,
    useMemo,
    useState
} from "react";

function ImageViewer({
    open,
    images = [],
    initialIndex = 0,
    onClose
}) {

    const imageList = useMemo(() => {

        if (!Array.isArray(images)) {
            return [];
        }

        return images.filter(Boolean);

    }, [images]);


    const [currentIndex, setCurrentIndex] =
        useState(0);


    // =====================================================
    // OPEN / INDEX SYNC
    // =====================================================

    useEffect(() => {

        if (!open || !imageList.length) {
            return;
        }

        const safeIndex = Math.min(
            Math.max(
                Number(initialIndex) || 0,
                0
            ),
            imageList.length - 1
        );

        setCurrentIndex(safeIndex);

    }, [
        open,
        initialIndex,
        imageList.length
    ]);


    // =====================================================
    // BODY LOCK
    // =====================================================

    useEffect(() => {

        if (!open) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        const previousTouchAction =
            document.body.style.touchAction;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";

        return () => {

            document.body.style.overflow =
                previousOverflow;

            document.body.style.touchAction =
                previousTouchAction;

        };

    }, [open]);


    // =====================================================
    // KEYBOARD
    // =====================================================

    useEffect(() => {

        if (!open || imageList.length === 0) {
            return;
        }

        function handleKeyDown(event) {

            if (event.key === "Escape") {

                event.preventDefault();

                onClose?.();

                return;

            }


            if (
                event.key === "ArrowRight" &&
                imageList.length > 1
            ) {

                event.preventDefault();

                setCurrentIndex(
                    previous =>
                        previous >= imageList.length - 1
                            ? 0
                            : previous + 1
                );

                return;

            }


            if (
                event.key === "ArrowLeft" &&
                imageList.length > 1
            ) {

                event.preventDefault();

                setCurrentIndex(
                    previous =>
                        previous <= 0
                            ? imageList.length - 1
                            : previous - 1
                );

            }

        }


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
        imageList.length,
        onClose
    ]);


    // =====================================================
    // NEXT
    // =====================================================

    function nextImage(event) {

        event?.preventDefault();
        event?.stopPropagation();

        if (imageList.length <= 1) {
            return;
        }

        setCurrentIndex(
            previous =>
                previous >= imageList.length - 1
                    ? 0
                    : previous + 1
        );

    }


    // =====================================================
    // PREVIOUS
    // =====================================================

    function previousImage(event) {

        event?.preventDefault();
        event?.stopPropagation();

        if (imageList.length <= 1) {
            return;
        }

        setCurrentIndex(
            previous =>
                previous <= 0
                    ? imageList.length - 1
                    : previous - 1
        );

    }


    // =====================================================
    // THUMBNAIL
    // =====================================================

    function selectImage(
        event,
        index
    ) {

        event?.preventDefault();
        event?.stopPropagation();

        setCurrentIndex(index);

    }


    // =====================================================
    // DOWNLOAD
    // =====================================================

    function downloadImage(event) {

        event?.preventDefault();
        event?.stopPropagation();

        const src =
            imageList[currentIndex];

        if (!src) {
            return;
        }

        const link =
            document.createElement("a");

        link.href = src;

        link.download =
            `devchat-image-${currentIndex + 1}`;

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);

        link.click();

        link.remove();

    }


    // =====================================================
    // CLOSE
    // =====================================================

    function handleClose(event) {

        event?.preventDefault();
        event?.stopPropagation();

        onClose?.();

    }


    // =====================================================
    // EMPTY
    // =====================================================

    if (
        !open ||
        !imageList.length
    ) {

        return null;

    }


    const currentImage =
        imageList[
            Math.min(
                currentIndex,
                imageList.length - 1
            )
        ];


    // =====================================================
    // VIEWER
    //
    // IMPORTANT:
    // Portal viewer directly to BODY.
    // This completely separates it from ChatHeader,
    // MessageBubble, hover layers and stacking contexts.
    // =====================================================

    const viewer = (

        <div
            className="image-viewer-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    handleClose(event);

                }

            }}
        >

            {/* =============================================
                TOP BAR
            ============================================= */}

            <div
                className="image-viewer-topbar"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="image-viewer-counter">

                    <strong>
                        {currentIndex + 1}
                    </strong>

                    <span>/</span>

                    <span>
                        {imageList.length}
                    </span>

                </div>


                <div className="image-viewer-tools">

                    <button
                        type="button"
                        className="image-viewer-tool"
                        onClick={downloadImage}
                        title="Download"
                        aria-label="Download image"
                    >

                        <Download size={19} />

                    </button>


                    <button
                        type="button"
                        className="image-viewer-close"
                        onClick={handleClose}
                        title="Close"
                        aria-label="Close image viewer"
                    >

                        <X size={22} />

                    </button>

                </div>

            </div>


            {/* =============================================
                MAIN STAGE
            ============================================= */}

            <div className="image-viewer-stage">

                {/* PREVIOUS */}

                {imageList.length > 1 && (

                    <button
                        type="button"
                        className="image-viewer-nav image-viewer-prev"
                        onClick={previousImage}
                        aria-label="Previous image"
                        title="Previous image"
                    >

                        <ChevronLeft size={32} />

                    </button>

                )}


                {/* IMAGE */}

                <div
                    className="image-viewer-image-container"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                    onClick={(event) =>
                        event.stopPropagation()
                    }
                >

                    <img
                        className="image-viewer-image"
                        src={currentImage}
                        alt={`Image ${currentIndex + 1}`}
                        draggable={false}
                    />

                </div>


                {/* NEXT */}

                {imageList.length > 1 && (

                    <button
                        type="button"
                        className="image-viewer-nav image-viewer-next"
                        onClick={nextImage}
                        aria-label="Next image"
                        title="Next image"
                    >

                        <ChevronRight size={32} />

                    </button>

                )}

            </div>


            {/* =============================================
                THUMBNAILS
            ============================================= */}

            {imageList.length > 1 && (

                <div
                    className="image-viewer-thumbnails"
                    onMouseDown={(event) =>
                        event.stopPropagation()
                    }
                >

                    {imageList.map(
                        (image, index) => (

                            <button
                                key={`${image}-${index}`}
                                type="button"
                                className={
                                    index === currentIndex
                                        ? "image-viewer-thumb active"
                                        : "image-viewer-thumb"
                                }
                                onClick={(event) =>
                                    selectImage(
                                        event,
                                        index
                                    )
                                }
                                aria-label={`Open image ${index + 1}`}
                            >

                                <img
                                    src={image}
                                    alt=""
                                    draggable={false}
                                />

                            </button>

                        )
                    )}

                </div>

            )}

        </div>

    );


    return createPortal(
        viewer,
        document.body
    );

}


export default ImageViewer;