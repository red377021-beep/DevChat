import "./BubbleVideoPreview.css";

import {
    Play,
    X
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";


function BubbleVideoPreview({
    videos = [],
    onRemove
}) {

    const [items, setItems] = useState([]);


    // =====================================================
    // NORMALIZE VIDEOS
    // =====================================================

    useEffect(() => {

        const list =
            Array.isArray(videos)
                ? videos.filter(Boolean)
                : [];

        const normalized =
            list.map((video, index) => {

                if (video instanceof File) {

                    return {
                        id: `${video.name}-${video.size}-${index}`,
                        file: video,
                        name: video.name,
                        url: URL.createObjectURL(video)
                    };

                }

                if (typeof video === "string") {

                    return {
                        id: `${video}-${index}`,
                        file: null,
                        name: `Video ${index + 1}`,
                        url: video
                    };

                }

                if (video?.url) {

                    return {
                        id: `${video.name || "video"}-${index}`,
                        file: video.file || null,
                        name: video.name || `Video ${index + 1}`,
                        url: video.url
                    };

                }

                return null;

            }).filter(Boolean);

        setItems(normalized);


        return () => {

            normalized.forEach(item => {

                if (
                    item.file instanceof File &&
                    item.url?.startsWith("blob:")
                ) {

                    URL.revokeObjectURL(item.url);

                }

            });

        };

    }, [videos]);


    // =====================================================
    // EMPTY
    // =====================================================

    if (!items.length) {

        return null;

    }


    // =====================================================
    // REMOVE
    // =====================================================

    function handleRemove(index) {

        onRemove?.(index);

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className={
                items.length === 1
                    ? "bubble-video-preview single"
                    : items.length === 2
                        ? "bubble-video-preview double"
                        : "bubble-video-preview multiple"
            }
        >

            {items.map((item, index) => (

                <div
                    className="bubble-video-preview-card"
                    key={item.id}
                >

                    {/* VIDEO */}

                    <video
                        className="bubble-video-preview-video"
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                    />


                    {/* DARK OVERLAY */}

                    <div className="bubble-video-preview-overlay" />


                    {/* PLAY ICON */}

                    <div className="bubble-video-preview-play">

                        <Play
                            size={22}
                            fill="currentColor"
                        />

                    </div>


                    {/* REMOVE */}

                    {onRemove && (

                        <button
                            type="button"
                            className="bubble-video-preview-remove"
                            onClick={() =>
                                handleRemove(index)
                            }
                            aria-label={`Remove ${item.name}`}
                            title="Remove video"
                        >

                            <X size={16} />

                        </button>

                    )}


                    {/* NAME */}

                    <div className="bubble-video-preview-name">

                        {item.name}

                    </div>

                </div>

            ))}

        </div>

    );

}


export default BubbleVideoPreview;