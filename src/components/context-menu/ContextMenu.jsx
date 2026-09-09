import { useEffect, useRef } from "react";
import {
    Reply,
    Pencil,
    Copy,
    Trash2,
    Forward,
    Pin,
    CheckSquare
} from "lucide-react";

import { useChat } from "../../context/ChatContext";
import ReactionPicker from "../ReactionPicker";
import "./ContextMenu.css";

function ContextMenu() {

    const {

    contextMenu,
    closeContextMenu,

    setReplyMessage,
    setEditMessage,

    openDeleteModal,

    toggleReaction,

    toggleMessageSelection,
    setSelectionMode

} = useChat();

    const wrapperRef = useRef(null);

    // ==========================================
    // Outside Click
    // ==========================================

    useEffect(() => {

        function handleClick(e) {

            if (

                wrapperRef.current &&
                !wrapperRef.current.contains(e.target)

            ) {

                closeContextMenu();

            }

        }

        document.addEventListener("mousedown", handleClick);

        return () => {

            document.removeEventListener(

                "mousedown",
                handleClick

            );

        };

    }, [closeContextMenu]);

    // ==========================================
    // ESC
    // ==========================================

    useEffect(() => {

        function handleEsc(e) {

            if (e.key === "Escape") {

                closeContextMenu();

            }

        }

        document.addEventListener("keydown", handleEsc);

        return () => {

            document.removeEventListener(

                "keydown",
                handleEsc

            );

        };

    }, [closeContextMenu]);

    if (!contextMenu.visible || !contextMenu.message) return null;

    // ==========================================
    // Smart Position
    // ==========================================

    const MENU_WIDTH = 250;
    const MENU_HEIGHT = 330;

    let left = contextMenu.x;
    let top = contextMenu.y;

    if (left + MENU_WIDTH > window.innerWidth) {

        left = window.innerWidth - MENU_WIDTH - 12;

    }

    if (top + MENU_HEIGHT > window.innerHeight) {

        top = window.innerHeight - MENU_HEIGHT - 12;

    }

    if (left < 12) left = 12;
    if (top < 12) top = 12;

    // ==========================================
    // Actions
    // ==========================================

    function handleReply() {

        setReplyMessage(contextMenu.message);

        closeContextMenu();

    }

    function handleEdit() {

        setEditMessage(contextMenu.message);

        closeContextMenu();

    }

    async function handleCopy() {

        if (!contextMenu.message.text) return;

        await navigator.clipboard.writeText(

            contextMenu.message.text

        );

        closeContextMenu();

    }

    <button
    className="message-action"

    onClick={() => {


        closeContextMenu();

    }}

>

    Select

</button>

    function handleDelete() {

        openDeleteModal(contextMenu.message);

        closeContextMenu();

    }

    function handleSelect(){

    setSelectionMode(true);

    toggleMessageSelection(

        contextMenu.message.id

    );

    closeContextMenu();

}

   function handleReaction(emoji) {

    toggleReaction?.(

        contextMenu.message.id,

        emoji

    );

}

    return (

        <div

            ref={wrapperRef}

            className="context-wrapper"

            style={{

                left,
                top

            }}

        >

           <div className="context-reaction-card">

    <ReactionPicker

        onSelect={handleReaction}

        onClose={closeContextMenu}

    />

</div>

            <div className="context-menu">

                <button onClick={handleReply}>

                    <Reply size={18}/>

                    <span>Reply</span>

                </button>

                {

                    contextMenu.message.own && (

                        <button onClick={handleEdit}>

                            <Pencil size={18}/>

                            <span>Edit</span>

                        </button>

                    )

                }

                {

                    contextMenu.message.text && (

                        <button onClick={handleCopy}>

                            <Copy size={18}/>

                            <span>Copy</span>

                        </button>

                    )

                }

                <button>

                    <Forward size={18}/>

                    <span>Forward (Soon)</span>

                </button>

                <button>

                    <Pin size={18}/>

                    <span>Pin (Soon)</span>

                </button>

                <button

    onClick={handleSelect}

>

    <CheckSquare size={18}/>

    <span>Select</span>

</button>

                <button

                    className="delete-btn"

                    onClick={handleDelete}

                >

                    <Trash2 size={18}/>

                    <span>Delete</span>

                </button>

            </div>

        </div>

    );

}

export default ContextMenu;