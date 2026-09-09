import "./DeletedMessage.css";

import { Ban } from "lucide-react";

function DeletedMessage({ own }) {

    return (

        <div className="deleted-message">

            <Ban size={14} />

            <span>

                {own
                    ? "You deleted this message."
                    : "This message was deleted."}

            </span>

        </div>

    );

}

export default DeletedMessage;