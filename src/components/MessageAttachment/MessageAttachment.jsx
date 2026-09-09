import "./MessageAttachment.css";

import BubbleImage from "../BubbleImage";
import BubbleVideo from "../BubbleVideo/BubbleVideo";

import DocumentPreview from "../DocumentPreview/DocumentPreview";
import BubbleAudio from "../BubbleAudio/BubbleAudio";
import BubbleLocation
    from "../BubbleLocation/BubbleLocation";


/**
 * MessageAttachment
 *
 * Central renderer for message attachments.
 *
 * Supported:
 * - Single / multiple images
 * - Single / multiple videos
 * - Documents
 * - Audio attachments
 *
 * Video playback is delegated to BubbleVideo.
 * Document preview is delegated to DocumentPreview.
 * Audio playback is delegated to BubbleAudio.
 */
function MessageAttachment({
    image,
    images = [],
    video,
    videos = [],
    file,
    audio,
    location
}) {


    // =====================================================
    // NORMALIZE IMAGES
    // =====================================================

    const imageList =
        Array.isArray(images)

            ? images
                .flat(Infinity)
                .filter(Boolean)

            : image

                ? [image]

                : [];


    const hasImages =
        imageList.length > 0;


    // =====================================================
    // NORMALIZE VIDEOS
    // =====================================================

    const videoList =
        Array.isArray(videos)

            ? videos
                .flat(Infinity)
                .filter(Boolean)

            : video

                ? [video]

                : [];


    const hasVideos =
        videoList.length > 0;


    // =====================================================
    // DOCUMENT
    // =====================================================

    const hasFile =
        Boolean(file);


    // =====================================================
    // NORMALIZE AUDIO
    // =====================================================

    const audioList =
        Array.isArray(audio)

            ? audio
                .flat(Infinity)
                .filter(Boolean)

            : audio

                ? [audio]

                : [];


    const hasAudio =
        audioList.length > 0;

        const hasLocation =
    Boolean(location);


    // =====================================================
    // ANY ATTACHMENT
    // =====================================================

    const hasAttachments =
    hasImages ||
    hasVideos ||
    hasFile ||
    hasAudio ||
    hasLocation;


    // =====================================================
    // NOTHING TO RENDER
    // =====================================================

    if (!hasAttachments) {

        return null;

    }


    // =====================================================
    // IMAGE GRID CLASS
    // =====================================================

    let imageGridClass =
        "message-image-grid";


    if (imageList.length === 1) {

        imageGridClass += " single";

    }

    else if (imageList.length === 2) {

        imageGridClass += " double";

    }

    else if (imageList.length > 2) {

        imageGridClass += " multiple";

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="message-attachment">


            {/* =================================================
                IMAGES
            ================================================= */}

            {hasImages && (

                <div
                    className={
                        imageGridClass
                    }
                >

                    {imageList.map(
                        (item, index) => (

                            <BubbleImage
                                key={
                                    `image-${index}`
                                }

                                src={item}

                                images={
                                    imageList
                                }

                                index={
                                    index
                                }
                            />

                        )
                    )}

                </div>

            )}


            {/* =================================================
                VIDEOS
            ================================================= */}

            {hasVideos && (

                <div
                    className="message-video-list"
                >

                    {videoList.map(
                        (item, index) => (

                            <BubbleVideo
                                key={
                                    `video-${index}`
                                }

                                src={item}

                            />

                        )
                    )}

                </div>

            )}


            {/* =================================================
                DOCUMENT
            ================================================= */}

            {hasFile && (

                <DocumentPreview
                    file={file}
                />

            )}


            {/* =================================================
                AUDIO
            ================================================= */}

            {hasAudio && (

                <div
                    className="
                        message-audio-list
                    "
                >

                    {audioList.map(
                        (item, index) => (

                            <BubbleAudio
                                key={
                                    `audio-${index}`
                                }

                                audio={item}
                            />

                        )
                    )}

                </div>

            )}

           {hasLocation && (

    <BubbleLocation
        location={location}
    />

)}


        </div>

    );

}


export default MessageAttachment;