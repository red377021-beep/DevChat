// ======================================================
// DevChat
// Reusable Avatar Component
//
// Responsibility
// ------------------------------------------------------
// • Display user avatar
// • Fallback initials
// • Online indicator (future)
// • Story ring (future)
// ======================================================

import "./Avatar.css";

function Avatar({

  src = "",

  alt = "User",

  size = 46,

}) {

  const initials = alt
    .trim()
    .charAt(0)
    .toUpperCase();

  return (

    <div
      className="avatar"
      style={{
        width: size,
        height: size,
      }}
    >

      {src ? (

        <img
          src={src}
          alt={alt}
        />

      ) : (

        <span>

          {initials}

        </span>

      )}

    </div>

  );

}

export default Avatar;