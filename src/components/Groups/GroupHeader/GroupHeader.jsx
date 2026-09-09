import "./GroupHeader.css";

import {
    ArrowLeft,
    Search,
    MoreVertical,
    Users,
    Globe2,
    LockKeyhole,
    Circle,
} from "lucide-react";


function GroupHeader({
    group = {},
    onBack,
    onSearch,
    onMore,
}) {
    const {
        name = "Unnamed Group",
        description = "",
        avatar = "",
        members = 0,
        onlineMembers = 0,
        privacy = "public",
    } = group;


    const safeName =
        String(name || "Unnamed Group").trim();

    const safeDescription =
        String(description || "").trim();

    const safePrivacy =
        String(privacy || "public").toLowerCase();

    const isPrivate =
        safePrivacy === "private";

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


    const handleBack = () => {
        onBack?.();
    };


    const handleSearch = () => {
        onSearch?.();
    };


    const handleMore = () => {
        onMore?.();
    };


    return (
        <header className="group-header">

            {/* =====================================================
                LEFT SECTION
            ===================================================== */}

            <div className="group-header__left">

                <button
                    type="button"
                    className="group-header__back"
                    onClick={handleBack}
                    aria-label="Go back"
                    title="Back"
                >
                    <ArrowLeft
                        size={20}
                        strokeWidth={2}
                    />
                </button>


                {/* =================================================
                    GROUP AVATAR
                ================================================= */}

                <div className="group-header__avatar">

                    {avatar ? (
                        <img
                            src={avatar}
                            alt={`${safeName} group`}
                            loading="lazy"
                        />
                    ) : (
                        <Users
                            size={22}
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    )}

                </div>


                {/* =================================================
                    GROUP INFO
                ================================================= */}

                <div className="group-header__info">

                    <div className="group-header__title-row">

                        <h2 className="group-header__name">
                            {safeName}
                        </h2>


                        <span
                            className={`group-header__privacy ${
                                isPrivate
                                    ? "group-header__privacy--private"
                                    : "group-header__privacy--public"
                            }`}
                        >

                            {isPrivate ? (
                                <LockKeyhole
                                    size={11}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            ) : (
                                <Globe2
                                    size={11}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            )}

                            <span>
                                {displayPrivacy}
                            </span>

                        </span>

                    </div>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    {safeDescription && (
                        <p className="group-header__description">
                            {safeDescription}
                        </p>
                    )}


                    {/* =================================================
                        MEMBERS
                    ================================================= */}

                    <div className="group-header__members">

                        <span
                            className="group-header__member-item"
                            title={`${formattedMembers} members`}
                        >
                            <Users
                                size={13}
                                strokeWidth={2}
                                aria-hidden="true"
                            />

                            <span>
                                {formattedMembers} members
                            </span>
                        </span>


                        <span
                            className="group-header__separator"
                            aria-hidden="true"
                        >
                            •
                        </span>


                        <span
                            className="group-header__member-item group-header__member-item--online"
                            title={`${formattedOnlineMembers} members online`}
                        >
                            <span className="group-header__online-dot">
                                <Circle
                                    size={7}
                                    fill="currentColor"
                                    strokeWidth={0}
                                    aria-hidden="true"
                                />
                            </span>

                            <span>
                                {formattedOnlineMembers} online
                            </span>
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                RIGHT ACTIONS
            ===================================================== */}

            <div className="group-header__actions">

                <button
                    type="button"
                    className="group-header__action"
                    onClick={handleSearch}
                    aria-label="Search group"
                    title="Search"
                >
                    <Search
                        size={19}
                        strokeWidth={2}
                    />
                </button>


                <button
                    type="button"
                    className="group-header__action"
                    onClick={handleMore}
                    aria-label="More group options"
                    title="More options"
                >
                    <MoreVertical
                        size={20}
                        strokeWidth={2}
                    />
                </button>

            </div>

        </header>
    );
}


export default GroupHeader;