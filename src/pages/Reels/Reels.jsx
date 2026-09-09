import "./Reels.css";

import ReelFeed from "../../components/Reels/ReelFeed/ReelFeed";
import CreateReelModal from "../../components/Reels/CreateReelModal/CreateReelModal";

import {
    useState,
} from "react";


// ======================================================
// DEFAULT REELS
// ======================================================

const defaultReels = [
    {
        id: "default-1",
        username: "devuser",
        caption: "Beautiful flowers 🌸",
        music: "Original audio",
        videoUrl:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        liked: false,
        saved: false,

        likes: 125,
        comments: 12,
        shares: 4,
    },

    {
        id: "default-2",
        username: "naturelover",
        caption: "Nature is always beautiful 🌿",
        music: "Nature sounds",
        videoUrl:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",

        liked: false,
        saved: false,

        likes: 248,
        comments: 24,
        shares: 8,
    },

    {
        id: "default-3",
        username: "reelcreator",
        caption: "Another beautiful moment ✨",
        music: "Original audio",
        videoUrl:
            "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",

        liked: false,
        saved: false,

        likes: 512,
        comments: 48,
        shares: 16,
    },
];


// ======================================================
// REELS PAGE
// ======================================================

function Reels() {

    // ======================================================
    // CREATE REEL MODAL
    // ======================================================

    const [
        createReelOpen,
        setCreateReelOpen,
    ] = useState(false);


    // ======================================================
    // ALL REELS
    // ======================================================

    const [
        reels,
        setReels,
    ] = useState(defaultReels);


    // ======================================================
    // CREATE NEW REEL
    // ======================================================

    const handleCreateReel = (newReel) => {

        if (!newReel) {
            return;
        }


        const normalizedReel = {
            ...newReel,

            id:
                newReel.id ??
                `reel-${Date.now()}`,

            liked: false,
            saved: false,

            likes:
                Number(newReel.likes) || 0,

            comments:
                Number(newReel.comments) || 0,

            shares:
                Number(newReel.shares) || 0,
        };


        // Newest reel appears first.

        setReels((previousReels) => [
            normalizedReel,
            ...previousReels,
        ]);


        setCreateReelOpen(false);
    };


    // ======================================================
    // UPDATE REEL
    // ======================================================

    const handleUpdateReel = (
        reelId,
        updates,
    ) => {

        if (
            reelId === undefined ||
            reelId === null ||
            !updates
        ) {
            return;
        }


        setReels((previousReels) =>
            previousReels.map((reel) => {

                if (reel.id !== reelId) {
                    return reel;
                }


                return {
                    ...reel,
                    ...updates,
                };

            })
        );
    };


    // ======================================================
    // LIKE REEL
    // ======================================================

    const handleLikeReel = (
        reelId,
    ) => {

        setReels((previousReels) =>
            previousReels.map((reel) => {

                if (reel.id !== reelId) {
                    return reel;
                }


                const nextLiked =
                    !Boolean(reel.liked);


                const currentLikes =
                    Number(reel.likes) || 0;


                return {
                    ...reel,

                    liked:
                        nextLiked,

                    likes:
                        nextLiked
                            ? currentLikes + 1
                            : Math.max(
                                0,
                                currentLikes - 1,
                            ),
                };

            })
        );
    };


    // ======================================================
    // SAVE REEL
    // ======================================================

    const handleSaveReel = (
        reelId,
    ) => {

        setReels((previousReels) =>
            previousReels.map((reel) => {

                if (reel.id !== reelId) {
                    return reel;
                }


                return {
                    ...reel,

                    saved:
                        !Boolean(reel.saved),
                };

            })
        );
    };


    // ======================================================
    // ADD COMMENT
    // ======================================================

    const handleCommentAdded = (
        reelId,
    ) => {

        setReels((previousReels) =>
            previousReels.map((reel) => {

                if (reel.id !== reelId) {
                    return reel;
                }


                const currentComments =
                    Number(reel.comments) || 0;


                return {
                    ...reel,

                    comments:
                        currentComments + 1,
                };

            })
        );
    };


    // ======================================================
    // SHARE REEL
    // ======================================================

    const handleShareReel = (
        reelId,
    ) => {

        setReels((previousReels) =>
            previousReels.map((reel) => {

                if (reel.id !== reelId) {
                    return reel;
                }


                const currentShares =
                    Number(reel.shares) || 0;


                return {
                    ...reel,

                    shares:
                        currentShares + 1,
                };

            })
        );
    };


    // ======================================================
    // RENDER
    // ======================================================

    return (
        <main className="reels-page">

            <ReelFeed
                reels={reels}

                onCreateReel={() =>
                    setCreateReelOpen(true)
                }

                onUpdateReel={
                    handleUpdateReel
                }

                onLikeReel={
                    handleLikeReel
                }

                onSaveReel={
                    handleSaveReel
                }

                onCommentAdded={
                    handleCommentAdded
                }

                onShareReel={
                    handleShareReel
                }
            />


            <CreateReelModal
                open={createReelOpen}

                onClose={() =>
                    setCreateReelOpen(false)
                }

                onPost={
                    handleCreateReel
                }
            />

        </main>
    );
}


export default Reels;