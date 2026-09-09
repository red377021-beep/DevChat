import "./MenuItem.css";

function MenuItem({

    icon,

    label,

    shortcut,

    danger = false,

    disabled = false,

    onClick

}) {

    function handleClick() {

        if (disabled) return;

        onClick?.();

    }

    return (

        <button

            className={

                `menu-item
                ${danger ? "danger" : ""}
                ${disabled ? "disabled" : ""}`

            }

            onClick={handleClick}

            disabled={disabled}

        >

            {/* ========================= */}
            {/* Left */}
            {/* ========================= */}

            <div className="menu-item-left">

                <span className="menu-item-icon">

                    {icon}

                </span>

                <span className="menu-item-label">

                    {label}

                </span>

            </div>

            {/* ========================= */}
            {/* Right */}
            {/* ========================= */}

            {

                shortcut && (

                    <span className="menu-item-shortcut">

                        {shortcut}

                    </span>

                )

            }

        </button>

    );

}

export default MenuItem;