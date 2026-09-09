import "./GroupView.css";

import {
    MessageCircle,
    Users,
    Settings,
    UserPlus,
} from "lucide-react";

import GroupHeader from "../GroupHeader/GroupHeader";
import GroupMembers from "../GroupMembers/GroupMembers";


const fallbackMembers = [
    {
        id: "current-user",
        name: "You",
        username: "@you",
        avatar: "",
        online: true,
        isAdmin: true,
    },
    {
        id: "member-2",
        name: "Alex",
        username: "@alex",
        avatar: "",
        online: true,
        isAdmin: false,
    },
    {
        id: "member-3",
        name: "Sarah",
        username: "@sarah",
        avatar: "",
        online: false,
        isAdmin: false,
    },
    {
        id: "member-4",
        name: "Daniel",
        username: "@daniel",
        avatar: "",
        online: true,
        isAdmin: false,
    },
];


function GroupView({
    group = {},
    onBack,
    onOpenChat,
    onAddMembers,
    onSettings,
    currentUserId = "current-user",
}) {

    const safeGroup = group || {};

    const members =
        Array.isArray(safeGroup.membersList) &&
        safeGroup.membersList.length > 0
            ? safeGroup.membersList
            : fallbackMembers;

    const groupName =
        safeGroup.name?.trim() || "this group";

    const memberCount =
        Number.isFinite(Number(safeGroup.members))
            ? Number(safeGroup.members)
            : members.length;


    const handleMemberClick = (member) => {
        if (!member) return;

        console.log("Member clicked:", member);
    };


    const handleMemberMore = (member) => {
        if (!member) return;

        console.log("Member menu:", member);
    };


    const handleGroupSearch = () => {
        console.log("Group search");
    };


    const handleGroupMore = () => {
        console.log("Group menu");
    };


    return (
        <section
            className="group-view"
            aria-label={`${groupName} group`}
        >

            {/* =====================================================
                HEADER
            ===================================================== */}

            <GroupHeader
                group={safeGroup}
                onBack={onBack}
                onSearch={handleGroupSearch}
                onMore={handleGroupMore}
            />


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <div className="group-view-content">

                {/* =================================================
                    WELCOME
                ================================================= */}

                <div className="group-welcome">

                    <div
                        className="group-welcome-icon"
                        aria-hidden="true"
                    >
                        <MessageCircle size={28} />
                    </div>

                    <div className="group-welcome-text">

                        <span className="group-welcome-label">
                            GROUP OVERVIEW
                        </span>

                        <h2>
                            Welcome to {groupName}
                        </h2>

                        <p>
                            Start conversations, share ideas,
                            and connect with your group members.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div
                    className="group-quick-actions"
                    aria-label="Group actions"
                >

                    <button
                        type="button"
                        className="group-action-card"
                        onClick={() => onOpenChat?.(safeGroup)}
                    >

                        <span
                            className="group-action-icon"
                            aria-hidden="true"
                        >
                            <MessageCircle size={21} />
                        </span>

                        <span className="group-action-content">

                            <strong>
                                Group Chat
                            </strong>

                            <small>
                                Open the group conversation
                            </small>

                        </span>

                    </button>


                    <button
                        type="button"
                        className="group-action-card"
                        onClick={() => onAddMembers?.(safeGroup)}
                    >

                        <span
                            className="group-action-icon"
                            aria-hidden="true"
                        >
                            <UserPlus size={21} />
                        </span>

                        <span className="group-action-content">

                            <strong>
                                Add Members
                            </strong>

                            <small>
                                Invite people to this group
                            </small>

                        </span>

                    </button>


                    <button
                        type="button"
                        className="group-action-card"
                        onClick={() => onSettings?.(safeGroup)}
                    >

                        <span
                            className="group-action-icon"
                            aria-hidden="true"
                        >
                            <Settings size={21} />
                        </span>

                        <span className="group-action-content">

                            <strong>
                                Group Settings
                            </strong>

                            <small>
                                Manage group preferences
                            </small>

                        </span>

                    </button>

                </div>


                {/* =================================================
                    MEMBERS SECTION
                ================================================= */}

                <section
                    className="group-members-section"
                    aria-labelledby="group-members-title"
                >

                    <div className="group-section-heading">

                        <div className="group-section-title">

                            <span
                                className="group-section-icon"
                                aria-hidden="true"
                            >
                                <Users size={18} />
                            </span>

                            <div>

                                <h3 id="group-members-title">
                                    Members
                                </h3>

                                <p>
                                    {memberCount}{" "}
                                    {memberCount === 1
                                        ? "member"
                                        : "members"}
                                </p>

                            </div>

                        </div>

                    </div>


                    <GroupMembers
                        members={members}
                        currentUserId={currentUserId}
                        onMemberClick={handleMemberClick}
                        onMemberMore={handleMemberMore}
                    />

                </section>

            </div>

        </section>
    );
}


export default GroupView;