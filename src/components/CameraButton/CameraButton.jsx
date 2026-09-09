import { Camera } from "lucide-react";
import IconButton from "../IconButton";

function CameraButton({ onClick }) {

    return (

        <IconButton

            icon={Camera}

            title="Camera"

            onClick={onClick}

        />

    );

}

export default CameraButton;