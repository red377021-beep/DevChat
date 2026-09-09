import "./IconButton.css";

function IconButton({

    icon: Icon,

    onClick,

    title

}) {

    return (

        <button

            className="icon-button"

            onClick={onClick}

            title={title}

            type="button"

        >

            <Icon size={20} />

        </button>

    );

}

export default IconButton;