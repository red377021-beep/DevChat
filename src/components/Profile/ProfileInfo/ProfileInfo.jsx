import "./ProfileInfo.css";

import {
    AtSign,
    CalendarDays,
    MapPin,
    Link2,
} from "lucide-react";


function ProfileInfo({
    name = "Your Name",
    username = "username",
    bio = "Hey! I'm using DevChat.",
    location = "",
    website = "",
    joined = "September 2025",
}) {

    return (
        <div className="profile-info">

            <div className="profile-info-name-row">

                <h1>
                    {name}
                </h1>

            </div>


            <div className="profile-info-username">

                <AtSign size={14} />

                <span>
                    {username}
                </span>

            </div>


            <p className="profile-info-bio">
                {bio}
            </p>


            <div className="profile-info-meta">

                {location && (
                    <span>
                        <MapPin size={14} />
                        {location}
                    </span>
                )}


                {website && (
                    <span>
                        <Link2 size={14} />
                        {website}
                    </span>
                )}


                {joined && (
                    <span>
                        <CalendarDays size={14} />
                        Joined {joined}
                    </span>
                )}

            </div>

        </div>
    );
}


export default ProfileInfo;