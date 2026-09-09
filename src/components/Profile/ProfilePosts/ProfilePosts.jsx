import "./ProfilePosts.css";

import {
    Heart,
    MessageCircle,
    Play,
    Image as ImageIcon,
} from "lucide-react";


function ProfilePosts({
    posts = [],
    emptyMessage = "No posts yet.",
    onPostClick,
}) {

    if (!posts.length) {
        return (
            <section className="profile-posts-empty">

                <div className="profile-posts-empty-icon">
                    <ImageIcon size={28} />
                </div>

                <h3>No Posts Yet</h3>

                <p>{emptyMessage}</p>

            </section>
        );
    }


    return (
        <section className="profile-posts">

            <div className="profile-posts-grid">

                {posts.map((post) => (

                    <button
                        key={post.id}
                        type="button"
                        className="profile-post-card"
                        onClick={() => onPostClick?.(post)}
                    >

                        {post.image ? (
                            <img
                                src={post.image}
                                alt={post.alt || "Profile post"}
                                className="profile-post-image"
                            />
                        ) : (
                            <div className="profile-post-placeholder">
                                <ImageIcon size={28} />
                            </div>
                        )}


                        <div className="profile-post-overlay">

                            <div className="profile-post-stats">

                                <span>
                                    <Heart size={16} />
                                    {post.likes || 0}
                                </span>

                                <span>
                                    <MessageCircle size={16} />
                                    {post.comments || 0}
                                </span>

                            </div>

                        </div>


                        {post.type === "video" && (
                            <span className="profile-post-video">
                                <Play size={14} fill="currentColor" />
                            </span>
                        )}

                    </button>

                ))}

            </div>

        </section>
    );
}


export default ProfilePosts;