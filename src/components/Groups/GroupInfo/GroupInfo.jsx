import "./GroupInfo.css";

import {
    Users,
    Globe2,
    LockKeyhole,
    CalendarDays,
    Link2,
    Bell,
    Search,
    Image,
    FileText,
    ChevronRight,
    Copy,
    Check,
} from "lucide-react";

import { useState } from "react";


function GroupInfo({
    group = {},
    onMembers,
    onMedia,
    onFiles,
    onSearch,
    onNotifications,
}) {
    const [copied, setCopied] = useState(false);


    const groupName =
        String(group?.name || "Group").trim();

    const description =
        String(
            group?.description ||
            "Group information and settings"
        ).trim();


    const privacy =
        String(
            group?.privacy || "public"
        ).toLowerCase();

    const isPrivate =
        privacy === "private";


    const members =
        Number.isFinite(Number(group?.members))
            ? Math.max(0, Number(group.members))
            : 0;


    const onlineMembers =
        Number.isFinite(Number(group?.onlineMembers))
            ? Math.max(0, Number(group.onlineMembers))
            : 0;


    const createdAt =
        group?.createdAt
            ? new Date(group.createdAt)
            : null;


    const formattedCreatedAt =
        createdAt &&
        !Number.isNaN(createdAt.getTime())
            ? createdAt.toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            )
            : "Recently created";


    const inviteLink =
        group?.inviteLink ||
        `https://devchat.app/invite/${
            group?.id || "group"
        }`;


    const handleCopyInvite = async () => {
        try {
            await navigator.clipboard.writeText(
                inviteLink
            );

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1800);

        } catch {
            console.log(
                "Invite link:",
                inviteLink
            );
        }
    };


    return (
        <aside className="group-info">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="group-info-header">

                <div className="group-info-avatar">

                    {group?.avatar ? (
                        <img
                            src={group.avatar}
                            alt={`${groupName} group`}
                            loading="lazy"
                        />
                    ) : (
                        <Users
                            size={32}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    )}

                </div>


                <h2>
                    {groupName}
                </h2>


                <p>
                    {description}
                </p>


                <div className="group-info-header-meta">

                    <span>
                        <Users
                            size={12}
                            aria-hidden="true"
                        />

                        {members.toLocaleString()}
                    </span>

                    <span className="group-info-meta-dot">
                        •
                    </span>

                    <span className="group-info-online">
                        <span className="group-info-online-dot" />

                        {onlineMembers.toLocaleString()}
                        {" "}
                        online
                    </span>

                </div>

            </div>


            {/* =====================================================
                BASIC INFO
            ===================================================== */}

            <div className="group-info-section">

                <div className="group-info-section-title">
                    Group Details
                </div>


                <div className="group-info-row">

                    <span className="group-info-row-icon">
                        <Users
                            size={17}
                            strokeWidth={2}
                        />
                    </span>

                    <div>
                        <strong>
                            {members.toLocaleString()}
                            {" "}
                            Members
                        </strong>

                        <small>
                            {onlineMembers.toLocaleString()}
                            {" "}
                            currently online
                        </small>
                    </div>

                </div>


                <div className="group-info-row">

                    <span
                        className={`group-info-row-icon ${
                            isPrivate
                                ? "is-private"
                                : "is-public"
                        }`}
                    >
                        {isPrivate ? (
                            <LockKeyhole
                                size={17}
                                strokeWidth={2}
                            />
                        ) : (
                            <Globe2
                                size={17}
                                strokeWidth={2}
                            />
                        )}
                    </span>

                    <div>
                        <strong>
                            {isPrivate
                                ? "Private Group"
                                : "Public Group"}
                        </strong>

                        <small>
                            {isPrivate
                                ? "Only members can access"
                                : "Anyone can discover this group"}
                        </small>
                    </div>

                </div>


                <div className="group-info-row">

                    <span className="group-info-row-icon">
                        <CalendarDays
                            size={17}
                            strokeWidth={2}
                        />
                    </span>

                    <div>
                        <strong>
                            Created
                        </strong>

                        <small>
                            {formattedCreatedAt}
                        </small>
                    </div>

                </div>

            </div>


            {/* =====================================================
                ACTIONS
            ===================================================== */}

            <div className="group-info-section">

                <div className="group-info-section-title">
                    Quick Access
                </div>


                <button
                    type="button"
                    className="group-info-action"
                    onClick={() =>
                        onMembers?.()
                    }
                >
                    <span className="group-info-action-left">

                        <span className="group-info-action-icon">
                            <Users size={17} />
                        </span>

                        <span>
                            Members
                        </span>

                    </span>

                    <ChevronRight size={16} />

                </button>


                <button
                    type="button"
                    className="group-info-action"
                    onClick={() =>
                        onMedia?.()
                    }
                >
                    <span className="group-info-action-left">

                        <span className="group-info-action-icon">
                            <Image size={17} />
                        </span>

                        <span>
                            Media
                        </span>

                    </span>

                    <ChevronRight size={16} />

                </button>


                <button
                    type="button"
                    className="group-info-action"
                    onClick={() =>
                        onFiles?.()
                    }
                >
                    <span className="group-info-action-left">

                        <span className="group-info-action-icon">
                            <FileText size={17} />
                        </span>

                        <span>
                            Files
                        </span>

                    </span>

                    <ChevronRight size={16} />

                </button>


                <button
                    type="button"
                    className="group-info-action"
                    onClick={() =>
                        onSearch?.()
                    }
                >
                    <span className="group-info-action-left">

                        <span className="group-info-action-icon">
                            <Search size={17} />
                        </span>

                        <span>
                            Search in Group
                        </span>

                    </span>

                    <ChevronRight size={16} />

                </button>


                <button
                    type="button"
                    className="group-info-action"
                    onClick={() =>
                        onNotifications?.()
                    }
                >
                    <span className="group-info-action-left">

                        <span className="group-info-action-icon">
                            <Bell size={17} />
                        </span>

                        <span>
                            Notifications
                        </span>

                    </span>

                    <ChevronRight size={16} />

                </button>

            </div>


            {/* =====================================================
                INVITE LINK
            ===================================================== */}

            <div className="group-info-invite">

                <div className="group-info-invite-top">

                    <div className="group-info-invite-icon">
                        <Link2
                            size={18}
                            strokeWidth={2}
                        />
                    </div>

                    <div className="group-info-invite-content">

                        <strong>
                            Group Invite Link
                        </strong>

                        <span>
                            Invite people to this group
                        </span>

                    </div>

                </div>


                <div className="group-info-invite-link">

                    <span>
                        {inviteLink}
                    </span>

                    <button
                        type="button"
                        onClick={handleCopyInvite}
                        aria-label="Copy invite link"
                        title={
                            copied
                                ? "Copied"
                                : "Copy invite link"
                        }
                    >
                        {copied ? (
                            <Check size={15} />
                        ) : (
                            <Copy size={15} />
                        )}
                    </button>

                </div>


                <div
                    className={`group-info-copy-status ${
                        copied
                            ? "is-visible"
                            : ""
                    }`}
                >
                    <Check size={12} />
                    Invite link copied
                </div>

            </div>

        </aside>
    );
}


export default GroupInfo;