import "./GroupCard.css";

import {
    Users,
    Globe2,
    LockKeyhole,
    Circle,
    ArrowUpRight,
    ShieldCheck,
} from "lucide-react";


function GroupCard({
    group = {},
    onOpen,
}) {
    const {
        id = "",
        name = "Unnamed Group",
        description = "No description available.",
        avatar = "",
        members = 0,
        onlineMembers = 0,
        privacy = "public",
        category = "General",
    } = group;


    const normalizedPrivacy =
        String(privacy || "public").toLowerCase();

    const isPrivate =
        normalizedPrivacy === "private";


    const displayPrivacy =
        isPrivate ? "Private" : "Public";


    const safeMembers =
        Number.isFinite(Number(members))
            ? Math.max(0, Number(members))
            : 0;


    const safeOnlineMembers =
        Number.isFinite(Number(onlineMembers))
            ? Math.max(0, Number(onlineMembers))
            : 0;


    const formattedMembers =
        safeMembers.toLocaleString();


    const formattedOnlineMembers =
        safeOnlineMembers.toLocaleString();


    const handleOpen = () => {
        onOpen?.(group);
    };


    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            handleOpen();
        }
    };


    return (
        <article
            className="group-card"
            data-group-id={id}
        >

            {/* =====================================================
                COVER
            ===================================================== */}

            <div className="group-card__cover">

                <div
                    className="group-card__cover-gradient"
                    aria-hidden="true"
                />

                <div
                    className="group-card__glow"
                    aria-hidden="true"
                />


                {/* Decorative dots */}

                <div
                    className="group-card__decor"
                    aria-hidden="true"
                >
                    <span />
                    <span />
                    <span />
                </div>


                {/* =================================================
                    GROUP AVATAR
                ================================================= */}

                <div className="group-card__avatar">

                    {avatar ? (
                        <img
                            src={avatar}
                            alt={`${name} group`}
                            loading="lazy"
                        />
                    ) : (
                        <Users
                            size={31}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    )}

                </div>


                {/* =================================================
                    PRIVACY
                ================================================= */}

                <div
                    className={`group-card__privacy ${
                        isPrivate
                            ? "group-card__privacy--private"
                            : "group-card__privacy--public"
                    }`}
                >

                    {isPrivate ? (
                        <LockKeyhole
                            size={13}
                            strokeWidth={2}
                        />
                    ) : (
                        <Globe2
                            size={13}
                            strokeWidth={2}
                        />
                    )}

                    <span>
                        {displayPrivacy}
                    </span>

                </div>

            </div>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="group-card__content">

                {/* =================================================
                    TOP META
                ================================================= */}

                <div className="group-card__meta">

                    <span className="group-card__category">
                        {category || "General"}
                    </span>


                    {isPrivate && (
                        <span className="group-card__secure">
                            <ShieldCheck
                                size={12}
                                aria-hidden="true"
                            />

                            Private
                        </span>
                    )}

                </div>


                {/* =================================================
                    NAME
                ================================================= */}

                <h3 className="group-card__name">
                    {name}
                </h3>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p className="group-card__description">
                    {description ||
                        "No description available."}
                </p>


                {/* =================================================
                    STATS
                ================================================= */}

                <div className="group-card__stats">

                    <div
                        className="group-card__stat"
                        title={`${formattedMembers} members`}
                    >

                        <span className="group-card__stat-icon">
                            <Users
                                size={14}
                                strokeWidth={2}
                            />
                        </span>

                        <span>
                            {formattedMembers} members
                        </span>

                    </div>


                    <div
                        className="group-card__stat group-card__stat--online"
                        title={`${formattedOnlineMembers} members online`}
                    >

                        <span className="group-card__online-dot">
                            <Circle
                                size={7}
                                fill="currentColor"
                                strokeWidth={0}
                            />
                        </span>

                        <span>
                            {formattedOnlineMembers} online
                        </span>

                    </div>

                </div>


                {/* =================================================
                    OPEN BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="group-card__open"
                    onClick={handleOpen}
                    onKeyDown={handleKeyDown}
                    aria-label={`Open ${name}`}
                >

                    <span className="group-card__open-text">
                        Open Group
                    </span>


                    <span className="group-card__open-icon">
                        <ArrowUpRight
                            size={17}
                            strokeWidth={2.1}
                            aria-hidden="true"
                        />
                    </span>

                </button>

            </div>

        </article>
    );
}


export default GroupCard;