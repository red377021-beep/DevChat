
import "./SelectionToolbar.css";

import {
    ArrowLeft,
    CheckCheck,
    Copy,
    Forward,
    Star,
    Pin,
    Bookmark,
    Trash2
} from "lucide-react";

import { useChat } from "../../context/ChatContext";

function SelectionToolbar() {

    const {
        selectedMessages,

        clearSelection,

        selectAllMessages,

        copySelectedMessages,

        deleteSelectedMessages,

        forwardSelectedMessages,

        starSelectedMessages,

        pinSelectedMessages,

        bookmarkSelectedMessages

    } = useChat();


    // ==========================================================
    // Selected Count
    // ==========================================================

    const selectedCount = Array.isArray(selectedMessages)
        ? selectedMessages.length
        : 0;


    // ==========================================================
    // Hide Toolbar
    // ==========================================================

    if (selectedCount === 0) {

        return null;

    }


    // ==========================================================
    // UI
    // ==========================================================

    return (

        <header className="selection-toolbar">


            {/* ================================= */}
            {/* Left */}
            {/* ================================= */}

            <div className="selection-left">

                <button
                    type="button"
                    className="toolbar-btn"
                    title="Cancel Selection"
                    onClick={clearSelection}
                >

                    <ArrowLeft size={22} />

                </button>


                <span className="selection-count">

                    {selectedCount} Selected

                </span>

            </div>


            {/* ================================= */}
            {/* Right */}
            {/* ================================= */}

            <div className="selection-right">


                {/* ================================= */}
                {/* Select All */}
                {/* ================================= */}

                <button
                    type="button"
                    className="toolbar-btn"
                    title="Select All"
                    onClick={selectAllMessages}
                >

                    <CheckCheck size={20} />

                </button>


                {/* ================================= */}
                {/* Copy */}
                {/* ================================= */}

                <button
                    type="button"
                    className="toolbar-btn"
                    title="Copy"
                    onClick={copySelectedMessages}
                >

                    <Copy size={20} />

                </button>


                {/* ================================= */}
                {/* Forward */}
                {/* ================================= */}

                <button
                    type="button"
                    className="toolbar-btn"
                    title="Forward"
                    onClick={forwardSelectedMessages}
                >

                    <Forward size={20} />

                </button>


                {/* ================================= */}
                {/* Star */}
                {/* ================================= */}

                <button
                    type="button"
                    className="toolbar-btn"
                    title="Star"
                    onClick={starSelectedMessages}
                >

                    <Star size={20} />

                </button>


                {/* ================================= */}
                {/* Pin */}
                {/* ================================= */}

                <button
                    type="button"
                    className="toolbar-btn"
                    title="Pin"
                    onClick={pinSelectedMessages}
                >

                    <Pin size={20} />

                </button>


                {/* ================================= */}
                {/* Bookmark */}
                {/* ================================= */}

                <button
                    type="button"
                    className="toolbar-btn"
                    title="Bookmark"
                    onClick={bookmarkSelectedMessages}
                >

                    <Bookmark size={20} />

                </button>


                {/* ================================= */}
                {/* Delete */}
                {/* ================================= */}

                <button
                    type="button"
                    className="toolbar-btn delete"
                    title="Delete"
                    onClick={deleteSelectedMessages}
                >

                    <Trash2 size={20} />

                </button>


            </div>

        </header>

    );

}

export default SelectionToolbar;

