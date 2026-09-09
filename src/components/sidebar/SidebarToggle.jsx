import "./Sidebar.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

function SidebarToggle({ expanded, onClick }) {
  return (
    <button
      className="sidebar-item sidebar-toggle-item"
      onClick={onClick}
      type="button"
    >
      <div className="sidebar-icon">
        {expanded ? (
          <ChevronLeft size={22} />
        ) : (
          <ChevronRight size={22} />
        )}
      </div>

      {expanded && (
        <div className="sidebar-text show">
          Collapse
        </div>
      )}
    </button>
  );
}

export default SidebarToggle;