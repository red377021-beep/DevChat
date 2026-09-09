import "./GroupMessageInput.css";

import {
    Smile,
    Paperclip,
    Mic,
    Send,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";


function GroupMessageInput({
    onSend,
    replyMessage = null,
    onCancelReply,
    disabled = false,
}) {

    const [text, setText] = useState("");

    const inputRef = useRef(null);


    // =====================================================
    // FOCUS INPUT WHEN REPLY OPENS
    // =====================================================

    useEffect(() => {

        if (replyMessage && !disabled) {
            inputRef.current?.focus();
        }

    }, [replyMessage, disabled]);


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const handleSubmit = (event) => {

        event?.preventDefault();

        if (disabled) {
            return;
        }

        const cleanText = text.trim();

        if (!cleanText) {
            return;
        }

        onSend?.(cleanText);

        setText("");

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

    };


    // =====================================================
    // KEYBOARD
    // =====================================================

    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            handleSubmit(event);

        }

    };


    // =====================================================
    // TEXT CHANGE
    // =====================================================

    const handleChange = (event) => {

        setText(event.target.value);

    };


    // =====================================================
    // ATTACHMENT
    // =====================================================

    const handleAttachment = () => {

        if (disabled) {
            return;
        }

        console.log("Group attachment");

    };


    // =====================================================
    // EMOJI
    // =====================================================

    const handleEmoji = () => {

        if (disabled) {
            return;
        }

        setText((previous) => `${previous}😊`);

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

    };


    // =====================================================
    // VOICE
    // =====================================================

    const handleVoice = () => {

        if (disabled) {
            return;
        }

        console.log("Group voice message");

    };


    // =====================================================
    // CANCEL REPLY
    // =====================================================

    const handleCancelReply = () => {

        onCancelReply?.();

        requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

    };


    const hasText = Boolean(text.trim());


    return (
        <div className="group-message-input-wrapper">

            {/* =====================================================
                REPLY PREVIEW
            ===================================================== */}

            {replyMessage && (
                <div className="group-input-reply">

                    <div className="group-input-reply-accent" />

                    <div className="group-input-reply-content">

                        <span>
                            Replying to{" "}
                            {replyMessage?.senderName || "Member"}
                        </span>

                        <p>
                            {replyMessage?.text || "Message"}
                        </p>

                    </div>

                    <button
                        type="button"
                        className="group-input-reply-close"
                        onClick={handleCancelReply}
                        disabled={disabled}
                        aria-label="Cancel reply"
                        title="Cancel reply"
                    >
                        <X size={16} />
                    </button>

                </div>
            )}


            {/* =====================================================
                MESSAGE INPUT
            ===================================================== */}

            <form
                className="group-message-input"
                onSubmit={handleSubmit}
            >

                {/* ATTACHMENT */}

                <button
                    type="button"
                    className="group-input-button"
                    onClick={handleAttachment}
                    disabled={disabled}
                    aria-label="Attach file"
                    title="Attach file"
                >
                    <Paperclip size={19} />
                </button>


                {/* EMOJI */}

                <button
                    type="button"
                    className="group-input-button"
                    onClick={handleEmoji}
                    disabled={disabled}
                    aria-label="Add emoji"
                    title="Emoji"
                >
                    <Smile size={19} />
                </button>


                {/* TEXTAREA */}

                <textarea
                    ref={inputRef}
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        disabled
                            ? "Messaging is disabled"
                            : "Write a message..."
                    }
                    rows={1}
                    disabled={disabled}
                    maxLength={5000}
                    aria-label="Group message"
                />


                {/* SEND / MIC */}

                {hasText ? (

                    <button
                        type="submit"
                        className="group-send-button"
                        disabled={disabled}
                        aria-label="Send message"
                        title="Send message"
                    >
                        <Send size={18} />
                    </button>

                ) : (

                    <button
                        type="button"
                        className="group-input-button group-mic-button"
                        onClick={handleVoice}
                        disabled={disabled}
                        aria-label="Voice message"
                        title="Voice message"
                    >
                        <Mic size={19} />
                    </button>

                )}

            </form>

        </div>
    );
}


export default GroupMessageInput;