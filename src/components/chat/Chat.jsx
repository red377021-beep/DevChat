import "./Chat.css";

import ChatHeader from "../ChatHeader/ChatHeader";
import SelectionToolbar from "../SelectionToolbar/SelectionToolbar";
import Messages from "../Messages/Messages";
import MessageInput from "../MessageInput/MessageInput";
import PinnedMessageBar from "../PinnedMessageBar/PinnedMessageBar";
import TranslatePanel from "../Translate/TranslatePanel";

import { useChat } from "../../context/ChatContext";

function Chat() {
    const {
        selectionMode
    } = useChat();

    return (
        <section className="chat">

            {/* =========================================
                HEADER
            ========================================= */}

            {selectionMode ? (
                <SelectionToolbar />
            ) : (
                <>
                    <ChatHeader />

                    <PinnedMessageBar />

                    <TranslatePanel />
                </>
            )}


            {/* =========================================
                MESSAGE AREA
            ========================================= */}

            <main className="chat-body">
                <Messages />
            </main>


            {/* =========================================
                MESSAGE INPUT
            ========================================= */}

            <MessageInput />

        </section>
    );
}

export default Chat;