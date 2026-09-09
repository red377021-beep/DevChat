import "./ProfileAvatar.css";

import {
    Camera,
    CircleCheck,
} from "lucide-react";


function ProfileAvatar({
    src = "",
    name = "Your Name",
    online = true,
    verified = false,
    onEdit,
}) {

    const initial =
        name?.trim()?.charAt(0)?.toUpperCase() || "D";


    return (
        <div className="profile-avatar-wrapper">

            <div className="profile-avatar">

                {src ? (
                    <img
                        src={src}
                        alt={name}
                    />
                ) : (
                    <span className="profile-avatar-letter">
                        {initial}
                    </span>
                )}

            </div>


            {online && (
                <span className="profile-avatar-online" />
            )}


            {verified && (
                <span className="profile-avatar-verified">
                    <CircleCheck size={15} />
                </span>
            )}


            <button
                type="button"
                className="profile-avatar-edit"
                onClick={onEdit}
                aria-label="Change profile picture"
            >
                <Camera size={13} />
            </button>

        </div>
    );
}


export default ProfileAvatar;