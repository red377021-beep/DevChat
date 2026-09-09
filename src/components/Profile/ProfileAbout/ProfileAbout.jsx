import "./ProfileAbout.css";

import {
    UserRound,
    AtSign,
    MapPin,
    Link2,
    CalendarDays,
    Mail,
    ShieldCheck,
} from "lucide-react";


function ProfileAbout({
    name = "Your Name",
    username = "username",
    bio = "Hey! I'm using DevChat.",
    location = "Pakistan",
    website = "",
    email = "",
    joined = "September 2025",
    verified = false,
}) {

    return (
        <section className="profile-about">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="profile-about-header">

                <div className="profile-about-title-icon">
                    <UserRound size={19} />
                </div>

                <div>
                    <h2>About</h2>

                    <p>
                        Profile information
                    </p>
                </div>

            </div>


            {/* =====================================================
                BIO
            ===================================================== */}

            <div className="profile-about-bio">

                <span className="profile-about-label">
                    Bio
                </span>

                <p>
                    {bio}
                </p>

            </div>


            {/* =====================================================
                INFORMATION
            ===================================================== */}

            <div className="profile-about-list">

                <div className="profile-about-item">

                    <div className="profile-about-item-icon">
                        <UserRound size={17} />
                    </div>

                    <div className="profile-about-item-content">

                        <span>
                            Name
                        </span>

                        <strong>
                            {name}
                        </strong>

                    </div>

                </div>


                <div className="profile-about-item">

                    <div className="profile-about-item-icon">
                        <AtSign size={17} />
                    </div>

                    <div className="profile-about-item-content">

                        <span>
                            Username
                        </span>

                        <strong>
                            @{username}
                        </strong>

                    </div>

                </div>


                {location && (
                    <div className="profile-about-item">

                        <div className="profile-about-item-icon">
                            <MapPin size={17} />
                        </div>

                        <div className="profile-about-item-content">

                            <span>
                                Location
                            </span>

                            <strong>
                                {location}
                            </strong>

                        </div>

                    </div>
                )}


                {website && (
                    <div className="profile-about-item">

                        <div className="profile-about-item-icon">
                            <Link2 size={17} />
                        </div>

                        <div className="profile-about-item-content">

                            <span>
                                Website
                            </span>

                            <strong>
                                {website}
                            </strong>

                        </div>

                    </div>
                )}


                {email && (
                    <div className="profile-about-item">

                        <div className="profile-about-item-icon">
                            <Mail size={17} />
                        </div>

                        <div className="profile-about-item-content">

                            <span>
                                Email
                            </span>

                            <strong>
                                {email}
                            </strong>

                        </div>

                    </div>
                )}


                <div className="profile-about-item">

                    <div className="profile-about-item-icon">
                        <CalendarDays size={17} />
                    </div>

                    <div className="profile-about-item-content">

                        <span>
                            Joined
                        </span>

                        <strong>
                            {joined}
                        </strong>

                    </div>

                </div>


                {verified && (
                    <div className="profile-about-item">

                        <div className="profile-about-item-icon verified">
                            <ShieldCheck size={17} />
                        </div>

                        <div className="profile-about-item-content">

                            <span>
                                Account Status
                            </span>

                            <strong className="verified-text">
                                Verified Account
                            </strong>

                        </div>

                    </div>
                )}

            </div>

        </section>
    );
}


export default ProfileAbout;