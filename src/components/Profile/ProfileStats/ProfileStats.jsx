import "./ProfileStats.css";

import {
    Image,
    Film,
    Users,
    UserRound,
} from "lucide-react";

function ProfileStats({
    posts = 0,
    reels = 0,
    followers = 0,
    following = 0,
    onPosts,
    onReels,
    onFollowers,
    onFollowing,
}) {
    const stats = [
        {
            id: "posts",
            label: "Posts",
            value: posts,
            icon: Image,
            onClick: onPosts,
        },
        {
            id: "reels",
            label: "Reels",
            value: reels,
            icon: Film,
            onClick: onReels,
        },
        {
            id: "followers",
            label: "Followers",
            value: followers,
            icon: Users,
            onClick: onFollowers,
        },
        {
            id: "following",
            label: "Following",
            value: following,
            icon: UserRound,
            onClick: onFollowing,
        },
    ];

    return (
        <section className="profile-stats">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <button
                        key={stat.id}
                        type="button"
                        className="profile-stat"
                        onClick={stat.onClick}
                    >
                        <div className="profile-stat-icon">
                            <Icon size={17} />
                        </div>

                        <div className="profile-stat-content">
                            <strong>
                                {stat.value.toLocaleString()}
                            </strong>

                            <span>{stat.label}</span>
                        </div>
                    </button>
                );
            })}
        </section>
    );
}

export default ProfileStats;