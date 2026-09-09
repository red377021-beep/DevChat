import "./SettingsAccount.css";

import {
    UserRound,
    Mail,
    Lock,
    ShieldCheck,
    Smartphone,
    Globe,
    Trash2,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

import { useState } from "react";


function SettingsAccount() {

    const [emailVerified, setEmailVerified] = useState(false);

    const [connectedAccounts, setConnectedAccounts] = useState({
        google: false,
        github: false,
    });


    const toggleAccount = (account) => {

        setConnectedAccounts((prev) => ({
            ...prev,
            [account]: !prev[account],
        }));

    };


    return (
        <section className="settings-account">


            {/* =================================================
                ACCOUNT HEADER
            ================================================= */}

            <div className="settings-account-heading">

                <div className="settings-account-heading-icon">
                    <UserRound size={20} />
                </div>

                <div>
                    <h2>Account</h2>

                    <p>
                        Manage your account information and connected services
                    </p>
                </div>

            </div>


            {/* =================================================
                ACCOUNT INFORMATION
            ================================================= */}

            <div className="settings-account-card">

                <div className="settings-account-section-title">

                    <span>
                        Account Information
                    </span>

                    <small>
                        Basic information associated with your DevChat account
                    </small>

                </div>


                {/* EMAIL */}

                <div className="settings-account-row">

                    <div className="settings-account-icon">
                        <Mail size={18} />
                    </div>

                    <div className="settings-account-content">

                        <strong>
                            Email Address
                        </strong>

                        <span>
                            your@email.com
                        </span>

                    </div>


                    <button
                        type="button"
                        className={`settings-account-status ${
                            emailVerified ? "verified" : ""
                        }`}
                        onClick={() =>
                            setEmailVerified(!emailVerified)
                        }
                    >

                        <CheckCircle2 size={14} />

                        {emailVerified
                            ? "Verified"
                            : "Verify"}

                    </button>

                </div>


                {/* USERNAME */}

                <div className="settings-account-row">

                    <div className="settings-account-icon">
                        <UserRound size={18} />
                    </div>

                    <div className="settings-account-content">

                        <strong>
                            Username
                        </strong>

                        <span>
                            @username
                        </span>

                    </div>


                    <button
                        type="button"
                        className="settings-account-action"
                    >
                        Change
                    </button>

                </div>


                {/* PHONE */}

                <div className="settings-account-row">

                    <div className="settings-account-icon">
                        <Smartphone size={18} />
                    </div>

                    <div className="settings-account-content">

                        <strong>
                            Phone Number
                        </strong>

                        <span>
                            Not added
                        </span>

                    </div>


                    <button
                        type="button"
                        className="settings-account-action"
                    >
                        Add
                    </button>

                </div>

            </div>


            {/* =================================================
                PASSWORD & SECURITY
            ================================================= */}

            <div className="settings-account-card">

                <div className="settings-account-section-title">

                    <span>
                        Password & Security
                    </span>

                    <small>
                        Keep your account protected
                    </small>

                </div>


                {/* PASSWORD */}

                <div className="settings-account-row">

                    <div className="settings-account-icon">
                        <Lock size={18} />
                    </div>

                    <div className="settings-account-content">

                        <strong>
                            Password
                        </strong>

                        <span>
                            Last changed recently
                        </span>

                    </div>


                    <button
                        type="button"
                        className="settings-account-action"
                    >
                        Change
                    </button>

                </div>


                {/* TWO FACTOR */}

                <div className="settings-account-row">

                    <div className="settings-account-icon">
                        <ShieldCheck size={18} />
                    </div>

                    <div className="settings-account-content">

                        <strong>
                            Two-Factor Authentication
                        </strong>

                        <span>
                            Add another layer of account protection
                        </span>

                    </div>


                    <button
                        type="button"
                        className="settings-account-action"
                    >
                        Setup
                    </button>

                </div>

            </div>


            {/* =================================================
                CONNECTED ACCOUNTS
            ================================================= */}

            <div className="settings-account-card">

                <div className="settings-account-section-title">

                    <span>
                        Connected Accounts
                    </span>

                    <small>
                        Manage accounts connected to DevChat
                    </small>

                </div>


                {/* GOOGLE */}

                <div className="settings-account-row">

                    <div className="settings-account-icon">
                        <Globe size={18} />
                    </div>

                    <div className="settings-account-content">

                        <strong>
                            Google
                        </strong>

                        <span>
                            {connectedAccounts.google
                                ? "Connected to your account"
                                : "Connect your Google account"}
                        </span>

                    </div>


                    <button
                        type="button"
                        className={`settings-account-connect ${
                            connectedAccounts.google
                                ? "connected"
                                : ""
                        }`}
                        onClick={() =>
                            toggleAccount("google")
                        }
                    >

                        {connectedAccounts.google
                            ? "Connected"
                            : "Connect"}

                    </button>

                </div>


                {/* GITHUB */}

                <div className="settings-account-row">

                    <div className="settings-account-icon">
                        <Globe size={18} />
                    </div>

                    <div className="settings-account-content">

                        <strong>
                            GitHub
                        </strong>

                        <span>
                            {connectedAccounts.github
                                ? "Connected to your account"
                                : "Connect your GitHub account"}
                        </span>

                    </div>


                    <button
                        type="button"
                        className={`settings-account-connect ${
                            connectedAccounts.github
                                ? "connected"
                                : ""
                        }`}
                        onClick={() =>
                            toggleAccount("github")
                        }
                    >

                        {connectedAccounts.github
                            ? "Connected"
                            : "Connect"}

                    </button>

                </div>

            </div>


            {/* =================================================
                DANGER ZONE
            ================================================= */}

            <div className="settings-account-danger">

                <div className="settings-account-danger-header">

                    <div className="settings-account-danger-icon">
                        <AlertTriangle size={18} />
                    </div>

                    <div>

                        <strong>
                            Danger Zone
                        </strong>

                        <span>
                            These actions can permanently affect your account
                        </span>

                    </div>

                </div>


                <button
                    type="button"
                    className="settings-account-delete"
                >

                    <Trash2 size={16} />

                    Delete Account

                </button>

            </div>

        </section>
    );
}


export default SettingsAccount;