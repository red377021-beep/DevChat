import "./SettingsNotifications.css";

import {
    Bell,
    MessageCircle,
    Heart,
    UserPlus,
    AtSign,
    Phone,
    Volume2,
    Mail,
} from "lucide-react";

import { useState } from "react";

function SettingsNotifications() {
    const [settings, setSettings] = useState({
        push: true,
        messages: true,
        reactions: true,
        followers: true,
        mentions: true,
        calls: true,
        sound: true,
        email: false,
    });

    const toggleSetting = (key) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const notificationItems = [
        {
            key: "messages",
            icon: MessageCircle,
            title: "Messages",
            description: "Get notified when someone sends you a message",
        },
        {
            key: "reactions",
            icon: Heart,
            title: "Reactions",
            description: "Notify me when someone reacts to my messages",
        },
        {
            key: "followers",
            icon: UserPlus,
            title: "New Followers",
            description: "Get notified when someone follows you",
        },
        {
            key: "mentions",
            icon: AtSign,
            title: "Mentions",
            description: "Notify me when someone mentions me",
        },
        {
            key: "calls",
            icon: Phone,
            title: "Calls",
            description: "Show notifications for incoming calls",
        },
    ];

    return (
        <section className="settings-notifications">

            <div className="settings-notifications-heading">
                <div className="settings-notifications-heading-icon">
                    <Bell size={20} />
                </div>

                <div>
                    <h2>Notifications</h2>
                    <p>Control how and when DevChat notifies you</p>
                </div>
            </div>


            <div className="settings-notifications-card">

                <div className="settings-notifications-section-title">
                    <span>Notification Types</span>
                    <small>Choose which notifications you want to receive</small>
                </div>

                {notificationItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            className="settings-notification-row"
                            key={item.key}
                        >
                            <div className="settings-notification-icon">
                                <Icon size={18} />
                            </div>

                            <div className="settings-notification-content">
                                <strong>{item.title}</strong>
                                <span>{item.description}</span>
                            </div>

                            <button
                                type="button"
                                className={`settings-notification-switch ${
                                    settings[item.key] ? "active" : ""
                                }`}
                                onClick={() => toggleSetting(item.key)}
                                aria-label={`Toggle ${item.title}`}
                            >
                                <span />
                            </button>
                        </div>
                    );
                })}

            </div>


            <div className="settings-notifications-card">

                <div className="settings-notifications-section-title">
                    <span>Delivery</span>
                    <small>Choose how notifications reach you</small>
                </div>


                <div className="settings-notification-row">

                    <div className="settings-notification-icon">
                        <Bell size={18} />
                    </div>

                    <div className="settings-notification-content">
                        <strong>Push Notifications</strong>
                        <span>Receive notifications on your device</span>
                    </div>

                    <button
                        type="button"
                        className={`settings-notification-switch ${
                            settings.push ? "active" : ""
                        }`}
                        onClick={() => toggleSetting("push")}
                    >
                        <span />
                    </button>

                </div>


                <div className="settings-notification-row">

                    <div className="settings-notification-icon">
                        <Volume2 size={18} />
                    </div>

                    <div className="settings-notification-content">
                        <strong>Notification Sound</strong>
                        <span>Play a sound when a notification arrives</span>
                    </div>

                    <button
                        type="button"
                        className={`settings-notification-switch ${
                            settings.sound ? "active" : ""
                        }`}
                        onClick={() => toggleSetting("sound")}
                    >
                        <span />
                    </button>

                </div>


                <div className="settings-notification-row last">

                    <div className="settings-notification-icon">
                        <Mail size={18} />
                    </div>

                    <div className="settings-notification-content">
                        <strong>Email Notifications</strong>
                        <span>Receive important updates by email</span>
                    </div>

                    <button
                        type="button"
                        className={`settings-notification-switch ${
                            settings.email ? "active" : ""
                        }`}
                        onClick={() => toggleSetting("email")}
                    >
                        <span />
                    </button>

                </div>

            </div>

        </section>
    );
}

export default SettingsNotifications;