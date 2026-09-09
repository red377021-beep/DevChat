import "./SettingsProfile.css";

import {
    Camera,
    Pencil,
    AtSign,
    User,
    FileText,
    CircleCheck,
} from "lucide-react";


function SettingsProfile({
    profile = {},
    onEdit,
}) {

    const {
        name = "Your Name",
        username = "username",
        bio = "Hey! I'm using DevChat.",
        avatar = "",
        status = "Available",
    } = profile;


    return (
        <section className="settings-profile">

            {/* =================================================
                PROFILE HERO
            ================================================= */}

            <div className="settings-profile__hero">

                <div className="settings-profile__avatar-wrapper">

                    <div className="settings-profile__avatar">

                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name}
                            />
                        ) : (
                            <span>
                                {name.charAt(0).toUpperCase()}
                            </span>
                        )}

                    </div>


                    <button
                        type="button"
                        className="settings-profile__camera"
                        aria-label="Change profile picture"
                    >
                        <Camera size={15} />
                    </button>

                </div>


                <div className="settings-profile__identity">

                    <div className="settings-profile__name-row">

                        <h2>
                            {name}
                        </h2>

                        <CircleCheck
                            size={16}
                            className="settings-profile__verified"
                        />

                    </div>


                    <span className="settings-profile__username">
                        @{username}
                    </span>


                    <div className="settings-profile__status">

                        <span className="settings-profile__status-dot" />

                        {status}

                    </div>

                </div>


                <button
                    type="button"
                    className="settings-profile__edit"
                    onClick={onEdit}
                >
                    <Pencil size={14} />

                    <span>
                        Edit Profile
                    </span>
                </button>

            </div>


            {/* =================================================
                PROFILE DETAILS
            ================================================= */}

            <div className="settings-profile__details">

                <div className="settings-profile__detail">

                    <div className="settings-profile__detail-icon">
                        <User size={16} />
                    </div>

                    <div className="settings-profile__detail-content">

                        <span className="settings-profile__label">
                            Display Name
                        </span>

                        <strong>
                            {name}
                        </strong>

                    </div>

                </div>


                <div className="settings-profile__detail">

                    <div className="settings-profile__detail-icon">
                        <AtSign size={16} />
                    </div>

                    <div className="settings-profile__detail-content">

                        <span className="settings-profile__label">
                            Username
                        </span>

                        <strong>
                            @{username}
                        </strong>

                    </div>

                </div>


                <div className="settings-profile__detail">

                    <div className="settings-profile__detail-icon">
                        <FileText size={16} />
                    </div>

                    <div className="settings-profile__detail-content">

                        <span className="settings-profile__label">
                            Bio
                        </span>

                        <strong>
                            {bio}
                        </strong>

                    </div>

                </div>

            </div>

        </section>
    );
}


export default SettingsProfile;