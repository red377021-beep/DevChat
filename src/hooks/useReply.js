import { useState } from "react";

function useReply() {

    const [replyMessage, setReplyMessage] = useState(null);

    const startReply = (message) => {

        setReplyMessage(message);

    };

    const cancelReply = () => {

        setReplyMessage(null);

    };

    return {

        replyMessage,

        startReply,

        cancelReply

    };

}

export default useReply;