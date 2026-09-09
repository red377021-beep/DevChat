import "./MessageStatus.css";

import {
    Clock3,
    Check,
    CheckCheck
} from "lucide-react";

function MessageStatus({

    status = "sent"

}) {

    if (status === "sending") {

        return (
            <span className="message-status sending">
                <Clock3 size={13} />
            </span>
        );

    }

    if (status === "sent") {

        return (
            <span className="message-status sent">
                <Check size={14} />
            </span>
        );

    }

    if (status === "delivered") {

        return (
            <span className="message-status delivered">
                <CheckCheck size={14} />
            </span>
        );

    }

    if (status === "seen") {

        return (
            <span className="message-status seen">
                <CheckCheck size={14} />
            </span>
        );

    }

    return null;

}

export default MessageStatus;