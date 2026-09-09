import "./Settings.css";

import SettingsHeader from "../../components/Settings/SettingsHeader/SettingsHeader";
import SettingsProfile from "../../components/Settings/SettingsProfile/SettingsProfile";
import SettingsAccount from "../../components/Settings/SettingsAccount/SettingsAccount";
import SettingsPrivacy from "../../components/Settings/SettingsPrivacy/SettingsPrivacy";
import SettingsAppearance from "../../components/Settings/SettingsAppearance/SettingsAppearance";
import SettingsNotifications from "../../components/Settings/SettingsNotifications/SettingsNotifications";
import SettingsSecurity from "../../components/Settings/SettingsSecurity/SettingsSecurity";

import {
    User,
    Shield,
    Lock,
    Palette,
    Bell,
} from "lucide-react";

import { useState } from "react";

function Settings() {
    const [activeSection, setActiveSection] = useState("profile");

    const sections = [
        {
            id: "profile",
            label: "Profile",
            icon: User,
        },
        {
            id: "account",
            label: "Account",
            icon: Shield,
        },
        {
            id: "privacy",
            label: "Privacy",
            icon: Lock,
        },
        {
            id: "appearance",
            label: "Appearance",
            icon: Palette,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
        },
        {
            id: "security",
            label: "Security",
            icon: Shield,
        },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case "profile":
                return (
                    <SettingsProfile
                        profile={{
                            name: "Your Name",
                            username: "username",
                            bio: "Hey! I'm using DevChat.",
                            avatar: "",
                            status: "Available",
                        }}
                        onEdit={() => {}}
                    />
                );

            case "account":
                return <SettingsAccount />;

            case "privacy":
                return <SettingsPrivacy />;

            case "appearance":
                return <SettingsAppearance />;

            case "notifications":
                return <SettingsNotifications />;

            case "security":
                return <SettingsSecurity />;

            default:
                return <SettingsProfile />;
        }
    };

    return (
        <main className="settings-page">

            <SettingsHeader
                title="Settings"
                subtitle="Manage your DevChat experience"
            />


            <div className="settings-layout">

                <aside className="settings-navigation">

                    <div className="settings-navigation-title">
                        SETTINGS
                    </div>

                    <div className="settings-navigation-list">

                        {sections.map((section) => {
                            const Icon = section.icon;
                            const active = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    className={`settings-navigation-item ${
                                        active ? "active" : ""
                                    }`}
                                    onClick={() =>
                                        setActiveSection(section.id)
                                    }
                                >
                                    <span className="settings-navigation-icon">
                                        <Icon size={17} />
                                    </span>

                                    <span className="settings-navigation-label">
                                        {section.label}
                                    </span>
                                </button>
                            );
                        })}

                    </div>

                </aside>


                <div className="settings-content">
                    {renderSection()}
                </div>

            </div>

        </main>
    );
}

export default Settings;