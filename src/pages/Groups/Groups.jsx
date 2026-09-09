import "./Groups.css";

import {
    Users,
    Plus,
    Search,
    UserPlus,
    Compass,
    ArrowLeft,
    X,
} from "lucide-react";

import { useMemo, useState } from "react";

import GroupCard from "../../components/Groups/GroupCard/GroupCard";
import CreateGroupModal from "../../components/Groups/CreateGroupModal/CreateGroupModal";
import GroupView from "../../components/Groups/GroupView/GroupView";
import GroupChat from "../../components/Groups/GroupChat/GroupChat";
import GroupInfo from "../../components/Groups/GroupInfo/GroupInfo";
import GroupSettings from "../../components/Groups/GroupSettings/GroupSettings";
import GroupInvite from "../../components/Groups/GroupInvite/GroupInvite";
import GroupMedia from "../../components/Groups/GroupMedia/GroupMedia";
import GroupRequests from "../../components/Groups/GroupRequests/GroupRequests";


const initialGroups = [
    {
        id: "group-1",
        name: "DevChat Developers",
        description: "Developers building amazing things together.",
        privacy: "public",
        category: "Technology",
        members: 128,
        onlineMembers: 34,
        avatar: "",
    },
    {
        id: "group-2",
        name: "Gaming Zone",
        description: "Gaming discussions, squads and tournaments.",
        privacy: "private",
        category: "Gaming",
        members: 86,
        onlineMembers: 19,
        avatar: "",
    },
    {
        id: "group-3",
        name: "Study Circle",
        description: "A focused community for students and learners.",
        privacy: "public",
        category: "Education",
        members: 214,
        onlineMembers: 51,
        avatar: "",
    },
    {
        id: "group-4",
        name: "Creative Hub",
        description: "Designers, editors, artists and creative minds.",
        privacy: "public",
        category: "Creative",
        members: 72,
        onlineMembers: 12,
        avatar: "",
    },
];


const tabs = [
    {
        id: "all",
        label: "All Groups",
    },
    {
        id: "public",
        label: "Public",
    },
    {
        id: "private",
        label: "Private",
    },
];


