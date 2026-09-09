import "./ProfileCover.css";

import {
    Camera,
} from "lucide-react";


function ProfileCover({
    coverImage = "",
    onEdit,
}) {

    return (
        <div className="profile-cover">

            {coverImage ? (
                <img
                    src={coverImage}
                    alt="Profile cover"
                    className="profile-cover-image"
                />
            ) : (
                <div className="profile-cover-placeholder">

                    <div className="profile-cover-glow glow-one" />
                    <div className="profile-cover-glow glow-two" />

                    <div className="profile-cover-pattern">
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>

                </div>
            )}


            <div className="profile-cover-overlay" />


            <button
                type="button"
                className="profile-cover-edit"
                onClick={onEdit}
                aria-label="Edit cover photo"
            >
                <Camera size={16} />
                <span>Edit Cover</span>
            </button>

        </div>
    );
}


export default ProfileCover;