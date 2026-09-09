import { Paperclip } from "lucide-react";
import IconButton from "../IconButton";

function AttachmentButton({ onClick }) {

    return (

        <IconButton

            icon={Paperclip}

            title="Attachment"

            onClick={onClick}

        />

    );

}

export default AttachmentButton;