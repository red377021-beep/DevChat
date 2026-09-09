import "./EditBadge.css";

function EditBadge({ edited }) {

    if (!edited) return null;

    return (

        <span className="edited-badge">

            edited

        </span>

    );

}

export default EditBadge;