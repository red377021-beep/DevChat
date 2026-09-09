import "./ReelFeed.css";

import ReelCard from "../ReelCard/ReelCard";


function ReelFeed({
    reels = [],
    onCreateReel,
    onUpdateReel,
    onLikeReel,
    onSaveReel,
    onCommentAdded,
    onShareReel,
}) {

    // ======================================================
    // RENDER
    // ======================================================

    return (

        <section
            className="reel-feed"
            aria-label="DevChat Reels"
        >

            <div className="reel-feed__scroll">

                {reels.map(
                    (reel, index) => (

                        <div
                            className="reel-feed__item"
                            key={
                                reel?.id ??
                                reel?.videoUrl ??
                                index
                            }
                        >

                            <ReelCard
                                reel={reel}

                                onCreateReel={
                                    onCreateReel
                                }

                                onUpdateReel={
                                    onUpdateReel
                                }

                                onLikeReel={
                                    onLikeReel
                                }

                                onSaveReel={
                                    onSaveReel
                                }

                                onCommentAdded={
                                    onCommentAdded
                                }

                                onShareReel={
                                    onShareReel
                                }
                            />

                        </div>

                    )
                )}

            </div>

        </section>

    );

}


export default ReelFeed;