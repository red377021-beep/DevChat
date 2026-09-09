export function replyMessage(message, setReplyMessage, closeContextMenu) {

    setReplyMessage(message);

    closeContextMenu();

}

export function copyMessage(message, closeContextMenu) {

    navigator.clipboard.writeText(message.text);

    closeContextMenu();

}

export function editMessage(message) {

    console.log(message);

}

export function deleteMessage(message) {

    console.log(message);

}

export function forwardMessage(message) {

    console.log(message);

}

export function pinMessage(message) {

    console.log(message);

}

export function bookmarkMessage(message) {

    console.log(message);

}

export function translateMessage(message) {

    console.log(message);

}

export function messageInfo(message) {

    console.log(message);

}