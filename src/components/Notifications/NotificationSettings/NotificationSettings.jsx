import "./NotificationSettings.css";

import {
    Bell,
    Heart,
    MessageCircle,
    UserPlus,
    UserCheck,
    AtSign,
    Phone,
    Volume2,
    Smartphone,
    Mail,
} from "lucide-react";

import { useState } from "react";


function NotificationSettings() {

    const [settings, setSettings] = useState({
        push: true,
        likes: true,
        comments: true,
        followers: true,
        requests: true,
        mentions: true,
        calls: true,
        sound: true,
        vibration: true,
        email: false,
    });


    const toggleSetting = (key) => {

        setSettings((current) => ({
            ...current,
            [key]: !current[key],
        }));

    };


    const notificationSettings = [
        {
            id: "push",
            title: "Push Notifications",
            description: "Receive notifications on your device",
            icon: Bell,
        },
        {
            id: "likes",
            title: "Likes",
            description: "When someone likes your content",
            icon: Heart,
        },
        {
            id: "comments",
            title: "Comments",
            description: "When someone comments on your content",
            icon: MessageCircle,
        },
        {
            id: "followers",
            title: "New Followers",
            description: "When someone follows you",
            icon: UserPlus,
        },
        {
            id: "requests",
            title: "Friend Requests",
            description: "When someone sends you a friend request",
            icon: UserCheck,
        },
        {
            id: "mentions",
            title: "Mentions",
            description: "When someone mentions you",
            icon: AtSign,
        },
        {
            id: "calls",
            title: "Calls",
            description: "Incoming voice and video calls",
            icon: Phone,
        },
    ];


    const deviceSettings = [
        {
            id: "sound",
            title: "Notification Sound",
            description: "Play a sound for new notifications",
            icon: Volume2,
        },
        {
            id: "vibration",
            title: "Vibration",
            description: "Vibrate when notifications arrive",
            icon: Smartphone,
        },
        {
            id: "email",
            title: "Email Notifications",
            description: "Receive important activity by email",
            icon: Mail,
        },
    ];


    const renderSetting = (item) => {

        const Icon = item.icon;

        return (
            <div
                key={item.id}
                className="notification-settings__item"
            >

                <div className="notification-settings__icon">
                    <Icon size={17} />
                </div>


                <div className="notification-settings__content">

                    <strong>
                        {item.title}
                    </strong>

                    <span>
                        {item.description}
                    </span>

                </div>


                <button
                    type="button"
                    className={`notification-settings__toggle ${
                        settings[item.id]
                            ? "notification-settings__toggle--active"
                            : ""
                    }`}
                    onClick={() =>
                        toggleSetting(item.id)
                    }
                    aria-label={`${item.title} ${
                        settings[item.id]
                            ? "enabled"
                            : "disabled"
                    }`}
                    aria-pressed={settings[item.id]}
                >

                    <span />

                </button>

            </div>
        );
    };


    return (
        <section className="notification-settings">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="notification-settings__header">

                <div className="notification-settings__header-icon">
                    <Bell size={20} />
                </div>

                <div>
                    <h2>
                        Notification Settings
                    </h2>

                    <p>
                        Control how DevChat notifies you.
                    </p>
                </div>

            </div>


            {/* =================================================
                ACTIVITY
            ================================================= */}

            <div className="notification-settings__section">

                <div className="notification-settings__section-title">
                    <span>Activity</span>
                </div>

                <div className="notification-settings__items">
                    {notificationSettings.map(renderSetting)}
                </div>

            </div>


            {/* =================================================
                DEVICE
            ================================================= */}

            <div className="notification-settings__section">

                <div className="notification-settings__section-title">
                    <span>Sound & Delivery</span>
                </div>

                <div className="notification-settings__items">
                    {deviceSettings.map(renderSetting)}
                </div>

            </div>

        </section>
    );
}


export default NotificationSettings;