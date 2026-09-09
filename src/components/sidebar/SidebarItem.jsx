import "./Sidebar.css";

function SidebarItem({
  icon: Icon,
  label,
  expanded,
  active,
  onClick,
}) {
  return (
    <button
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="sidebar-icon">
        <Icon size={22} />
      </div>

      <div
        className={`sidebar-text ${
          expanded ? "show" : "hide"
        }`}
      >
        {label}
      </div>
    </button>
  );
}

export default SidebarItem;