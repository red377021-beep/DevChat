import "./Messages.css";

import { useEffect, useRef } from "react";

import { useChat } from "../../context/ChatContext";

import DateDivider from "../DateDivider/DateDivider";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import MessageBubble from "../MessageBubble/MessageBubble";
import MessageContextMenu from "../MessageContextMenu";

function Messages() {

    const {

        messages,
        contextMenu,
        openContextMenu,
        closeContextMenu

    } = useChat();

    const bottomRef = useRef(null);

    useEffect(() => {

        function handleClose() {

            closeContextMenu();

        }

        window.addEventListener("click", handleClose);

        return () => {

            window.removeEventListener("click", handleClose);

        };

    }, [closeContextMenu]);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({

            behavior: "smooth"

        });

    }, [messages]);

    // ===========================
    // Smart Context Menu Position
    // ===========================

    const MENU_WIDTH = 240;
    const MENU_HEIGHT = 390;
    const GAP = 8;

    let menuX = contextMenu.x;
    let menuY = contextMenu.y;

    // Right Edge

    if (menuX + MENU_WIDTH > window.innerWidth) {

        menuX = window.innerWidth - MENU_WIDTH - 10;

    }

    // Left Edge

    if (menuX < 10) {

        menuX = 10;

    }

    // Bottom Check

    const spaceBelow = window.innerHeight - contextMenu.y;

    if (spaceBelow < MENU_HEIGHT) {

        // Cursor ke upar open hoga

        menuY = contextMenu.y - MENU_HEIGHT - GAP;

    } else {

        // Cursor ke niche

        menuY = contextMenu.y + GAP;

    }

    // Agar upar bhi space kam ho

    if (menuY < 10) {

        menuY = 10;

    }

    return (

        <div className="messages">

            <DateDivider label="Today" />

            {

                messages.map((message) => (

                    <MessageBubble

                        key={message.id}

                        message={message}

                        onContextMenu={openContextMenu}

                    />

                ))

            }

            <TypingIndicator />

            <div ref={bottomRef}></div>

            {

                contextMenu.visible && (

                    <div

                        style={{

                            position: "fixed",

                            left: menuX,

                            top: menuY,

                            zIndex: 999999

                        }}

                    >

                        <MessageContextMenu />

                    </div>

                )

            }

        </div>

    );

}

export default Messages;