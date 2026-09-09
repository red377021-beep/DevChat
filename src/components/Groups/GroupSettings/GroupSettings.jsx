import "./GroupSettings.css";

import {
    Settings,
    Bell,
    LockKeyhole,
    Users,
    Link2,
    ShieldCheck,
    Trash2,
    ChevronRight,
    Check,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";


function GroupSettings({
    group = {},
    onInvite,
    onMembers,
    onDelete,
    onSave,
}) {

    const [notifications, setNotifications] = useState(true);

    const [privateGroup, setPrivateGroup] = useState(
        String(group?.privacy || "public").toLowerCase() === "private"
    );

    const [saved, setSaved] = useState(false);


    // =====================================================
    // SYNC WITH GROUP
    // =====================================================

    useEffect(() => {

        setPrivateGroup(
            String(group?.privacy || "public").toLowerCase() === "private"
        );

        setSaved(false);

    }, [group?.id, group?.privacy]);


    // =====================================================
    // SAVE
    // =====================================================

    const handleSave = () => {

        onSave?.({
            notifications,
            privacy: privateGroup
                ? "private"
                : "public",
        });

        setSaved(true);

        window.setTimeout(() => {
            setSaved(false);
        }, 1800);

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = () => {

        onDelete?.(group);

    };


    // =====================================================
    // TOGGLE NOTIFICATIONS
    // =====================================================

    const handleNotifications = () => {

        setNotifications((value) => !value);

        setSaved(false);

    };


    // =====================================================
    // TOGGLE PRIVACY
    // =====================================================

    const handlePrivacy = () => {

        setPrivateGroup((value) => !value);

        setSaved(false);

    };


    const groupName = group?.name || "this group";


    return (
        <section
            className="group-settings"
            aria-label="Group settings"
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="group-settings-header">

                <div className="group-settings-header-icon">
                    <Settings size={22} />
                </div>

                <div className="group-settings-header-content">

                    <h2>
                        Group Settings
                    </h2>

                    <p>
                        Manage {groupName}
                    </p>

                </div>

            </header>


            {/* =================================================
                GENERAL
            ================================================= */}

            <div className="group-settings-section">

                <div className="group-settings-title">
                    General
                </div>


                <button
                    type="button"
                    className="group-settings-row"
                    onClick={onMembers}
                >

                    <span className="group-settings-row-icon">
                        <Users size={17} />
                    </span>


                    <span className="group-settings-row-content">

                        <strong>
                            Manage Members
                        </strong>

                        <small>
                            Add, remove, or manage members
                        </small>

                    </span>


                    <ChevronRight
                        size={17}
                        className="group-settings-chevron"
                    />

                </button>


                <button
                    type="button"
                    className="group-settings-row"
                    onClick={onInvite}
                >

                    <span className="group-settings-row-icon">
                        <Link2 size={17} />
                    </span>


                    <span className="group-settings-row-content">

                        <strong>
                            Invite Link
                        </strong>

                        <small>
                            Manage your group invitation link
                        </small>

                    </span>


                    <ChevronRight
                        size={17}
                        className="group-settings-chevron"
                    />

                </button>

            </div>


            {/* =================================================
                PREFERENCES
            ================================================= */}

            <div className="group-settings-section">

                <div className="group-settings-title">
                    Preferences
                </div>


                {/* NOTIFICATIONS */}

                <div className="group-settings-toggle-row">

                    <span className="group-settings-row-icon">
                        <Bell size={17} />
                    </span>


                    <span className="group-settings-row-content">

                        <strong>
                            Notifications
                        </strong>

                        <small>
                            Receive notifications from this group
                        </small>

                    </span>


                    <button
                        type="button"
                        className={`group-toggle ${
                            notifications
                                ? "active"
                                : ""
                        }`}
                        onClick={handleNotifications}
                        aria-label="Toggle notifications"
                        aria-pressed={notifications}
                    >

                        <span />

                    </button>

                </div>


                {/* PRIVATE GROUP */}

                <div className="group-settings-toggle-row">

                    <span className="group-settings-row-icon">
                        <LockKeyhole size={17} />
                    </span>


                    <span className="group-settings-row-content">

                        <strong>
                            Private Group
                        </strong>

                        <small>
                            Restrict group access to members
                        </small>

                    </span>


                    <button
                        type="button"
                        className={`group-toggle ${
                            privateGroup
                                ? "active"
                                : ""
                        }`}
                        onClick={handlePrivacy}
                        aria-label="Toggle private group"
                        aria-pressed={privateGroup}
                    >

                        <span />

                    </button>

                </div>

            </div>


            {/* =================================================
                SECURITY
            ================================================= */}

            <div className="group-settings-section">

                <div className="group-settings-title">
                    Security
                </div>


                <div className="group-settings-security">

                    <div className="group-settings-security-icon">
                        <ShieldCheck size={18} />
                    </div>


                    <div>

                        <strong>
                            Group Protection
                        </strong>

                        <p>
                            Group permissions and member
                            controls are enabled.
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                SAVE
            ================================================= */}

            <button
                type="button"
                className={`group-settings-save ${
                    saved ? "saved" : ""
                }`}
                onClick={handleSave}
            >

                {saved ? (
                    <>
                        <Check size={17} />
                        Saved
                    </>
                ) : (
                    "Save Changes"
                )}

            </button>


            {/* =================================================
                DANGER ZONE
            ================================================= */}

            <div className="group-settings-danger">

                <div className="group-settings-title">
                    Danger Zone
                </div>


                <div className="group-settings-danger-card">

                    <div className="group-settings-danger-info">

                        <div className="group-settings-danger-icon">
                            <Trash2 size={17} />
                        </div>

                        <div>

                            <strong>
                                Delete Group
                            </strong>

                            <p>
                                Permanently delete this group
                                and its content.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="group-delete-button"
                        onClick={handleDelete}
                    >
                        <Trash2 size={16} />

                        <span>
                            Delete
                        </span>
                    </button>

                </div>

            </div>

        </section>
    );
}


export default GroupSettings;