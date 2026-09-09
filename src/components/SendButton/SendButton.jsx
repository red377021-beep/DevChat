import "./SendButton.css";
import { SendHorizontal } from "lucide-react";

function SendButton({ onClick }) {

    return (

        <button

            type="button"

            className="send-button"

            onClick={onClick}

        >

            <SendHorizontal size={20} />

        </button>

    );

}

export default SendButton;