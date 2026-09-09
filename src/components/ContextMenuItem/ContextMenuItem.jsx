import "./ContextMenuItem.css";

function ContextMenuItem({

    icon: Icon,

    label,

    danger = false,

    onClick

}){

    return(

        <button

            className={`context-menu-item ${danger ? "danger" : ""}`}

            onClick={onClick}

        >

            <Icon size={18}/>

            <span>

                {label}

            </span>

        </button>

    );

}

export default ContextMenuItem;