import "./SettingsPrivacy.css";

import {
    Eye,
    CircleUserRound,
    CheckCheck,
    PenLine,
    Phone,
    Ban,
    MessageCircle,
} from "lucide-react";

import { useState } from "react";


function SettingsPrivacy() {

    const [settings, setSettings] = useState({
        lastSeen: true,
        onlineStatus: true,
        profilePhoto: true,
        readReceipts: true,
        typingIndicator: true,
        calls: true,
        messages: true,
    });


    const toggleSetting = (key) => {

        setSettings((current) => ({
            ...current,
            [key]: !current[key],
        }));

    };


    const privacyItems = [
        {
            key: "lastSeen",
            icon: Eye,
            title: "Last Seen",
            description: "Allow others to see when you were last active.",
        },
        {
            key: "onlineStatus",
            icon: CircleUserRound,
            title: "Online Status",
            description: "Show when you are currently online.",
        },
        {
            key: "profilePhoto",
            icon: CircleUserRound,
            title: "Profile Photo",
            description: "Allow others to view your profile picture.",
        },
        {
            key: "readReceipts",
            icon: CheckCheck,
            title: "Read Receipts",
            description: "Show when you have read a message.",
        },
        {
            key: "typingIndicator",
            icon: PenLine,
            title: "Typing Indicator",
            description: "Show when you are typing a message.",
        },
        {
            key: "calls",
            icon: Phone,
            title: "Calls",
            description: "Allow people to call you on DevChat.",
        },
        {
            key: "messages",
            icon: MessageCircle,
            title: "Messages",
            description: "Allow messages from other users.",
        },
    ];


    return (
        <section className="settings-privacy">

            {/* =================================================
                PRIVACY
            ================================================= */}

            <div className="settings-privacy__section">

                <div className="settings-privacy__header">

                    <div>
                        <h2>Privacy</h2>

                        <span>
                            Control who can see your activity and contact you.
                        </span>
                    </div>

                </div>


                <div className="settings-privacy__items">

                    {privacyItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <div
                                className="settings-privacy__item"
                                key={item.key}
                            >

                                <div className="settings-privacy__icon">
                                    <Icon size={17} />
                                </div>


                                <div className="settings-privacy__content">

                                    <strong>
                                        {item.title}
                                    </strong>

                                    <span>
                                        {item.description}
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className={`settings-privacy__toggle ${
                                        settings[item.key]
                                            ? "settings-privacy__toggle--active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        toggleSetting(item.key)
                                    }
                                    aria-label={`Toggle ${item.title}`}
                                    aria-pressed={
                                        settings[item.key]
                                    }
                                >

                                    <span />

                                </button>

                            </div>
                        );

                    })}

                </div>

            </div>


            {/* =================================================
                BLOCKED USERS
            ================================================= */}

            <button
                type="button"
                className="settings-privacy__blocked"
            >

                <div className="settings-privacy__blocked-icon">
                    <Ban size={17} />
                </div>


                <div className="settings-privacy__blocked-content">

                    <strong>
                        Blocked Users
                    </strong>

                    <span>
                        Manage users you have blocked.
                    </span>

                </div>


                <span className="settings-privacy__blocked-count">
                    0
                </span>

            </button>

        </section>
    );
}


export default SettingsPrivacy;