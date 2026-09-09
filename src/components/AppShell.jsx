import { useLayout } from "../context/LayoutContext";
import "../layouts/MainLayout.css";

function AppShell({ children }) {
  const { sidebarExpanded } = useLayout();

  return (
    <div
      className={`app-layout ${
        sidebarExpanded ? "sidebar-open" : "sidebar-close"
      }`}
    >
      {children}
    </div>
  );
}

export default AppShell;