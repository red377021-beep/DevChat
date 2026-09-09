import "./ProfileActions.css";

import {
    MessageCircle,
    UserPlus,
    Share2,
    MoreHorizontal,
    Pencil,
} from "lucide-react";

function ProfileActions({
    isOwnProfile = false,
    following = false,
    onMessage,
    onFollow,
    onShare,
    onMore,
    onEdit,
}) {
    return (
        <div className="profile-actions">
            {isOwnProfile ? (
                <button
                    type="button"
                    className="profile-action-button primary"
                    onClick={onEdit}
                >
                    <Pencil size={16} />
                    <span>Edit Profile</span>
                </button>
            ) : (
                <>
                    <button
                        type="button"
                        className="profile-action-button primary"
                        onClick={onMessage}
                    >
                        <MessageCircle size={16} />
                        <span>Message</span>
                    </button>

                    <button
                        type="button"
                        className={`profile-action-button ${
                            following ? "following" : ""
                        }`}
                        onClick={onFollow}
                    >
                        <UserPlus size={16} />

                        <span>
                            {following
                                ? "Following"
                                : "Follow"}
                        </span>
                    </button>
                </>
            )}

            <button
                type="button"
                className="profile-action-icon"
                onClick={onShare}
                aria-label="Share profile"
            >
                <Share2 size={17} />
            </button>

            <button
                type="button"
                className="profile-action-icon"
                onClick={onMore}
                aria-label="More profile options"
            >
                <MoreHorizontal size={19} />
            </button>
        </div>
    );
}

export default ProfileActions;