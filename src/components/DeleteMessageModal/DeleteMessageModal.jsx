import "./DeleteMessageModal.css";

import {
    Trash2,
    X,
    Undo2
} from "lucide-react";

import { useEffect } from "react";

import { useChat } from "../../context/ChatContext";

function DeleteMessageModal() {

    const {

        deleteModalOpen,

        closeDeleteModal,

        deleteMessage,

        removeMessage

    } = useChat();

    // =====================================
    // ESC Close
    // =====================================

    useEffect(() => {

        function handleKey(e) {

            if (e.key === "Escape") {

                closeDeleteModal();

            }

        }

        document.addEventListener(

            "keydown",

            handleKey

        );

        return () => {

            document.removeEventListener(

                "keydown",

                handleKey

            );

        };

    }, [closeDeleteModal]);

    // =====================================
    // Safety
    // =====================================

    if (!deleteModalOpen || !deleteMessage) {

        return null;

    }

    // =====================================
    // Multi Delete Support
    // =====================================

    const isMulti = Array.isArray(deleteMessage);

    const ids = isMulti

        ? deleteMessage

        : [deleteMessage.id];

    // =====================================
    // UI
    // =====================================

    return (

        <div

            className="delete-overlay"

            onClick={closeDeleteModal}

        >

            <div

                className="delete-modal"

                onClick={(e) => e.stopPropagation()}

            >

                {/* ===================================== */}
                {/* Header */}
                {/* ===================================== */}

                <div className="delete-header">

                    <div className="delete-header-left">

                        <Trash2 size={22} />

                        <h2>

                            {

                                isMulti

                                    ? `Delete ${ids.length} Messages`

                                    : "Delete Message"

                            }

                        </h2>

                    </div>

                    <button

                        className="close-btn"

                        onClick={closeDeleteModal}

                    >

                        <X size={18} />

                    </button>

                </div>

                {/* ===================================== */}
                {/* Description */}
                {/* ===================================== */}

                <p>

                    {

                        isMulti

                            ? "Choose how you want to delete the selected messages."

                            : "Choose how you want to delete this message."

                    }

                </p>

                {/* ===================================== */}
                {/* Actions */}
                {/* ===================================== */}

                <div className="delete-actions">

                    <button

                        className="cancel-btn"

                        onClick={() => {

                            removeMessage(ids);

                        }}

                    >

                        <Undo2 size={18} />

                        Delete For Me

                    </button>

                    <button

                        className="delete-btn"

                        onClick={() => {

                            removeMessage(ids);

                        }}

                    >

                        <Trash2 size={18} />

                        Delete For Everyone

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteMessageModal;