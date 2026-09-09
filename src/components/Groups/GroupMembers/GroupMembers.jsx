import "./GroupMembers.css";

import {
    Search,
    Users,
    Circle,
    ShieldCheck,
    MoreVertical,
    X,
} from "lucide-react";

import { useMemo, useState } from "react";


function GroupMembers({
    members = [],
    currentUserId = "",
    onMemberClick,
    onMemberMore,
}) {
    const [search, setSearch] = useState("");


    const safeMembers = Array.isArray(members)
        ? members
        : [];


    const filteredMembers = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();


        if (!query) {
            return safeMembers;
        }


        return safeMembers.filter((member) => {
            const name = String(
                member?.name || ""
            ).toLowerCase();


            const username = String(
                member?.username || ""
            ).toLowerCase();


            return (
                name.includes(query) ||
                username.includes(query)
            );
        });
    }, [safeMembers, search]);


    const handleClearSearch = () => {
        setSearch("");
    };


    const getInitial = (name) => {
        return String(name || "U")
            .trim()
            .charAt(0)
            .toUpperCase();
    };


    return (
        <section
            className="group-members"
            aria-label="Group members"
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="group-members__header">

                <div className="group-members__heading">

                    <div className="group-members__title-icon">
                        <Users
                            size={17}
                            strokeWidth={2}
                        />
                    </div>


                    <div className="group-members__heading-text">

                        <div className="group-members__title-row">

                            <h3>
                                Members
                            </h3>

                            <span className="group-members__count">
                                {safeMembers.length}
                            </span>

                        </div>


                        <span>
                            {safeMembers.length === 1
                                ? "1 member"
                                : `${safeMembers.length} members`}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <div
                    className="group-members__search"
                    data-has-value={
                        Boolean(search)
                    }
                >

                    <Search
                        size={15}
                        strokeWidth={2}
                        aria-hidden="true"
                    />


                    <input
                        type="text"
                        placeholder="Search members..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        aria-label="Search members"
                    />


                    {search && (
                        <button
                            type="button"
                            className="group-members__search-clear"
                            onClick={
                                handleClearSearch
                            }
                            aria-label="Clear member search"
                            title="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}

                </div>

            </div>


            {/* =====================================================
                SEARCH RESULT INFO
            ===================================================== */}

            {search.trim() && (
                <div className="group-members__result-info">
                    <span>
                        {filteredMembers.length}
                        {" "}
                        {filteredMembers.length === 1
                            ? "member"
                            : "members"}
                        {" "}
                        found
                    </span>
                </div>
            )}


            {/* =====================================================
                MEMBERS LIST
            ===================================================== */}

            <div className="group-members__list">

                {filteredMembers.length > 0 ? (

                    filteredMembers.map(
                        (member, index) => {

                            const isCurrentUser =
                                member?.id ===
                                currentUserId;


                            const role =
                                String(
                                    member?.role || ""
                                ).toLowerCase();


                            const isAdmin =
                                role === "admin" ||
                                member?.isAdmin === true;


                            const status =
                                String(
                                    member?.status || ""
                                ).toLowerCase();


                            const isOnline =
                                member?.online === true ||
                                status === "online";


                            const memberKey =
                                member?.id ||
                                member?.username ||
                                `member-${index}`;


                            const displayName =
                                member?.name ||
                                "Unknown User";


                            const username =
                                member?.username
                                    ? `@${String(
                                          member.username
                                      ).replace(
                                          /^@/,
                                          ""
                                      )}`
                                    : "No username";


                            return (
                                <div
                                    className="group-member"
                                    key={memberKey}
                                >

                                    {/* =================================================
                                        PROFILE / AVATAR
                                    ================================================= */}

                                    <button
                                        type="button"
                                        className="group-member__profile"
                                        onClick={() =>
                                            onMemberClick?.(
                                                member
                                            )
                                        }
                                        aria-label={`View ${displayName} profile`}
                                    >

                                        <div className="group-member__avatar">

                                            {member?.avatar ? (
                                                <img
                                                    src={
                                                        member.avatar
                                                    }
                                                    alt={
                                                        displayName
                                                    }
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span>
                                                    {getInitial(
                                                        displayName
                                                    )}
                                                </span>
                                            )}


                                            <span
                                                className={`group-member__status ${
                                                    isOnline
                                                        ? "group-member__status--online"
                                                        : "group-member__status--offline"
                                                }`}
                                                aria-label={
                                                    isOnline
                                                        ? "Online"
                                                        : "Offline"
                                                }
                                            />

                                        </div>

                                    </button>


                                    {/* =================================================
                                        MEMBER INFO
                                    ================================================= */}

                                    <button
                                        type="button"
                                        className="group-member__info"
                                        onClick={() =>
                                            onMemberClick?.(
                                                member
                                            )
                                        }
                                        aria-label={`Open ${displayName}`}
                                    >

                                        <div className="group-member__name-row">

                                            <span className="group-member__name">
                                                {displayName}
                                            </span>


                                            {isCurrentUser && (
                                                <span className="group-member__you">
                                                    You
                                                </span>
                                            )}


                                            {isAdmin && (
                                                <span className="group-member__admin">

                                                    <ShieldCheck
                                                        size={11}
                                                        strokeWidth={2.2}
                                                    />

                                                    <span>
                                                        Admin
                                                    </span>

                                                </span>
                                            )}

                                        </div>


                                        <span className="group-member__username">
                                            {username}
                                        </span>

                                    </button>


                                    {/* =================================================
                                        PRESENCE
                                    ================================================= */}

                                    <div
                                        className={`group-member__presence ${
                                            isOnline
                                                ? "group-member__presence--online"
                                                : ""
                                        }`}
                                    >

                                        <Circle
                                            size={7}
                                            fill="currentColor"
                                            strokeWidth={0}
                                        />

                                        <span>
                                            {isOnline
                                                ? "Online"
                                                : "Offline"}
                                        </span>

                                    </div>


                                    {/* =================================================
                                        MORE
                                    ================================================= */}

                                    <button
                                        type="button"
                                        className="group-member__more"
                                        onClick={() =>
                                            onMemberMore?.(
                                                member
                                            )
                                        }
                                        aria-label={`More options for ${displayName}`}
                                        title="More options"
                                    >
                                        <MoreVertical
                                            size={18}
                                            strokeWidth={2}
                                        />
                                    </button>

                                </div>
                            );
                        }
                    )

                ) : (

                    /* =================================================
                       EMPTY
                    ================================================= */

                    <div className="group-members__empty">

                        <div className="group-members__empty-icon">
                            <Users
                                size={25}
                                strokeWidth={1.7}
                            />
                        </div>


                        <h4>
                            No members found
                        </h4>


                        <p>
                            {search.trim()
                                ? "Try searching with a different name or username."
                                : "This group doesn't have any members yet."}
                        </p>


                        {search.trim() && (
                            <button
                                type="button"
                                onClick={
                                    handleClearSearch
                                }
                            >
                                Clear Search
                            </button>
                        )}

                    </div>

                )}

            </div>

        </section>
    );
}


export default GroupMembers;