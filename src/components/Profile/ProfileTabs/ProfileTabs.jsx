import "./ProfileTabs.css";

import {
    Image,
    Film,
    Images,
    Info,
} from "lucide-react";


function ProfileTabs({
    activeTab = "posts",
    onTabChange,
}) {

    const tabs = [
        {
            id: "posts",
            label: "Posts",
            icon: Image,
        },
        {
            id: "reels",
            label: "Reels",
            icon: Film,
        },
        {
            id: "media",
            label: "Media",
            icon: Images,
        },
        {
            id: "about",
            label: "About",
            icon: Info,
        },
    ];


    return (
        <nav
            className="profile-tabs"
            aria-label="Profile content navigation"
        >

            <div className="profile-tabs-list">

                {tabs.map((tab) => {

                    const Icon = tab.icon;

                    const active =
                        activeTab === tab.id;


                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={`profile-tab ${
                                active ? "active" : ""
                            }`}
                            onClick={() =>
                                onTabChange?.(tab.id)
                            }
                        >

                            <span className="profile-tab-icon">
                                <Icon size={17} />
                            </span>

                            <span className="profile-tab-label">
                                {tab.label}
                            </span>

                        </button>
                    );

                })}

            </div>

            <div className="profile-tabs-line">
                <div
                    className={`profile-tabs-indicator ${activeTab}`}
                />
            </div>

        </nav>
    );
}


export default ProfileTabs;