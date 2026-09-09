// ======================================================
// React
// ======================================================

import { useEffect, useRef } from "react";

// ======================================================
// Icons
// ======================================================

import {
    Trash2,
    X,
} from "lucide-react";

// ======================================================
// Styles
// ======================================================

import "./DeleteModal.css";

// ======================================================
// Component
// ======================================================

function DeleteModal({

    open,

    onClose,

    onDelete,

    count = 1

}) {

    // ======================================================
    // Ref
    // ======================================================

    const modalRef = useRef(null);

    // ======================================================
    // ESC Close
    // ======================================================

    useEffect(() => {

        if (!open) return;

        function handleKeyDown(event) {

            if (event.key === "Escape") {

                onClose();

            }

        }

        document.addEventListener(

            "keydown",

            handleKeyDown

        );

        return () => {

            document.removeEventListener(

                "keydown",

                handleKeyDown

            );

        };

    }, [open, onClose]);

    // ======================================================
    // Backdrop Click
    // ======================================================

    function handleBackdropClick(event) {

        if (event.target === modalRef.current) {

            onClose();

        }

    }

    // ======================================================
    // Delete
    // ======================================================

    function handleDelete() {

        onDelete?.();

        onClose();

    }

    // ======================================================
    // Hide
    // ======================================================

    if (!open) return null;

    // ======================================================
    // UI
    // ======================================================

    return (

        <div

            ref={modalRef}

            className="delete-modal-backdrop"

            onClick={handleBackdropClick}

        >

            <div className="delete-modal">

                {/* Close */}

                <button

                    className="delete-close"

                    onClick={onClose}

                >

                    <X size={18} />

                </button>

                {/* Icon */}

                <div className="delete-icon">

                    <Trash2 size={42} />

                </div>

                {/* Title */}

                <h2>

                    {

                        count > 1

                            ? `Delete ${count} Messages?`

                            : "Delete Message?"

                    }

                </h2>

                {/* Description */}

                <p>

                    {

                        count > 1

                            ? "All selected messages will be permanently deleted."

                            : "This action cannot be undone."

                    }

                </p>

                {/* Buttons */}

                <div className="delete-actions">

                    <button

                        className="cancel-btn"

                        onClick={onClose}

                    >

                        Cancel

                    </button>

                    <button

                        className="delete-btn"

                        onClick={handleDelete}

                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteModal;