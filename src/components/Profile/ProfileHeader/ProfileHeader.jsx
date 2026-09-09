import "./ProfileHeader.css";

import {
    MessageCircle,
    UserPlus,
    MoreHorizontal,
    Share2,
    QrCode,
} from "lucide-react";

import ProfileCover from "../ProfileCover/ProfileCover";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import ProfileInfo from "../ProfileInfo/ProfileInfo";


function ProfileHeader({
    profile = {},
    isOwnProfile = false,
    following = false,
    onMessage,
    onFollow,
    onMore,
    onShare,
    onQR,
}) {

    const {
        name = "Your Name",
        username = "username",
        bio = "Hey! I'm using DevChat.",
        avatar = "",
        cover = "",
        location = "",
        website = "",
        joined = "September 2025",
        online = true,
        verified = false,
    } = profile;


    return (
        <section className="profile-header">

            <ProfileCover
                coverImage={cover}
            />


            <div className="profile-header-body">

                <div className="profile-header-main">

                    <ProfileAvatar
                        src={avatar}
                        name={name}
                        online={online}
                        verified={verified}
                    />


                    <ProfileInfo
                        name={name}
                        username={username}
                        bio={bio}
                        location={location}
                        website={website}
                        joined={joined}
                    />

                </div>


                <div className="profile-header-actions">

                    {!isOwnProfile && (
                        <>
                            <button
                                type="button"
                                className="profile-header-button primary"
                                onClick={onMessage}
                            >
                                <MessageCircle size={16} />
                                <span>Message</span>
                            </button>


                            <button
                                type="button"
                                className={`profile-header-button ${
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
                        className="profile-header-icon-button"
                        onClick={onShare}
                        aria-label="Share profile"
                    >
                        <Share2 size={17} />
                    </button>


                    <button
                        type="button"
                        className="profile-header-icon-button"
                        onClick={onQR}
                        aria-label="QR profile"
                    >
                        <QrCode size={17} />
                    </button>


                    <button
                        type="button"
                        className="profile-header-icon-button"
                        onClick={onMore}
                        aria-label="More options"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                </div>

            </div>

        </section>
    );
}


export default ProfileHeader;