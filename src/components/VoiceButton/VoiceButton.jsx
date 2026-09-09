import { Mic } from "lucide-react";
import IconButton from "../IconButton";

function VoiceButton({ onClick }) {

    return (

        <IconButton

            icon={Mic}

            title="Voice"

            onClick={onClick}

        />

    );

}

export default VoiceButton;