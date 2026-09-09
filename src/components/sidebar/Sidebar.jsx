// ======================================================
// DEVCHAT SIDEBAR
// ======================================================

import "./Sidebar.css";

import {
    User,
    LogOut,
} from "lucide-react";

import sidebarMenu from "../../data/sidebarMenu";

import { useLayout } from "../../context/LayoutContext";
import { useAuth } from "../../context/AuthContext";

import SidebarItem from "./SidebarItem";
import SidebarToggle from "./SidebarToggle";


function Sidebar() {

    const {
        sidebarExpanded,
        toggleSidebar,
        activeView,
        setActiveView,
    } = useLayout();


    const {
        logout,
    } = useAuth();


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        // Clear authentication session
        logout();

    };


    return (

        <aside
            className={`sidebar ${
                sidebarExpanded
                    ? "sidebar-expanded"
                    : "sidebar-collapsed"
            }`}
        >

            {/* ==========================
                  LOGO
            =========================== */}

            <div className="sidebar-header">

                <div className="sidebar-logo">

                    <div className="logo-box">
                        DC
                    </div>

                    {sidebarExpanded && (

                        <div className="logo-text">

                            <h2>
                                DevChat
                            </h2>

                            <span>
                                v2.0
                            </span>

                        </div>

                    )}

                </div>

            </div>


            {/* ==========================
                  MENU
            =========================== */}

            <nav className="sidebar-menu">

                <SidebarToggle
                    expanded={sidebarExpanded}
                    onClick={toggleSidebar}
                />


                {sidebarMenu.map((item) => (

                    <SidebarItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        expanded={sidebarExpanded}
                        active={
                            activeView === item.id
                        }
                        onClick={() =>
                            setActiveView(item.id)
                        }
                    />

                ))}

            </nav>


            {/* ==========================
                  PROFILE
            =========================== */}

            <div className="sidebar-footer">

                <SidebarItem
                    icon={User}
                    label="Profile"
                    expanded={sidebarExpanded}
                    active={
                        activeView === "profile"
                    }
                    onClick={() =>
                        setActiveView("profile")
                    }
                />


                {/* ==========================
                      LOGOUT
                =========================== */}

                <SidebarItem
                    icon={LogOut}
                    label="Logout"
                    expanded={sidebarExpanded}
                    active={false}
                    onClick={handleLogout}
                />

            </div>

        </aside>

    );

}


export default Sidebar;