import "./AIInput.css";

import {
    Paperclip,
    Smile,
    Mic,
    Send,
    X,
} from "lucide-react";

import { useRef, useState } from "react";


function AIInput({
    onSend,
    onAttach,
    onVoice,
    disabled = false,
}) {

    const [value, setValue] = useState("");
    const textareaRef = useRef(null);


    const handleChange = (event) => {

        const nextValue = event.target.value;

        setValue(nextValue);

        const textarea = textareaRef.current;

        if (textarea) {
            textarea.style.height = "auto";

            textarea.style.height =
                `${Math.min(textarea.scrollHeight, 140)}px`;
        }
    };


    const handleSend = () => {

        const text = value.trim();

        if (!text || disabled) return;

        if (onSend) {
            onSend(text);
        }

        setValue("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };


    const handleKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            handleSend();
        }
    };


    const clearInput = () => {

        setValue("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };


    return (
        <div className="ai-input">

            <div className="ai-input__box">

                {/* ATTACH */}
                <button
                    type="button"
                    className="ai-input__button"
                    onClick={onAttach}
                    disabled={disabled}
                    aria-label="Attach file"
                >
                    <Paperclip size={19} />
                </button>


                {/* TEXTAREA */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Message DevChat AI..."
                    rows={1}
                    disabled={disabled}
                    aria-label="Message DevChat AI"
                />


                {/* CLEAR */}
                {value && (
                    <button
                        type="button"
                        className="ai-input__clear"
                        onClick={clearInput}
                        disabled={disabled}
                        aria-label="Clear message"
                    >
                        <X size={15} />
                    </button>
                )}


                {/* EMOJI */}
                <button
                    type="button"
                    className="ai-input__button ai-input__emoji"
                    onClick={() => {
                        setValue((current) => `${current} 😊`);
                    }}
                    disabled={disabled}
                    aria-label="Add emoji"
                >
                    <Smile size={19} />
                </button>


                {/* VOICE */}
                {!value.trim() && (
                    <button
                        type="button"
                        className="ai-input__button"
                        onClick={onVoice}
                        disabled={disabled}
                        aria-label="Voice input"
                    >
                        <Mic size={19} />
                    </button>
                )}


                {/* SEND */}
                {value.trim() && (
                    <button
                        type="button"
                        className="ai-input__send"
                        onClick={handleSend}
                        disabled={disabled}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                )}

            </div>


            <p className="ai-input__hint">
                AI can make mistakes. Check important information.
            </p>

        </div>
    );
}


export default AIInput;