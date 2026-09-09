// src/components/MessageContact/MessageContact.jsx

import "./MessageContact.css";

import {
    UserRound,
    Phone
} from "lucide-react";


function MessageContact({
    contact,
    own = false
}) {

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (!contact) {
        return null;
    }


    // =====================================================
    // CONTACT DATA
    // =====================================================

    const name =
        contact.name ||
        contact.fullName ||
        "Unknown";

    const username =
        contact.username ||
        contact.userName ||
        "";

    const phone =
        contact.phone ||
        contact.phoneNumber ||
        "";


    // =====================================================
    // AVATAR
    // =====================================================

    const avatar =
        contact.avatar ||
        contact.photo ||
        contact.image ||
        null;


    // =====================================================
    // CALL CONTACT
    // =====================================================

    function handleCall(event) {

        event?.stopPropagation();

        if (!phone) {
            return;
        }

        window.location.href =
            `tel:${phone}`;

    }


    // =====================================================
    // AVATAR RENDER
    // =====================================================

    function renderAvatar() {

        if (
            typeof avatar === "string" &&
            avatar.trim()
        ) {

            return (
                <img
                    src={avatar}
                    alt={name}
                    className="message-contact-avatar-image"
                    onError={(event) => {

                        event.currentTarget.style.display =
                            "none";

                        if (
                            event.currentTarget
                                .nextElementSibling
                        ) {

                            event.currentTarget
                                .nextElementSibling
                                .style.display = "flex";

                        }

                    }}
                />
            );

        }


        return (
            <UserRound size={24} />
        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className={[
                "message-contact",
                own ? "own" : ""
            ]
                .filter(Boolean)
                .join(" ")}

            onClick={(event) => {

                event.stopPropagation();

            }}

        >

            {/* =================================================
                AVATAR
            ================================================= */}

            <div className="message-contact-avatar">

                {renderAvatar()}

                {avatar && (

                    <div
                        className="message-contact-avatar-fallback"
                        style={{
                            display: "none"
                        }}
                    >

                        <UserRound size={24} />

                    </div>

                )}

            </div>


            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <div className="message-contact-info">

                <strong>
                    {name}
                </strong>


                {username && (

                    <span>
                        {username}
                    </span>

                )}


                {phone && (

                    <span className="message-contact-phone">
                        {phone}
                    </span>

                )}

            </div>


            {/* =================================================
                CALL BUTTON
            ================================================= */}

            {phone && (

                <button

                    type="button"

                    className="message-contact-call"

                    onClick={handleCall}

                    title="Call contact"

                    aria-label={
                        `Call ${name}`
                    }

                >

                    <Phone
                        size={18}
                    />

                </button>

            )}

        </div>

    );

}


export default MessageContact;