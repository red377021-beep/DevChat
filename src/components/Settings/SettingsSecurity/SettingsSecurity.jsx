import "./SettingsSecurity.css";

import {
    ShieldCheck,
    Lock,
    KeyRound,
    Smartphone,
    Monitor,
    LogOut,
    Fingerprint,
    ChevronRight,
} from "lucide-react";

import { useState } from "react";

function SettingsSecurity() {
    const [twoFactor, setTwoFactor] = useState(false);
    const [loginAlerts, setLoginAlerts] = useState(true);

    const securityItems = [
        {
            icon: KeyRound,
            title: "Password",
            description: "Change your DevChat account password",
            action: "Change",
        },
        {
            icon: Smartphone,
            title: "Two-Factor Authentication",
            description: "Add an extra layer of protection",
            toggle: true,
            value: twoFactor,
            onToggle: () => setTwoFactor(!twoFactor),
        },
        {
            icon: Fingerprint,
            title: "Biometric Lock",
            description: "Use device biometrics to unlock DevChat",
            action: "Setup",
        },
        {
            icon: Monitor,
            title: "Login Alerts",
            description: "Get notified about new account logins",
            toggle: true,
            value: loginAlerts,
            onToggle: () => setLoginAlerts(!loginAlerts),
        },
    ];

    return (
        <section className="settings-security">

            <div className="settings-security-heading">
                <div className="settings-security-heading-icon">
                    <ShieldCheck size={20} />
                </div>

                <div>
                    <h2>Security</h2>
                    <p>Protect your account and manage active sessions</p>
                </div>
            </div>


            <div className="settings-security-status">

                <div className="settings-security-status-icon">
                    <ShieldCheck size={22} />
                </div>

                <div className="settings-security-status-content">
                    <strong>Your account is protected</strong>
                    <span>
                        Keep your security settings up to date for better protection.
                    </span>
                </div>

                <div className="settings-security-status-badge">
                    Secure
                </div>

            </div>


            <div className="settings-security-card">

                <div className="settings-security-section-title">
                    <span>Security Controls</span>
                    <small>Manage your account protection</small>
                </div>

                {securityItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            className="settings-security-row"
                            key={item.title}
                        >
                            <div className="settings-security-icon">
                                <Icon size={18} />
                            </div>

                            <div className="settings-security-content">
                                <strong>{item.title}</strong>
                                <span>{item.description}</span>
                            </div>

                            {item.toggle ? (
                                <button
                                    type="button"
                                    className={`settings-security-switch ${
                                        item.value ? "active" : ""
                                    }`}
                                    onClick={item.onToggle}
                                    aria-label={`Toggle ${item.title}`}
                                >
                                    <span />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="settings-security-action"
                                >
                                    <span>{item.action}</span>
                                    <ChevronRight size={15} />
                                </button>
                            )}
                        </div>
                    );
                })}

            </div>


            <div className="settings-security-card">

                <div className="settings-security-section-title">
                    <span>Active Sessions</span>
                    <small>Devices currently signed into your account</small>
                </div>


                <div className="settings-session">

                    <div className="settings-session-icon">
                        <Monitor size={19} />
                    </div>

                    <div className="settings-session-content">
                        <strong>Windows PC</strong>
                        <span>Chrome · Current session</span>
                        <small>Active now</small>
                    </div>

                    <div className="settings-session-current">
                        Current
                    </div>

                </div>


                <div className="settings-session">

                    <div className="settings-session-icon">
                        <Smartphone size={19} />
                    </div>

                    <div className="settings-session-content">
                        <strong>Mobile Device</strong>
                        <span>DevChat Mobile</span>
                        <small>Recently active</small>
                    </div>

                    <button
                        type="button"
                        className="settings-session-logout"
                    >
                        <LogOut size={15} />
                        <span>Log out</span>
                    </button>

                </div>

            </div>


            <div className="settings-security-tip">

                <div className="settings-security-tip-icon">
                    <Lock size={17} />
                </div>

                <div>
                    <strong>Security tip</strong>
                    <p>
                        Never share your password or verification codes with anyone.
                        DevChat will never ask you for them.
                    </p>
                </div>

            </div>

        </section>
    );
}

export default SettingsSecurity;