function Groups() {

    const [groups, setGroups] = useState(initialGroups);

    const [activeTab, setActiveTab] = useState("all");

    const [searchQuery, setSearchQuery] = useState("");

    const [searchOpen, setSearchOpen] = useState(false);

    const [createModalOpen, setCreateModalOpen] = useState(false);

    const [activeGroup, setActiveGroup] = useState(null);

    const [activeSection, setActiveSection] = useState("overview");


    /* =========================================================
       FILTER GROUPS
    ========================================================= */

    const filteredGroups = useMemo(() => {

        const query = searchQuery
            .trim()
            .toLowerCase();

        return groups.filter((group) => {

            const name =
                String(group?.name || "").toLowerCase();

            const description =
                String(group?.description || "").toLowerCase();

            const category =
                String(group?.category || "").toLowerCase();

            const privacy =
                String(group?.privacy || "").toLowerCase();

            const matchesTab =
                activeTab === "all" ||
                privacy === activeTab;

            const matchesSearch =
                !query ||
                name.includes(query) ||
                description.includes(query) ||
                category.includes(query);

            return matchesTab && matchesSearch;
        });

    }, [groups, activeTab, searchQuery]);


    /* =========================================================
       GROUP ACTIONS
    ========================================================= */

    const handleCreateGroup = (newGroup) => {

        if (!newGroup) {
            return;
        }

        setGroups((currentGroups) => [
            newGroup,
            ...currentGroups,
        ]);

        setCreateModalOpen(false);
    };


    const handleOpenGroup = (group) => {

        if (!group) {
            return;
        }

        setActiveGroup(group);
        setActiveSection("overview");
    };


    const handleBackToGroups = () => {

        setActiveGroup(null);
        setActiveSection("overview");
    };


    const handleOpenChat = () => {
        setActiveSection("chat");
    };


    const handleOpenInfo = () => {
        setActiveSection("info");
    };


    const handleOpenSettings = () => {
        setActiveSection("settings");
    };


    const handleOpenInvite = () => {
        setActiveSection("invite");
    };


    const handleOpenMedia = () => {
        setActiveSection("media");
    };


    const handleOpenRequests = () => {
        setActiveSection("requests");
    };


    /* =========================================================
       UPDATE GROUP
    ========================================================= */

    const handleGroupSave = (changes) => {

        if (!activeGroup || !changes) {
            return;
        }

        const updatedGroup = {
            ...activeGroup,
            ...changes,
        };

        setActiveGroup(updatedGroup);

        setGroups((currentGroups) =>
            currentGroups.map((group) =>
                group.id === updatedGroup.id
                    ? updatedGroup
                    : group
            )
        );
    };


    /* =========================================================
       DELETE GROUP
    ========================================================= */

    const handleDeleteGroup = () => {

        if (!activeGroup) {
            return;
        }

        setGroups((currentGroups) =>
            currentGroups.filter(
                (group) =>
                    group.id !== activeGroup.id
            )
        );

        setActiveGroup(null);
        setActiveSection("overview");
    };


    /* =========================================================
       SEARCH
    ========================================================= */

    const handleToggleSearch = () => {

        setSearchOpen((current) => !current);

        if (searchOpen) {
            setSearchQuery("");
        }
    };


    const handleClearSearch = () => {
        setSearchQuery("");
    };


    /* =========================================================
       DETAIL VIEW
    ========================================================= */

    const renderDetailBackButton = (
        label = "Back to Group",
        onClick = () =>
            setActiveSection("overview")
    ) => {

        return (
            <button
                type="button"
                className="groups-detail-back"
                onClick={onClick}
            >
                <ArrowLeft size={17} />
                <span>{label}</span>
            </button>
        );
    };


    const renderActiveGroupSection = () => {

        if (!activeGroup) {
            return null;
        }


        /* =====================================================
           CHAT
        ===================================================== */

        if (activeSection === "chat") {

            return (
                <div className="groups-detail-view">

                    {renderDetailBackButton()}

                    <GroupChat
                        group={activeGroup}
                        onMessageSend={(message) =>
                            console.log(
                                "Group message:",
                                message
                            )
                        }
                        onMessageReply={(message) =>
                            console.log(
                                "Reply:",
                                message
                            )
                        }
                        onMessageMore={(message) =>
                            console.log(
                                "Message options:",
                                message
                            )
                        }
                    />

                </div>
            );
        }


        /* =====================================================
           INFO
        ===================================================== */

        if (activeSection === "info") {

            return (
                <div className="groups-detail-view">

                    {renderDetailBackButton()}

                    <GroupInfo
                        group={activeGroup}
                        onMembers={() =>
                            setActiveSection("members")
                        }
                        onMedia={handleOpenMedia}
                        onFiles={() =>
                            console.log(
                                "Open group files"
                            )
                        }
                        onSearch={() =>
                            console.log(
                                "Search group"
                            )
                        }
                        onNotifications={() =>
                            console.log(
                                "Group notifications"
                            )
                        }
                    />

                </div>
            );
        }


        /* =====================================================
           SETTINGS
        ===================================================== */

        if (activeSection === "settings") {

            return (
                <div className="groups-detail-view">

                    {renderDetailBackButton()}

                    <GroupSettings
                        group={activeGroup}
                        onInvite={handleOpenInvite}
                        onMembers={() =>
                            setActiveSection("members")
                        }
                        onDelete={handleDeleteGroup}
                        onSave={handleGroupSave}
                    />

                </div>
            );
        }


        /* =====================================================
           INVITE
        ===================================================== */

        if (activeSection === "invite") {

            return (
                <div className="groups-detail-view">

                    {renderDetailBackButton()}

                    <GroupInvite
                        group={activeGroup}
                        onClose={() =>
                            setActiveSection("overview")
                        }
                        onInvite={() =>
                            console.log(
                                "Invite people"
                            )
                        }
                    />

                </div>
            );
        }


        /* =====================================================
           MEDIA
        ===================================================== */

        if (activeSection === "media") {

            return (
                <div className="groups-detail-view">

                    {renderDetailBackButton()}

                    <GroupMedia
                        media={activeGroup.media || []}
                        onMediaClick={(media) =>
                            console.log(
                                "Open media:",
                                media
                            )
                        }
                        onLoadMore={() =>
                            console.log(
                                "Load more group media"
                            )
                        }
                    />

                </div>
            );
        }


        /* =====================================================
           REQUESTS
        ===================================================== */

        if (activeSection === "requests") {

            return (
                <div className="groups-detail-view">

                    {renderDetailBackButton()}

                    <GroupRequests
                        requests={
                            activeGroup.requests || []
                        }
                        onApprove={(request) =>
                            console.log(
                                "Approve request:",
                                request
                            )
                        }
                        onReject={(request) =>
                            console.log(
                                "Reject request:",
                                request
                            )
                        }
                        onViewProfile={(request) =>
                            console.log(
                                "View profile:",
                                request
                            )
                        }
                    />

                </div>
            );
        }


        /* =====================================================
           MEMBERS
        ===================================================== */

        if (activeSection === "members") {

            return (
                <div className="groups-detail-view">

                    {renderDetailBackButton()}

                    <GroupView
                        group={activeGroup}
                        currentUserId="current-user"
                        onBack={() =>
                            setActiveSection("overview")
                        }
                        onOpenChat={handleOpenChat}
                        onAddMembers={handleOpenInvite}
                        onSettings={handleOpenSettings}
                    />

                </div>
            );
        }


        /* =====================================================
           OVERVIEW
        ===================================================== */

        return (
            <div className="groups-detail-view">

                {renderDetailBackButton(
                    "All Groups",
                    handleBackToGroups
                )}

                <GroupView
                    group={activeGroup}
                    currentUserId="current-user"
                    onBack={handleBackToGroups}
                    onOpenChat={handleOpenChat}
                    onAddMembers={handleOpenInvite}
                    onSettings={handleOpenSettings}
                />

                <div className="groups-detail-tools">

                    <button
                        type="button"
                        className={
                            activeSection === "info"
                                ? "active"
                                : ""
                        }
                        onClick={handleOpenInfo}
                    >
                        Group Info
                    </button>

                    <button
                        type="button"
                        className={
                            activeSection === "media"
                                ? "active"
                                : ""
                        }
                        onClick={handleOpenMedia}
                    >
                        Media
                    </button>

                    <button
                        type="button"
                        className={
                            activeSection === "requests"
                                ? "active"
                                : ""
                        }
                        onClick={handleOpenRequests}
                    >
                        Requests
                    </button>

                    <button
                        type="button"
                        className={
                            activeSection === "invite"
                                ? "active"
                                : ""
                        }
                        onClick={handleOpenInvite}
                    >
                        Invite
                    </button>

                    <button
                        type="button"
                        className={
                            activeSection === "settings"
                                ? "active"
                                : ""
                        }
                        onClick={handleOpenSettings}
                    >
                        Settings
                    </button>

                </div>

            </div>
        );
    };


    /* =========================================================
       DETAIL PAGE
    ========================================================= */

    if (activeGroup) {

        return (
            <main className="groups-page groups-page--detail">
                {renderActiveGroupSection()}
            </main>
        );
    }


    /* =========================================================
       GROUP LIST PAGE
    ========================================================= */

    return (
        <main className="groups-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="groups-header">

                <div className="groups-title">

                    <div
                        className="groups-title-icon"
                        aria-hidden="true"
                    >
                        <Users size={23} />
                    </div>

                    <div>

                        <h1>
                            Groups
                        </h1>

                        <p>
                            Discover communities and
                            connect with people.
                        </p>

                    </div>

                </div>


                <div className="groups-header-actions">

                    <button
                        type="button"
                        className={`groups-search-button ${
                            searchOpen
                                ? "active"
                                : ""
                        }`}
                        onClick={handleToggleSearch}
                        aria-label={
                            searchOpen
                                ? "Close search"
                                : "Search groups"
                        }
                        title={
                            searchOpen
                                ? "Close search"
                                : "Search groups"
                        }
                    >
                        {searchOpen ? (
                            <X size={18} />
                        ) : (
                            <Search size={18} />
                        )}
                    </button>


                    <button
                        type="button"
                        className="groups-create-button"
                        onClick={() =>
                            setCreateModalOpen(true)
                        }
                    >
                        <Plus size={18} />
                        <span>Create Group</span>
                    </button>

                </div>

            </header>


            {/* =================================================
                SEARCH
            ================================================= */}

            {searchOpen && (

                <div className="groups-search">

                    <Search size={17} />

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(
                                event.target.value
                            )
                        }
                        placeholder="Search groups..."
                        autoFocus
                        aria-label="Search groups"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            className="groups-search-clear"
                            onClick={handleClearSearch}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <X size={15} />
                        </button>
                    )}

                </div>
            )}


            {/* =================================================
                TABS
            ================================================= */}

            <nav
                className="groups-tabs"
                aria-label="Group filters"
            >

                {tabs.map((tab) => (

                    <button
                        key={tab.id}
                        type="button"
                        className={
                            activeTab === tab.id
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab(tab.id)
                        }
                        aria-current={
                            activeTab === tab.id
                                ? "page"
                                : undefined
                        }
                    >
                        {tab.label}
                    </button>

                ))}

            </nav>


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <div className="groups-quick-actions">

                <button
                    type="button"
                    onClick={() =>
                        setCreateModalOpen(true)
                    }
                >

                    <span className="groups-quick-icon">
                        <Plus size={18} />
                    </span>

                    <span>
                        <strong>
                            Create Group
                        </strong>

                        <small>
                            Start your own community
                        </small>
                    </span>

                </button>


                <button
                    type="button"
                    onClick={() =>
                        setActiveTab("public")
                    }
                >

                    <span className="groups-quick-icon">
                        <Compass size={18} />
                    </span>

                    <span>
                        <strong>
                            Explore Groups
                        </strong>

                        <small>
                            Discover public communities
                        </small>
                    </span>

                </button>


                <button
                    type="button"
                    onClick={() =>
                        console.log(
                            "Invite friends"
                        )
                    }
                >

                    <span className="groups-quick-icon">
                        <UserPlus size={18} />
                    </span>

                    <span>
                        <strong>
                            Invite Friends
                        </strong>

                        <small>
                            Bring friends into groups
                        </small>
                    </span>

                </button>

            </div>


            {/* =================================================
                SECTION HEADER
            ================================================= */}

            <div className="groups-section-header">

                <div>

                    <h2>
                        {activeTab === "all"
                            ? "Your Groups"
                            : `${activeTab} Groups`}
                    </h2>

                    <span>
                        {filteredGroups.length}{" "}
                        {filteredGroups.length === 1
                            ? "group"
                            : "groups"}
                    </span>

                </div>

            </div>


            {/* =================================================
                GROUP GRID
            ================================================= */}

            {filteredGroups.length > 0 ? (

                <div className="groups-grid">

                    {filteredGroups.map((group) => (

                        <GroupCard
                            key={group.id}
                            group={group}
                            onOpen={handleOpenGroup}
                        />

                    ))}

                </div>

            ) : (

                <div className="groups-empty">

                    <div className="groups-empty-icon">
                        <Users size={30} />
                    </div>

                    <h3>
                        No groups found
                    </h3>

                    <p>
                        Try another search or create
                        a new group.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setCreateModalOpen(true)
                        }
                    >
                        <Plus size={17} />
                        Create Group
                    </button>

                </div>

            )}


            {/* =================================================
                CREATE GROUP MODAL
            ================================================= */}

            <CreateGroupModal
                isOpen={createModalOpen}
                onClose={() =>
                    setCreateModalOpen(false)
                }
                onCreate={handleCreateGroup}
            />

        </main>
    );
}


export default Groups;