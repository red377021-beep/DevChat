import "./BubbleFooter.css";

import {
    Check,
    CheckCheck,
    Clock3,
    AlertCircle,
    Pencil
} from "lucide-react";

function BubbleFooter({

    own,
    time,

    status = "sent",

    edited = false,

    pinned = false,

    forwarded = false

}) {

    // ==========================================
    // Status Icon
    // ==========================================

    function renderStatus() {

        if (!own) return null;

        switch (status) {

            case "sending":

                return (

                    <Clock3

                        size={14}

                        className="status-icon sending"

                    />

                );

            case "sent":

                return (

                    <Check

                        size={14}

                        className="status-icon sent"

                    />

                );

            case "delivered":

                return (

                    <CheckCheck

                        size={14}

                        className="status-icon delivered"

                    />

                );

            case "seen":

                return (

                    <CheckCheck

                        size={14}

                        className="status-icon seen"

                    />

                );

            case "failed":

                return (

                    <AlertCircle

                        size={14}

                        className="status-icon failed"

                    />

                );

            default:

                return null;

        }

    }

    return (

        <div className="bubble-footer">

            {/* ===================== */}
            {/* Labels */}
            {/* ===================== */}

            <div className="bubble-meta">

                {

                    edited && (

                        <span className="edited-label">

                            <Pencil size={10}/>

                            Edited

                        </span>

                    )

                }

                {

                    forwarded && (

                        <span className="forwarded-label">

                            Forwarded

                        </span>

                    )

                }

                {

                    pinned && (

                        <span className="pinned-label">

                            Pinned

                        </span>

                    )

                }

            </div>

            {/* ===================== */}
            {/* Time */}
            {/* ===================== */}

            <span className="message-time">

                {time}

            </span>

            {/* ===================== */}
            {/* Status */}
            {/* ===================== */}

            {renderStatus()}

        </div>

    );

}

export default BubbleFooter;