import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export function LayoutProvider({ children }) {

    // ==========================================
    // SIDEBAR
    // ==========================================

    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const toggleSidebar = () => {
        setSidebarExpanded((prev) => !prev);
    };


    // ==========================================
    // ACTIVE VIEW
    // ==========================================

    const [activeView, setActiveView] = useState("chats");


    // ==========================================
    // CONTEXT
    // ==========================================

    return (

        <LayoutContext.Provider
            value={{
                sidebarExpanded,
                toggleSidebar,

                activeView,
                setActiveView,
            }}
        >

            {children}

        </LayoutContext.Provider>

    );
}


export function useLayout() {

    return useContext(LayoutContext);

}