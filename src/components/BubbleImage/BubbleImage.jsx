import "./BubbleImage.css";

import {
    useEffect,
    useState
} from "react";

import ImageViewer from "../ImageViewer";


function BubbleImage({
    src,
    images = [],
    index = 0
}) {

    const [imageUrl, setImageUrl] = useState("");

    const [viewerOpen, setViewerOpen] =
        useState(false);


    // =====================================================
    // RESOLVE ONE IMAGE
    // =====================================================

    function resolveImage(value) {

        if (!value) {
            return "";
        }


        if (typeof value === "string") {
            return value;
        }


        if (value instanceof File) {
            return URL.createObjectURL(value);
        }


        if (
            typeof value === "object" &&
            value.url
        ) {
            return value.url;
        }


        if (
            typeof value === "object" &&
            value.src
        ) {
            return value.src;
        }


        return "";
    }


    // =====================================================
    // CURRENT IMAGE
    // =====================================================

    useEffect(() => {

        if (!src) {

            setImageUrl("");

            return;

        }


        const resolved =
            resolveImage(src);


        setImageUrl(resolved);


        // Object URL cleanup
        if (src instanceof File) {

            return () => {

                URL.revokeObjectURL(resolved);

            };

        }

    }, [src]);


    // =====================================================
    // VIEWER IMAGE LIST
    // =====================================================

    const viewerImages = images
        .map(resolveImage)
        .filter(Boolean);


    // =====================================================
    // FALLBACK
    // =====================================================

    const finalViewerImages =
        viewerImages.length > 0
            ? viewerImages
            : imageUrl
                ? [imageUrl]
                : [];


    // =====================================================
    // FIND CURRENT INDEX
    // =====================================================

    const safeIndex =
        Math.min(
            Math.max(index, 0),
            Math.max(
                finalViewerImages.length - 1,
                0
            )
        );


    // =====================================================
    // OPEN
    // =====================================================

    function handleOpenViewer(event) {

        event.preventDefault();

        event.stopPropagation();

        if (!imageUrl) {
            return;
        }

        setViewerOpen(true);

    }


    // =====================================================
    // CLOSE
    // =====================================================

    function handleCloseViewer() {

        setViewerOpen(false);

    }


    // =====================================================
    // NOTHING
    // =====================================================

    if (!imageUrl) {

        return null;

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <>

            <button
                type="button"
                className="bubble-image"
                onClick={handleOpenViewer}
                aria-label="Open image"
            >

                <img
                    src={imageUrl}
                    alt="Attachment"
                    loading="lazy"
                    draggable={false}
                />


                {finalViewerImages.length > 1 &&
                    safeIndex === 0 && (

                    <span className="bubble-image-count">

                        {finalViewerImages.length}

                    </span>

                )}

            </button>


            {/* =================================================
                IMAGE VIEWER
            ================================================= */}

            {viewerOpen && (

                <ImageViewer

                    open={true}

                    images={finalViewerImages}

                    initialIndex={safeIndex}

                    onClose={handleCloseViewer}

                />

            )}

        </>

    );

}


export default BubbleImage;