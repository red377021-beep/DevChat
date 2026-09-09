import "./GroupInvite.css";

import {
    Link2,
    Copy,
    Share2,
    UserPlus,
    X,
    Check,
    Users,
} from "lucide-react";

import { useEffect, useState } from "react";


function GroupInvite({
    group = {},
    onClose,
    onInvite,
}) {
    const [copied, setCopied] = useState(false);
    const [sharing, setSharing] = useState(false);


    const groupName =
        String(
            group?.name || "DevChat Group"
        ).trim();


    const memberCount =
        Number.isFinite(Number(group?.members))
            ? Math.max(0, Number(group.members))
            : 0;


    const inviteLink =
        group?.inviteLink ||
        `https://devchat.app/invite/${
            group?.id || "group"
        }`;


    useEffect(() => {
        if (!copied) {
            return;
        }

        const timer =
            window.setTimeout(() => {
                setCopied(false);
            }, 2000);

        return () => {
            window.clearTimeout(timer);
        };
    }, [copied]);


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                inviteLink
            );

            setCopied(true);

        } catch (error) {
            console.error(
                "Failed to copy invite link:",
                error
            );
        }
    };


    const handleShare = async () => {
        if (sharing) {
            return;
        }

        if (!navigator.share) {
            await handleCopy();
            return;
        }

        try {
            setSharing(true);

            await navigator.share({
                title: groupName,
                text:
                    `Join ${groupName} on DevChat`,
                url: inviteLink,
            });

        } catch (error) {
            if (
                error?.name !==
                "AbortError"
            ) {
                console.error(
                    "Failed to share invite link:",
                    error
                );
            }

        } finally {
            setSharing(false);
        }
    };


    const handleInvite = () => {
        onInvite?.(group);
    };


    return (
        <section
            className="group-invite"
            aria-label="Invite group members"
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="group-invite-header">

                <div className="group-invite-header-left">

                    <div className="group-invite-icon">
                        <UserPlus
                            size={21}
                            strokeWidth={2}
                        />
                    </div>

                    <div className="group-invite-heading">

                        <h2>
                            Invite Members
                        </h2>

                        <p>
                            Invite people to{" "}
                            <strong>
                                {groupName}
                            </strong>
                        </p>

                    </div>

                </div>


                {onClose && (
                    <button
                        type="button"
                        className="group-invite-close"
                        onClick={onClose}
                        aria-label="Close invite panel"
                        title="Close"
                    >
                        <X
                            size={18}
                            strokeWidth={2}
                        />
                    </button>
                )}

            </div>


            {/* =====================================================
                GROUP
            ===================================================== */}

            <div className="group-invite-group">

                <div className="group-invite-avatar">

                    {group?.avatar ? (
                        <img
                            src={group.avatar}
                            alt={`${groupName} group`}
                            loading="lazy"
                        />
                    ) : (
                        <Users
                            size={24}
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    )}

                </div>


                <div className="group-invite-group-details">

                    <strong>
                        {groupName}
                    </strong>

                    <span>
                        {memberCount.toLocaleString()}
                        {" "}
                        {memberCount === 1
                            ? "member"
                            : "members"}
                    </span>

                </div>

            </div>


            {/* =====================================================
                INVITE LINK
            ===================================================== */}

            <div className="group-invite-link-section">

                <div className="group-invite-label-row">

                    <label htmlFor="group-invite-link">
                        Group Invite Link
                    </label>

                    <span>
                        Shareable link
                    </span>

                </div>


                <div
                    className={`group-invite-link-box ${
                        copied
                            ? "is-copied"
                            : ""
                    }`}
                >

                    <span className="group-invite-link-icon">
                        <Link2
                            size={17}
                            strokeWidth={2}
                        />
                    </span>


                    <input
                        id="group-invite-link"
                        type="text"
                        value={inviteLink}
                        readOnly
                        aria-label="Group invite link"
                        onFocus={(event) =>
                            event.target.select()
                        }
                    />


                    <button
                        type="button"
                        onClick={handleCopy}
                        aria-label={
                            copied
                                ? "Invite link copied"
                                : "Copy invite link"
                        }
                        title={
                            copied
                                ? "Copied"
                                : "Copy"
                        }
                    >
                        {copied ? (
                            <Check
                                size={17}
                                strokeWidth={2.2}
                            />
                        ) : (
                            <Copy
                                size={17}
                                strokeWidth={2}
                            />
                        )}
                    </button>

                </div>


                <div
                    className={`group-invite-copied ${
                        copied
                            ? "is-visible"
                            : ""
                    }`}
                    aria-live="polite"
                >
                    <Check size={12} />
                    Invite link copied
                </div>

            </div>


            {/* =====================================================
                ACTIONS
            ===================================================== */}

            <div className="group-invite-actions">

                <button
                    type="button"
                    className="group-invite-primary"
                    onClick={handleShare}
                    disabled={sharing}
                >
                    <Share2
                        size={17}
                        strokeWidth={2}
                    />

                    <span>
                        {sharing
                            ? "Sharing..."
                            : "Share Link"}
                    </span>
                </button>


                <button
                    type="button"
                    className="group-invite-secondary"
                    onClick={handleInvite}
                >
                    <UserPlus
                        size={17}
                        strokeWidth={2}
                    />

                    <span>
                        Invite People
                    </span>
                </button>

            </div>


            {/* =====================================================
                INFO
            ===================================================== */}

            <div className="group-invite-info">

                <div className="group-invite-info-icon">
                    <Link2
                        size={17}
                        strokeWidth={2}
                    />
                </div>

                <p>
                    Anyone with this link can
                    request to join the group.
                    You can manage requests
                    from Group Settings.
                </p>

            </div>

        </section>
    );
}


export default GroupInvite;