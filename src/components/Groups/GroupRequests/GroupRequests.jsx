import "./GroupRequests.css";

import {
    Search,
    UserPlus,
    Check,
    X,
    MoreVertical,
    Clock3,
    ShieldCheck,
} from "lucide-react";

import { useMemo, useState } from "react";


function GroupRequests({
    requests = [],
    onApprove,
    onReject,
    onViewProfile,
}) {

    const [searchQuery, setSearchQuery] = useState("");


    const demoRequests = [
        {
            id: "request-1",
            name: "Michael Johnson",
            username: "@michael",
            avatar: "",
            message: "I would like to join this group.",
            requestedAt: "10 minutes ago",
            mutualGroups: 2,
            isVerified: true,
        },
        {
            id: "request-2",
            name: "Emma Wilson",
            username: "@emmawilson",
            avatar: "",
            message: "Hey! I found this group through my friends.",
            requestedAt: "1 hour ago",
            mutualGroups: 4,
            isVerified: false,
        },
        {
            id: "request-3",
            name: "Ryan Smith",
            username: "@ryansmith",
            avatar: "",
            message: "Would love to be part of the community.",
            requestedAt: "Yesterday",
            mutualGroups: 1,
            isVerified: false,
        },
    ];


    const safeRequests = Array.isArray(requests)
        ? requests
        : [];


    const sourceRequests =
        safeRequests.length > 0
            ? safeRequests
            : demoRequests;


    // =====================================================
    // FILTER REQUESTS
    // =====================================================

    const filteredRequests = useMemo(() => {

        const query = searchQuery
            .trim()
            .toLowerCase();


        if (!query) {
            return sourceRequests;
        }


        return sourceRequests.filter((request) => {

            const name = String(
                request?.name || ""
            ).toLowerCase();

            const username = String(
                request?.username || ""
            ).toLowerCase();

            const message = String(
                request?.message || ""
            ).toLowerCase();


            return (
                name.includes(query) ||
                username.includes(query) ||
                message.includes(query)
            );

        });

    }, [sourceRequests, searchQuery]);


    // =====================================================
    // INITIALS
    // =====================================================

    const getInitials = (name = "") => {

        return (
            String(name)
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((word) => word.charAt(0))
                .join("")
                .toUpperCase() || "U"
        );

    };


    // =====================================================
    // HANDLERS
    // =====================================================

    const handleApprove = (request) => {

        onApprove?.(request);

    };


    const handleReject = (request) => {

        onReject?.(request);

    };


    const handleProfile = (request) => {

        onViewProfile?.(request);

    };


    const handleMore = (request) => {

        console.log(
            "Request options:",
            request
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <section
            className="group-requests"
            aria-label="Group join requests"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="group-requests__header">

                <div className="group-requests__heading">

                    <div className="group-requests__title-row">

                        <h2>
                            Join Requests
                        </h2>

                        <span
                            className="group-requests__count"
                            aria-label={`${filteredRequests.length} pending requests`}
                        >
                            {filteredRequests.length}
                        </span>

                    </div>

                    <p>
                        Manage people who want to join your group.
                    </p>

                </div>


                <div className="group-requests__status">

                    <Clock3 size={15} />

                    <span>
                        Pending
                    </span>

                </div>

            </header>


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="group-requests__search">

                <Search
                    size={17}
                    aria-hidden="true"
                />

                <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                        setSearchQuery(event.target.value)
                    }
                    placeholder="Search requests..."
                    aria-label="Search join requests"
                />

                {searchQuery && (
                    <button
                        type="button"
                        className="group-requests__clear"
                        onClick={() =>
                            setSearchQuery("")
                        }
                        aria-label="Clear search"
                        title="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}

            </div>


            {/* =================================================
                REQUEST LIST
            ================================================= */}

            {filteredRequests.length > 0 ? (

                <div className="group-requests__list">

                    {filteredRequests.map((request, index) => {

                        const requestId =
                            request?.id ||
                            `request-${index}`;

                        const name =
                            request?.name ||
                            "Unknown User";

                        const username =
                            request?.username ||
                            "@user";

                        const message =
                            request?.message ||
                            "Requested to join this group.";

                        const requestedAt =
                            request?.requestedAt ||
                            "Recently";

                        const mutualGroups =
                            Number(request?.mutualGroups) || 0;


                        return (
                            <article
                                key={requestId}
                                className="group-requests__card"
                            >

                                {/* USER */}

                                <button
                                    type="button"
                                    className="group-requests__profile"
                                    onClick={() =>
                                        handleProfile(request)
                                    }
                                    aria-label={`View ${name}'s profile`}
                                >

                                    <div className="group-requests__avatar">

                                        {request?.avatar ? (

                                            <img
                                                src={request.avatar}
                                                alt=""
                                            />

                                        ) : (

                                            <span>
                                                {getInitials(name)}
                                            </span>

                                        )}

                                    </div>


                                    <div className="group-requests__user">

                                        <div className="group-requests__name-row">

                                            <strong>
                                                {name}
                                            </strong>

                                            {request?.isVerified && (
                                                <ShieldCheck
                                                    size={15}
                                                    className="group-requests__verified"
                                                    aria-label="Verified"
                                                />
                                            )}

                                        </div>


                                        <span className="group-requests__username">
                                            {username}
                                        </span>


                                        <small>
                                            {mutualGroups > 0
                                                ? `${mutualGroups} mutual ${
                                                    mutualGroups === 1
                                                        ? "group"
                                                        : "groups"
                                                }`
                                                : "New member"}
                                        </small>

                                    </div>

                                </button>


                                {/* REQUEST MESSAGE */}

                                <div className="group-requests__body">

                                    <p>
                                        {message}
                                    </p>

                                    <time className="group-requests__time">
                                        {requestedAt}
                                    </time>

                                </div>


                                {/* ACTIONS */}

                                <div className="group-requests__actions">

                                    <button
                                        type="button"
                                        className="group-requests__reject"
                                        onClick={() =>
                                            handleReject(request)
                                        }
                                        aria-label={`Reject ${name}`}
                                    >
                                        <X size={16} />

                                        <span>
                                            Reject
                                        </span>
                                    </button>


                                    <button
                                        type="button"
                                        className="group-requests__approve"
                                        onClick={() =>
                                            handleApprove(request)
                                        }
                                        aria-label={`Approve ${name}`}
                                    >
                                        <Check size={16} />

                                        <span>
                                            Approve
                                        </span>
                                    </button>


                                    <button
                                        type="button"
                                        className="group-requests__more"
                                        onClick={() =>
                                            handleMore(request)
                                        }
                                        aria-label={`More options for ${name}`}
                                        title="More options"
                                    >
                                        <MoreVertical size={17} />
                                    </button>

                                </div>

                            </article>
                        );

                    })}

                </div>

            ) : (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="group-requests__empty">

                    <div className="group-requests__empty-icon">
                        <UserPlus size={30} />
                    </div>


                    <h3>
                        No join requests
                    </h3>


                    <p>
                        {searchQuery
                            ? "No requests match your search."
                            : "New membership requests will appear here."}
                    </p>


                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearchQuery("")
                            }
                        >
                            Clear Search
                        </button>
                    )}

                </div>

            )}

        </section>
    );
}


export default GroupRequests;