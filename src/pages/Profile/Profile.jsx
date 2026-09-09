import "./Profile.css";

import {
    useState,
} from "react";

import ProfileHeader from "../../components/Profile/ProfileHeader/ProfileHeader";
import ProfileStats from "../../components/Profile/ProfileStats/ProfileStats";
import ProfileActions from "../../components/Profile/ProfileActions/ProfileActions";
import ProfileTabs from "../../components/Profile/ProfileTabs/ProfileTabs";
import ProfilePosts from "../../components/Profile/ProfilePosts/ProfilePosts";


function Profile() {

    const [following, setFollowing] = useState(false);

    const [activeTab, setActiveTab] = useState("posts");


    const profile = {
        name: "Your Name",
        username: "username",
        bio: "Hey! I'm using DevChat. Building, chatting and sharing ideas.",
        avatar: "",
        cover: "",
        location: "Pakistan",
        website: "",
        joined: "September 2025",
        online: true,
        verified: true,
    };


    const posts = [
        {
            id: 1,
            image: "",
            likes: 124,
            comments: 18,
            type: "image",
        },
        {
            id: 2,
            image: "",
            likes: 89,
            comments: 12,
            type: "video",
        },
        {
            id: 3,
            image: "",
            likes: 210,
            comments: 31,
            type: "image",
        },
        {
            id: 4,
            image: "",
            likes: 76,
            comments: 9,
            type: "image",
        },
        {
            id: 5,
            image: "",
            likes: 154,
            comments: 22,
            type: "video",
        },
        {
            id: 6,
            image: "",
            likes: 98,
            comments: 14,
            type: "image",
        },
    ];


    const handleMessage = () => {
        console.log("Open chat");
    };


    const handleFollow = () => {
        setFollowing((prev) => !prev);
    };


    const handleShare = () => {
        console.log("Share profile");
    };


    const handleQR = () => {
        console.log("Open QR profile");
    };


    const handleMore = () => {
        console.log("Open profile menu");
    };


    const handleEdit = () => {
        console.log("Edit profile");
    };


    const handlePosts = () => {
        setActiveTab("posts");
    };


    const handleReels = () => {
        setActiveTab("reels");
    };


    const handleFollowers = () => {
        console.log("Open followers");
    };


    const handleFollowing = () => {
        console.log("Open following");
    };


    const handlePostClick = (post) => {
        console.log("Open post:", post);
    };


    const renderTabContent = () => {

        switch (activeTab) {

            case "posts":
                return (
                    <ProfilePosts
                        posts={posts}
                        onPostClick={handlePostClick}
                    />
                );


            case "reels":
                return (
                    <section className="profile-content-empty">
                        <div className="profile-content-empty-icon">
                            🎬
                        </div>

                        <h3>
                            Reels
                        </h3>

                        <p>
                            Your reels will appear here.
                        </p>
                    </section>
                );


            case "media":
                return (
                    <section className="profile-content-empty">
                        <div className="profile-content-empty-icon">
                            🖼️
                        </div>

                        <h3>
                            Media
                        </h3>

                        <p>
                            Photos and videos will appear here.
                        </p>
                    </section>
                );


            case "about":
                return (
                    <section className="profile-content-empty">
                        <div className="profile-content-empty-icon">
                            ℹ️
                        </div>

                        <h3>
                            About
                        </h3>

                        <p>
                            More profile information will appear here.
                        </p>
                    </section>
                );


            default:
                return null;
        }
    };


    return (
        <main className="profile-page">

            <div className="profile-page-container">

                {/* PROFILE HEADER */}

                <ProfileHeader
                    profile={profile}
                    isOwnProfile={false}
                    following={following}
                    onMessage={handleMessage}
                    onFollow={handleFollow}
                    onShare={handleShare}
                    onQR={handleQR}
                    onMore={handleMore}
                />


                {/* PROFILE ACTIONS */}

                <ProfileActions
                    isOwnProfile={false}
                    following={following}
                    onMessage={handleMessage}
                    onFollow={handleFollow}
                    onShare={handleShare}
                    onMore={handleMore}
                    onEdit={handleEdit}
                />


                {/* PROFILE STATS */}

                <ProfileStats
                    posts={24}
                    reels={12}
                    followers={1280}
                    following={356}
                    onPosts={handlePosts}
                    onReels={handleReels}
                    onFollowers={handleFollowers}
                    onFollowing={handleFollowing}
                />


                {/* PROFILE TABS */}

                <ProfileTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />


                {/* TAB CONTENT */}

                {renderTabContent()}

            </div>

        </main>
    );
}


export default Profile;