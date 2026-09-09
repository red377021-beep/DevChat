import "./PopupManager.css";

function PopupManager({

    open,

    children

}) {

    if (!open) return null;

    return (

        <div className="popup-manager">

            {children}

        </div>

    );

}

export default PopupManager;