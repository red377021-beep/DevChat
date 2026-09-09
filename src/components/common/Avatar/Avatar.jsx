import "./Avatar.css";

function Avatar({
  src,
  name = "User",
  size = "md",
  online = false,
}) {
  const initials = name.charAt(0).toUpperCase();

  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <span>{initials}</span>
      )}

      {online && <span className="avatar-online"></span>}
    </div>
  );
}

export default Avatar;