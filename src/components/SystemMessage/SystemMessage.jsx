import "./SystemMessage.css";

import { Trash2 } from "lucide-react";

function SystemMessage({

    own,

    user,

    time

}){

    return(

        <div className="system-wrapper">

            <div className="system-line"/>

            <div className="system-message">

                <Trash2 size={13}/>

                <span>

                    {

                        own

                        ? "You unsent a message"

                        : `${user} removed a message`

                    }

                </span>

                <small>

                    {time}

                </small>

            </div>

            <div className="system-line"/>

        </div>

    );

}

export default SystemMessage;