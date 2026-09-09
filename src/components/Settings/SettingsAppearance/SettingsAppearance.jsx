import "./SettingsAppearance.css";

import {
    Palette,
    Moon,
    Sun,
    Monitor,
    Sparkles,
    Zap,
} from "lucide-react";

import { useState } from "react";


function SettingsAppearance() {

    const [theme, setTheme] = useState("dark");
    const [compactMode, setCompactMode] = useState(false);
    const [animations, setAnimations] = useState(true);


    const themes = [
        {
            id: "dark",
            label: "Dark",
            description: "Easy on the eyes",
            icon: Moon,
        },
        {
            id: "light",
            label: "Light",
            description: "Clean and bright",
            icon: Sun,
        },
        {
            id: "system",
            label: "System",
            description: "Follow your device",
            icon: Monitor,
        },
    ];


    return (
        <section className="settings-appearance">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="settings-appearance-heading">

                <div className="settings-appearance-heading-icon">
                    <Palette size={20} />
                </div>

                <div>
                    <h2>Appearance</h2>

                    <p>
                        Customize how DevChat looks and feels
                    </p>
                </div>

            </div>


            {/* =================================================
                THEME
            ================================================= */}

            <div className="settings-appearance-card">

                <div className="settings-appearance-section-title">
                    <span>Theme</span>

                    <small>
                        Choose your preferred interface theme
                    </small>
                </div>


                <div className="settings-appearance-themes">

                    {themes.map((item) => {

                        const Icon = item.icon;

                        const active =
                            theme === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`settings-appearance-theme ${
                                    active ? "active" : ""
                                }`}
                                onClick={() =>
                                    setTheme(item.id)
                                }
                            >

                                <div className="settings-appearance-theme-icon">
                                    <Icon size={20} />
                                </div>


                                <div className="settings-appearance-theme-content">

                                    <strong>
                                        {item.label}
                                    </strong>

                                    <span>
                                        {item.description}
                                    </span>

                                </div>


                                <div
                                    className={`settings-appearance-radio ${
                                        active ? "active" : ""
                                    }`}
                                >
                                    {active && (
                                        <span />
                                    )}
                                </div>

                            </button>
                        );

                    })}

                </div>

            </div>


            {/* =================================================
                INTERFACE
            ================================================= */}

            <div className="settings-appearance-card">

                <div className="settings-appearance-section-title">
                    <span>Interface</span>

                    <small>
                        Adjust the way DevChat behaves
                    </small>
                </div>


                {/* COMPACT MODE */}

                <div className="settings-appearance-row">

                    <div className="settings-appearance-row-icon">
                        <Zap size={18} />
                    </div>


                    <div className="settings-appearance-row-content">

                        <strong>
                            Compact Mode
                        </strong>

                        <span>
                            Fit more messages and content on screen
                        </span>

                    </div>


                    <button
                        type="button"
                        className={`settings-appearance-toggle ${
                            compactMode ? "active" : ""
                        }`}
                        onClick={() =>
                            setCompactMode(!compactMode)
                        }
                        aria-label="Toggle compact mode"
                    >
                        <span />
                    </button>

                </div>


                {/* ANIMATIONS */}

                <div className="settings-appearance-row">

                    <div className="settings-appearance-row-icon">
                        <Sparkles size={18} />
                    </div>


                    <div className="settings-appearance-row-content">

                        <strong>
                            Animations
                        </strong>

                        <span>
                            Enable smooth transitions and interface effects
                        </span>

                    </div>


                    <button
                        type="button"
                        className={`settings-appearance-toggle ${
                            animations ? "active" : ""
                        }`}
                        onClick={() =>
                            setAnimations(!animations)
                        }
                        aria-label="Toggle animations"
                    >
                        <span />
                    </button>

                </div>

            </div>


            {/* =================================================
                LIVE PREVIEW
            ================================================= */}

            <div className="settings-appearance-card">

                <div className="settings-appearance-section-title">

                    <span>
                        Preview
                    </span>

                    <small>
                        See how your selected appearance looks
                    </small>

                </div>


                <div className="settings-appearance-preview">

                    <div className="settings-preview-sidebar">

                        <div className="settings-preview-logo">
                            D
                        </div>

                        <div className="settings-preview-line active" />
                        <div className="settings-preview-line" />
                        <div className="settings-preview-line" />
                        <div className="settings-preview-line short" />

                    </div>


                    <div className="settings-preview-chat">

                        <div className="settings-preview-chat-header">
                            <div className="settings-preview-avatar">
                                K
                            </div>

                            <div>
                                <strong>
                                    DevChat
                                </strong>

                                <span>
                                    Online
                                </span>
                            </div>
                        </div>


                        <div className="settings-preview-messages">

                            <div className="settings-preview-message">
                                Hey! 👋
                            </div>

                            <div className="settings-preview-message own">
                                Welcome to DevChat.
                            </div>

                            <div className="settings-preview-message">
                                Looks great!
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default SettingsAppearance;