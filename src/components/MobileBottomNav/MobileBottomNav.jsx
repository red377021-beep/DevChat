import "./MobileBottomNav.css";

import sidebarMenu from "../../data/sidebarMenu";
import { useLayout } from "../../context/LayoutContext";


// =====================================================
// MOBILE BOTTOM NAVIGATION
// =====================================================
// ONLY:
// Chats | Reels | Stories | Groups | AI
// =====================================================

function MobileBottomNav() {

    const {
        activeView,
        setActiveView
    } = useLayout();


    // =====================================================
    // EXACT 5 ITEMS
    // =====================================================

    const mobileNavIds = [
        "chats",
        "reels",
        "stories",
        "groups",
        "ai"
    ];


    // Find only the required 5 items
    const mobileItems = mobileNavIds
        .map((id) =>
            sidebarMenu.find(
                (item) => item.id === id
            )
        )
        .filter(Boolean);


    // =====================================================
    // HANDLE NAVIGATION
    // =====================================================

    const handleNavigation = (item) => {

        setActiveView(item.id);

    };


    return (
        <nav
            className="mobile-bottom-nav"
            aria-label="Mobile navigation"
        >

            <div className="mobile-bottom-nav-inner">

                {mobileItems.map((item) => {

                    const Icon = item.icon;

                    const isActive =
                        activeView === item.id;


                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={
                                `mobile-nav-item ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`
                            }
                            onClick={() =>
                                handleNavigation(item)
                            }
                            aria-label={item.label}
                        >

                            <span className="mobile-nav-icon">

                                <Icon
                                    size={23}
                                    strokeWidth={
                                        isActive
                                            ? 2.5
                                            : 2
                                    }
                                />

                            </span>


                            <span className="mobile-nav-label">

                                {item.id === "ai"
                                    ? "AI"
                                    : item.label}

                            </span>

                        </button>

                    );

                })}

            </div>

        </nav>
    );
}


export default MobileBottomNav;
