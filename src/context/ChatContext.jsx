// ==========================================================
// DEVCHAT CHAT CONTEXT
// ==========================================================

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import {
    messageAPI,
    attachmentAPI
} from "../utils/api";

import socket from "../utils/socket";


// ==========================================================
// CONTEXT
// ==========================================================

const ChatContext = createContext(null);


// ==========================================================
// MESSAGE FACTORY
// ==========================================================

function createMessage(data = {}) {

    return {
        id: data.id ?? Date.now(),

        clientId: data.clientId ?? null,

        pending: data.pending ?? false,

        failed: data.failed ?? false,

        own: data.own ?? true,

        text: data.text ?? "",

        time:
            data.time ??
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        seen: data.seen ?? false,

        deleted: data.deleted ?? false,

        deletedForEveryone:
            data.deletedForEveryone ?? false,

        deletedAt:
            data.deletedAt ?? null,

        edited: data.edited ?? false,

        reply: data.reply ?? null,

        images:
            Array.isArray(data.images)
                ? data.images
                : [],

        video:
            Array.isArray(data.video)
                ? data.video
                : [],

        file: data.file ?? null,

        audio: data.audio ?? null,

        blob: data.blob ?? null,

        duration: data.duration ?? null,

        location: data.location ?? null,

        contact: data.contact ?? null,

        reactions:
            Array.isArray(data.reactions)
                ? data.reactions
                : [],

        sender: data.sender ?? null,

        senderId: data.senderId ?? null,

        conversationId:
            data.conversationId ?? null,

        messageType:
            data.messageType ?? "text"
    };

}


// ==========================================================
// NORMALIZE DATABASE MESSAGE
// ==========================================================

function normalizeServerMessage(
    serverMessage,
    currentUserId
) {

    if (!serverMessage) {
        return null;
    }


    const createdAt =
        serverMessage.created_at
            ? new Date(serverMessage.created_at)
            : new Date();


    const time =
        createdAt.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    let parsedContent = null;

    let text =
        serverMessage.content || "";

    let attachments = [];

    let location = null;

    let contact = null;

    let reply = null;

    let duration = null;

    let clientId = null;


    if (
        typeof serverMessage.content ===
        "string"
    ) {

        try {

            const parsed =
                JSON.parse(
                    serverMessage.content
                );


            if (
                parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
            ) {

                parsedContent = parsed;

            }

        } catch {

            parsedContent = null;

        }

    }


    if (parsedContent) {

        text =
            parsedContent.text || "";


        attachments =
            Array.isArray(
                parsedContent.attachments
            )
                ? parsedContent.attachments
                : [];


        location =
            parsedContent.location ||
            null;


        contact =
            parsedContent.contact ||
            null;


        reply =
            parsedContent.reply ||
            null;


        duration =
            parsedContent.duration ??
            null;


        clientId =
            parsedContent.clientId ||
            null;

    }


    const images =
        attachments
            .filter(
                attachment =>
                    attachment?.kind === "image"
            )
            .map(
                attachment =>
                    attachment.url
            )
            .filter(Boolean);


    const videos =
        attachments
            .filter(
                attachment =>
                    attachment?.kind === "video"
            )
            .map(
                attachment =>
                    attachment.url
            )
            .filter(Boolean);


    const audioAttachment =
        attachments.find(
            attachment =>
                attachment?.kind === "audio"
        );


    const audio =
        audioAttachment?.url ||
        null;


    const fileAttachment =
        attachments.find(
            attachment =>
                attachment?.kind === "file"
        );


    const file =
        fileAttachment
            ? {

                url:
                    fileAttachment.url ||
                    "",

                path:
                    fileAttachment.path ||
                    null,

                name:
                    fileAttachment.name ||
                    "File",

                type:
                    fileAttachment.type ||
                    "",

                size:
                    fileAttachment.size ||
                    0

            }
            : null;


    let messageType =
        serverMessage.message_type ||
        "text";


    if (
        messageType === "attachment"
    ) {

        if (images.length) {

            messageType = "image";

        }

        else if (videos.length) {

            messageType = "video";

        }

        else if (audio) {

            messageType = "audio";

        }

        else if (file) {

            messageType = "file";

        }

        else if (location) {

            messageType = "location";

        }

        else if (contact) {

            messageType = "contact";

        }

    }


    return createMessage({

        id:
            serverMessage.id,

        clientId,

        pending: false,

        failed: false,

        own:
            String(serverMessage.sender_id) ===
            String(currentUserId),

        text,

        time,

        seen: true,

        deleted:
            Boolean(
                serverMessage.deleted_at
            ),

        deletedForEveryone:
            Boolean(
                serverMessage.deleted_at
            ),

        deletedAt:
            serverMessage.deleted_at
                ? new Date(
                    serverMessage.deleted_at
                ).getTime()
                : null,

        edited:
            Boolean(
                serverMessage.edited_at
            ),

        reply,

        images,

        video: videos,

        file,

        audio,

        blob: null,

        duration,

        location,

        contact,

        reactions: [],

        sender:
            serverMessage.sender ||
            null,

        senderId:
            serverMessage.sender_id,

        conversationId:
            serverMessage.conversation_id,

        messageType

    });

}


// ==========================================================
// PROVIDER
// ==========================================================

export function ChatProvider({
    children
}) {


    // ======================================================
    // CURRENT CHAT
    // ======================================================

    const [
        selectedChat,
        setSelectedChat
    ] = useState(null);


    // ======================================================
    // MESSAGES
    // ======================================================

    const [
        messages,
        setMessages
    ] = useState([]);


    const [
        messagesLoading,
        setMessagesLoading
    ] = useState(false);


    const [
        messagesError,
        setMessagesError
    ] = useState("");


    // ======================================================
    // PENDING ATTACHMENT QUEUE
    // ======================================================

    const pendingJobsRef =
        useRef([]);


    const processingQueueRef =
        useRef(false);


    // ======================================================
    // CURRENT USER
    // ======================================================

    function getCurrentUserId() {

        try {

            const storedUser =
                localStorage.getItem(
                    "devchat_user"
                );


            if (!storedUser) {
                return null;
            }


            const user =
                JSON.parse(
                    storedUser
                );


            return (
                user?.id ||
                user?.userId ||
                null
            );

        } catch (error) {

            console.error(
                "Failed to read current user:",
                error
            );

            return null;

        }

    }


    // ======================================================
    // CONVERSATION ID
    // ======================================================

    function getConversationId(chat) {

        if (!chat) {
            return null;
        }


        return (
            chat.conversationId ||
            chat.conversation_id ||
            (
                chat.type === "private"
                    ? chat.id
                    : null
            )
        );

    }


    // ======================================================
    // SELECTION
    // ======================================================

    const [
        selectionMode,
        setSelectionMode
    ] = useState(false);


    const [
        selectedMessages,
        setSelectedMessages
    ] = useState([]);


    function clearSelection() {

        setSelectionMode(false);

        setSelectedMessages([]);

    }


    function startSelection(messageId) {

        if (
            messageId === null ||
            messageId === undefined
        ) {
            return;
        }


        setSelectionMode(true);

        setSelectedMessages([
            messageId
        ]);

        closeContextMenu();

    }


    function toggleMessageSelection(messageId) {

        if (
            messageId === null ||
            messageId === undefined
        ) {
            return;
        }


        setSelectedMessages(prev => {

            const exists =
                prev.includes(messageId);


            const updated =
                exists
                    ? prev.filter(
                        id =>
                            id !== messageId
                    )
                    : [
                        ...prev,
                        messageId
                    ];


            setSelectionMode(
                updated.length > 0
            );


            return updated;

        });

    }


    function selectAllMessages() {

        const allIds =
            messages.map(
                message =>
                    message.id
            );


        if (!allIds.length) {

            clearSelection();

            return;

        }


        const allSelected =
            selectedMessages.length ===
            allIds.length;


        if (allSelected) {

            clearSelection();

            return;

        }


        setSelectionMode(true);

        setSelectedMessages(
            allIds
        );

    }


    // ======================================================
    // CONTEXT MENU
    // ======================================================

    const [
        contextMenu,
        setContextMenu
    ] = useState({

        visible: false,

        x: 0,

        y: 0,

        message: null

    });


    function openContextMenu(
        event,
        message
    ) {

        if (
            !event ||
            !message
        ) {
            return;
        }


        event.preventDefault();


        const menuWidth = 260;

        const menuHeight = 420;

        const padding = 10;


        let x =
            event.clientX;


        let y =
            event.clientY;


        if (
            x + menuWidth >
            window.innerWidth
        ) {

            x =
                window.innerWidth -
                menuWidth -
                padding;

        }


        if (
            y + menuHeight >
            window.innerHeight
        ) {

            y =
                window.innerHeight -
                menuHeight -
                padding;

        }


        x =
            Math.max(
                padding,
                x
            );


        y =
            Math.max(
                padding,
                y
            );


        setContextMenu({

            visible: true,

            x,

            y,

            message

        });

    }


    function closeContextMenu() {

        setContextMenu({

            visible: false,

            x: 0,

            y: 0,

            message: null

        });

    }


    // ======================================================
    // DELETE MODAL
    // ======================================================

    const [
        deleteModalOpen,
        setDeleteModalOpen
    ] = useState(false);


    const [
        deleteMessage,
        setDeleteMessage
    ] = useState(null);


    function openDeleteModal(
        messageOrMessages
    ) {

        if (!messageOrMessages) {
            return;
        }


        setDeleteMessage(
            messageOrMessages
        );


        setDeleteModalOpen(true);

    }


    function closeDeleteModal() {

        setDeleteModalOpen(false);

        setDeleteMessage(null);

    }


    // ======================================================
    // MESSAGE INFO
    // ======================================================

    const [
        messageInfo,
        setMessageInfo
    ] = useState(null);


    function openMessageInfo(message) {

        if (!message) {
            return;
        }


        setMessageInfo(message);

    }


    function closeMessageInfo() {

        setMessageInfo(null);

    }


    // ======================================================
    // RIGHT PANEL
    // ======================================================

    const [
        rightPanelOpen,
        setRightPanelOpen
    ] = useState(false);


    function toggleRightPanel() {

        setRightPanelOpen(
            prev => !prev
        );

    }


    function closeRightPanel() {

        setRightPanelOpen(false);

    }


    // ======================================================
    // REPLY / EDIT
    // ======================================================

    const [
        replyMessage,
        setReplyMessage
    ] = useState(null);


    const [
        editMessage,
        setEditMessage
    ] = useState(null);


    function startReply(message) {

        if (
            !message ||
            message.deleted
        ) {
            return;
        }


        setReplyMessage(message);

        setEditMessage(null);

    }


    function cancelReply() {

        setReplyMessage(null);

    }


    function startEdit(message) {

        if (
            !message ||
            message.deleted
        ) {
            return;
        }


        if (!message.own) {
            return;
        }


        setEditMessage(message);

        setReplyMessage(null);

    }


    function cancelEdit() {

        setEditMessage(null);

    }


    // ======================================================
    // LOAD MESSAGES
    // ======================================================

    async function loadMessages(
        chat = selectedChat
    ) {

        const conversationId =
            getConversationId(chat);


        if (!conversationId) {

            setMessages([]);

            setMessagesError("");

            setMessagesLoading(false);

            return;

        }


        setMessagesLoading(true);

        setMessagesError("");


        try {

            const response =
                await messageAPI.getMessages(
                    conversationId
                );


            const currentUserId =
                getCurrentUserId();


            const serverMessages =
                Array.isArray(
                    response?.messages
                )
                    ? response.messages
                    : [];


            const normalizedMessages =
                serverMessages
                    .map(
                        message =>
                            normalizeServerMessage(
                                message,
                                currentUserId
                            )
                    )
                    .filter(Boolean);


            setMessages(
                normalizedMessages
            );

        } catch (error) {

            console.error(
                "Load messages error:",
                error
            );


            setMessages([]);

            setMessagesError(
                error?.message ||
                "Failed to load messages"
            );

        } finally {

            setMessagesLoading(false);

        }

    }


    // ======================================================
    // LOAD WHEN CHAT CHANGES
    // ======================================================

    useEffect(() => {

        let cancelled = false;


        async function loadSelectedChatMessages() {

            const conversationId =
                getConversationId(
                    selectedChat
                );


            if (!conversationId) {

                if (!cancelled) {

                    setMessages([]);

                    setMessagesError("");

                    setMessagesLoading(false);

                }

                return;

            }


            if (!cancelled) {

                setMessagesLoading(true);

                setMessagesError("");

            }


            try {

                const response =
                    await messageAPI.getMessages(
                        conversationId
                    );


                if (cancelled) {
                    return;
                }


                const currentUserId =
                    getCurrentUserId();


                const serverMessages =
                    Array.isArray(
                        response?.messages
                    )
                        ? response.messages
                        : [];


                const normalizedMessages =
                    serverMessages
                        .map(
                            message =>
                                normalizeServerMessage(
                                    message,
                                    currentUserId
                                )
                        )
                        .filter(Boolean);


                setMessages(
                    normalizedMessages
                );

            } catch (error) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Load selected chat messages error:",
                    error
                );


                setMessages([]);

                setMessagesError(
                    error?.message ||
                    "Failed to load messages"
                );

            } finally {

                if (!cancelled) {

                    setMessagesLoading(false);

                }

            }

        }


        loadSelectedChatMessages();


        return () => {

            cancelled = true;

        };

    }, [
        selectedChat?.conversationId,
        selectedChat?.conversation_id,
        selectedChat?.id
    ]);


    // ======================================================
    // SELECT CHAT
    // ======================================================

    function selectChat(chat) {

        if (!chat) {
            return;
        }


        setSelectedChat(chat);

        clearSelection();

        closeContextMenu();

        closeDeleteModal();

        closeTranslate();

        clearAllAttachments();

    }


    // ======================================================
    // SOCKET CONNECTION + USER REGISTRATION
    // ======================================================

    useEffect(() => {

        const token =
            localStorage.getItem(
                "devchat_token"
            );


        const userId =
            getCurrentUserId();


        if (
            !token ||
            !userId
        ) {
            return;
        }


        function registerUser() {

            if (!socket.connected) {
                return;
            }


            socket.emit(
                "register_user",
                String(userId)
            );


            console.log(
                "👤 Socket user registered:",
                userId
            );

        }


        if (!socket.connected) {

            socket.connect();

        }


        if (socket.connected) {

            registerUser();

        }


        socket.on(
            "connect",
            registerUser
        );


        return () => {

            socket.off(
                "connect",
                registerUser
            );

        };

    }, []);


    // ======================================================
    // SOCKET NEW MESSAGE
    // ======================================================

    useEffect(() => {

        function handleNewMessage(
            serverMessage
        ) {

            if (!serverMessage) {
                return;
            }


            const currentConversationId =
                getConversationId(
                    selectedChat
                );


            const incomingConversationId =
                serverMessage.conversation_id ||
                serverMessage.conversationId;


            if (
                !currentConversationId ||
                String(currentConversationId) !==
                String(incomingConversationId)
            ) {
                return;
            }


            const currentUserId =
                getCurrentUserId();


            const normalizedMessage =
                normalizeServerMessage(
                    serverMessage,
                    currentUserId
                );


            if (!normalizedMessage) {
                return;
            }


            setMessages(prev => {

                if (
                    normalizedMessage.clientId
                ) {

                    const optimisticIndex =
                        prev.findIndex(
                            message =>
                                message.clientId ===
                                normalizedMessage.clientId
                        );


                    if (
                        optimisticIndex !==
                        -1
                    ) {

                        const updated = [
                            ...prev
                        ];


                        updated[
                            optimisticIndex
                        ] =
                            normalizedMessage;


                        return updated;

                    }

                }


                const alreadyExists =
                    prev.some(
                        message =>
                            String(message.id) ===
                            String(normalizedMessage.id)
                    );


                if (alreadyExists) {
                    return prev;
                }


                return [
                    ...prev,
                    normalizedMessage
                ];

            });

        }


        socket.on(
            "new_message",
            handleNewMessage
        );


        socket.on(
            "message:new",
            handleNewMessage
        );


        return () => {

            socket.off(
                "new_message",
                handleNewMessage
            );


            socket.off(
                "message:new",
                handleNewMessage
            );

        };

    }, [
        selectedChat?.conversationId,
        selectedChat?.conversation_id,
        selectedChat?.id
    ]);


    // ======================================================
    // JOIN CONVERSATION
    // ======================================================

    useEffect(() => {

        const conversationId =
            getConversationId(
                selectedChat
            );


        if (!conversationId) {
            return;
        }


        function joinConversation() {

            if (!socket.connected) {
                return;
            }


            socket.emit(
                "join_conversation",
                {
                    conversationId
                }
            );

        }


        if (socket.connected) {

            joinConversation();

        }


        socket.on(
            "connect",
            joinConversation
        );


        return () => {

            socket.off(
                "connect",
                joinConversation
            );

        };

    }, [
        selectedChat?.conversationId,
        selectedChat?.conversation_id,
        selectedChat?.id
    ]);


    // ======================================================
    // REMOVE MESSAGE
    // ======================================================

    function removeMessage(ids) {

        if (
            ids === null ||
            ids === undefined
        ) {
            return;
        }


        const messageIds =
            Array.isArray(ids)
                ? ids
                : [ids];


        if (!messageIds.length) {
            return;
        }


        setMessages(prev =>
            prev.map(message => {

                if (
                    !messageIds.includes(
                        message.id
                    )
                ) {
                    return message;
                }


                return {

                    ...message,

                    deleted: true,

                    deletedForEveryone: true,

                    deletedAt: Date.now(),

                    text: "",

                    images: [],

                    video: [],

                    file: null,

                    audio: null,

                    blob: null,

                    duration: null,

                    location: null,

                    contact: null,

                    reply: null,

                    reactions: []

                };

            })
        );


        clearSelection();

        closeContextMenu();

        closeDeleteModal();

    }


    // ======================================================
    // COPY
    // ======================================================

    async function copySelectedMessages() {

        if (!selectedMessages.length) {
            return;
        }


        const text =
            messages
                .filter(
                    message =>
                        selectedMessages.includes(
                            message.id
                        )
                )
                .map(
                    message =>
                        message.text
                )
                .filter(Boolean)
                .join("\n");


        if (!text) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                text
            );

        } catch (error) {

            console.error(
                "Copy failed:",
                error
            );

        }

    }


    // ======================================================
    // STARRED
    // ======================================================

    const [
        starredMessages,
        setStarredMessages
    ] = useState([]);


    function toggleStarMessage(messageId) {

        if (
            messageId === null ||
            messageId === undefined
        ) {
            return;
        }


        setStarredMessages(prev => {

            const current =
                Array.isArray(prev)
                    ? prev
                    : [];


            if (
                current.includes(
                    messageId
                )
            ) {

                return current.filter(
                    id =>
                        id !== messageId
                );

            }


            return [
                ...current,
                messageId
            ];

        });

    }


    function starSelectedMessages() {

        if (!selectedMessages.length) {
            return;
        }


        setStarredMessages(prev => {

            const current =
                Array.isArray(prev)
                    ? prev
                    : [];


            const allStarred =
                selectedMessages.every(
                    id =>
                        current.includes(id)
                );


            if (allStarred) {

                return current.filter(
                    id =>
                        !selectedMessages.includes(
                            id
                        )
                );

            }


            return [
                ...current,
                ...selectedMessages.filter(
                    id =>
                        !current.includes(id)
                )
            ];

        });


        clearSelection();

    }


    // ======================================================
    // PINNED
    // ======================================================

    const [
        pinnedMessages,
        setPinnedMessages
    ] = useState([]);


    function pinSelectedMessages() {

        if (!selectedMessages.length) {
            return;
        }


        setPinnedMessages(prev => {

            const current =
                Array.isArray(prev)
                    ? prev
                    : [];


            const currentIds =
                current.map(
                    message =>
                        message.id
                );


            const allPinned =
                selectedMessages.every(
                    id =>
                        currentIds.includes(id)
                );


            if (allPinned) {

                return current.filter(
                    message =>
                        !selectedMessages.includes(
                            message.id
                        )
                );

            }


            const messagesToPin =
                messages.filter(
                    message =>
                        selectedMessages.includes(
                            message.id
                        ) &&
                        !currentIds.includes(
                            message.id
                        )
                );


            return [
                ...current,
                ...messagesToPin
            ];

        });


        clearSelection();

    }


    // ======================================================
    // BOOKMARKS
    // ======================================================

    const [
        bookmarkedMessages,
        setBookmarkedMessages
    ] = useState([]);


    function toggleBookmarkMessage(message) {

        if (!message) {
            return;
        }


        setBookmarkedMessages(prev => {

            const current =
                Array.isArray(prev)
                    ? prev
                    : [];


            const exists =
                current.some(
                    item =>
                        item.id ===
                        message.id
                );


            if (exists) {

                return current.filter(
                    item =>
                        item.id !==
                        message.id
                );

            }


            return [
                ...current,
                message
            ];

        });

    }


    function bookmarkSelectedMessages() {

        if (!selectedMessages.length) {
            return;
        }


        setBookmarkedMessages(prev => {

            const current =
                Array.isArray(prev)
                    ? prev
                    : [];


            const currentIds =
                current.map(
                    message =>
                        message.id
                );


            const allBookmarked =
                selectedMessages.every(
                    id =>
                        currentIds.includes(id)
                );


            if (allBookmarked) {

                return current.filter(
                    message =>
                        !selectedMessages.includes(
                            message.id
                        )
                );

            }


            const messagesToBookmark =
                messages.filter(
                    message =>
                        selectedMessages.includes(
                            message.id
                        ) &&
                        !currentIds.includes(
                            message.id
                        )
                );


            return [
                ...current,
                ...messagesToBookmark
            ];

        });


        clearSelection();

    }


    // ======================================================
    // FORWARD
    // ======================================================

    const [
        forwardMessages,
        setForwardMessages
    ] = useState([]);


    function forwardMessage(message) {

        if (
            !message ||
            message.deleted
        ) {
            return;
        }


        setForwardMessages([
            message
        ]);

    }


    function forwardSelectedMessages() {

        if (!selectedMessages.length) {
            return;
        }


        const selected =
            messages.filter(
                message =>
                    selectedMessages.includes(
                        message.id
                    )
            );


        if (!selected.length) {
            return;
        }


        setForwardMessages(
            selected
        );


        clearSelection();

    }


    function clearForwardMessages() {

        setForwardMessages([]);

    }


    // ======================================================
    // MUTE
    // ======================================================

    const [
        muteNotifications,
        setMuteNotifications
    ] = useState(false);


    const [
        muteDuration,
        setMuteDuration
    ] = useState(null);


    const [
        muteUntil,
        setMuteUntil
    ] = useState(null);


    function muteChat(duration) {

        if (!duration) {
            return;
        }


        if (
            duration === "always"
        ) {

            setMuteNotifications(true);

            setMuteDuration("always");

            setMuteUntil(null);

            return;

        }


        const durations = {

            "1h":
                60 *
                60 *
                1000,

            "8h":
                8 *
                60 *
                60 *
                1000,

            "1w":
                7 *
                24 *
                60 *
                60 *
                1000

        };


        const milliseconds =
            durations[duration];


        if (!milliseconds) {
            return;
        }


        setMuteNotifications(true);

        setMuteDuration(duration);

        setMuteUntil(
            Date.now() +
            milliseconds
        );

    }


    function muteChatCustom(
        value,
        unit
    ) {

        const amount =
            Number(value);


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return;
        }


        const units = {

            minutes:
                60 *
                1000,

            hours:
                60 *
                60 *
                1000,

            days:
                24 *
                60 *
                60 *
                1000

        };


        const multiplier =
            units[unit];


        if (!multiplier) {
            return;
        }


        setMuteNotifications(true);

        setMuteDuration("custom");

        setMuteUntil(
            Date.now() +
            amount *
            multiplier
        );

    }


    function unmuteChat() {

        setMuteNotifications(false);

        setMuteDuration(null);

        setMuteUntil(null);

    }


    useEffect(() => {

        if (
            !muteNotifications ||
            !muteUntil
        ) {
            return;
        }


        const remaining =
            muteUntil -
            Date.now();


        if (remaining <= 0) {

            unmuteChat();

            return;

        }


        const timer =
            window.setTimeout(
                () => {

                    unmuteChat();

                },
                remaining
            );


        return () =>
            window.clearTimeout(
                timer
            );

    }, [
        muteNotifications,
        muteUntil
    ]);


    // ======================================================
    // ATTACHMENTS
    // ======================================================

    const MAX_IMAGES_PER_MESSAGE = 20;

    const MAX_VIDEOS_PER_MESSAGE = 20;


    const [
        selectedImages,
        setSelectedImages
    ] = useState([]);


    const [
        selectedVideo,
        setSelectedVideo
    ] = useState([]);


    const [
        selectedFile,
        setSelectedFile
    ] = useState(null);


    const [
        selectedAudio,
        setSelectedAudio
    ] = useState(null);


    const [
        selectedLocation,
        setSelectedLocation
    ] = useState(null);


    const [
        selectedContact,
        setSelectedContact
    ] = useState(null);


    // ======================================================
    // LOCATION
    // ======================================================

    function sendLocation() {

        if (!navigator.geolocation) {

            console.error(
                "Geolocation is not supported."
            );

            return;

        }


        const conversationId =
            getConversationId(
                selectedChat
            );


        if (!conversationId) {

            console.error(
                "Conversation ID missing."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            async position => {

                try {

                    const location = {

                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude

                    };


                    const reply =
                        replyMessage
                            ? {

                                id:
                                    replyMessage.id,

                                sender:
                                    replyMessage.own
                                        ? "You"
                                        : (
                                            selectedChat?.name ||
                                            "Unknown"
                                        ),

                                text:
                                    replyMessage.text ||
                                    ""

                            }
                            : null;


                    const content = {

                        text: "",

                        attachments: [],

                        location,

                        contact: null,

                        reply,

                        clientId:
                            `location-${Date.now()}-${Math.random()
                                .toString(36)
                                .slice(2, 10)}`

                    };


                    const response =
                        await messageAPI.sendMessage(

                            conversationId,

                            JSON.stringify(
                                content
                            ),

                            "location"

                        );


                    if (
                        !response?.message
                    ) {

                        throw new Error(
                            "Location message was not returned by server."
                        );

                    }


                    const normalized =
                        normalizeServerMessage(

                            response.message,

                            getCurrentUserId()

                        );


                    if (normalized) {

                        setMessages(prev => {

                            const exists =
                                prev.some(
                                    message =>
                                        message.id ===
                                        normalized.id
                                );


                            if (exists) {
                                return prev;
                            }


                            return [
                                ...prev,
                                normalized
                            ];

                        });

                    }


                    setSelectedLocation(
                        null
                    );

                    setReplyMessage(null);

                    setEditMessage(null);

                } catch (error) {

                    console.error(
                        "Location send error:",
                        error
                    );


                    setMessagesError(
                        error?.message ||
                        "Failed to send location"
                    );

                }

            },

            error => {

                console.error(
                    "Location error:",
                    error
                );


                setMessagesError(
                    "Unable to get your location."
                );

            },

            {

                enableHighAccuracy: true,

                timeout: 10000,

                maximumAge: 0

            }

        );

    }


    // ======================================================
    // ADD IMAGES
    // ======================================================

    function addSelectedImages(files) {

        if (!files?.length) {
            return;
        }


        const imageFiles =
            Array.from(files).filter(
                file =>
                    file?.type?.startsWith(
                        "image/"
                    )
            );


        if (!imageFiles.length) {
            return;
        }


        setSelectedImages(prev => {

            const current =
                Array.isArray(prev)
                    ? prev
                    : [];


            const remaining =
                MAX_IMAGES_PER_MESSAGE -
                current.length;


            if (remaining <= 0) {
                return current;
            }


            return [

                ...current,

                ...imageFiles.slice(
                    0,
                    remaining
                )

            ];

        });

    }


    function removeSelectedImage(index) {

        if (
            typeof index !==
            "number"
        ) {
            return;
        }


        setSelectedImages(prev =>
            prev.filter(
                (_, i) =>
                    i !== index
            )
        );

    }


    function clearSelectedImages() {

        setSelectedImages([]);

    }


    // ======================================================
    // VIDEOS
    // ======================================================

    function addSelectedVideos(files) {

        if (!files?.length) {
            return;
        }


        const videoFiles =
            Array.from(files).filter(
                file =>
                    file?.type?.startsWith(
                        "video/"
                    )
            );


        if (!videoFiles.length) {
            return;
        }


        setSelectedVideo(prev => {

            const current =
                Array.isArray(prev)
                    ? prev
                    : [];


            const remaining =
                MAX_VIDEOS_PER_MESSAGE -
                current.length;


            if (remaining <= 0) {
                return current;
            }


            return [

                ...current,

                ...videoFiles.slice(
                    0,
                    remaining
                )

            ];

        });

    }


    function removeSelectedVideo(index) {

        if (
            typeof index !==
            "number"
        ) {
            return;
        }


        setSelectedVideo(prev =>
            prev.filter(
                (_, i) =>
                    i !== index
            )
        );

    }


    function clearSelectedVideos() {

        setSelectedVideo([]);

    }


    function setAttachmentVideo(file) {

        if (
            !file ||
            !file.type?.startsWith(
                "video/"
            )
        ) {
            return;
        }


        addSelectedVideos([
            file
        ]);

    }


    // ======================================================
    // FILE
    // ======================================================

    function setAttachmentFile(file) {

        if (!file) {
            return;
        }


        setSelectedFile(file);

    }


    // ======================================================
    // CONTACT
    // ======================================================

    function setAttachmentContact(contact) {

        if (!contact) {
            return;
        }


        setSelectedContact({

            id:
                contact.id ??
                Date.now(),

            name:
                contact.name ||
                "Unknown Contact",

            username:
                contact.username ||
                "",

            phone:
                contact.phone ||
                "",

            avatar:
                contact.avatar ||
                (
                    contact.name
                        ? contact.name
                            .charAt(0)
                            .toUpperCase()
                        : "C"
                )

        });

    }


    // ======================================================
    // AUDIO
    // ======================================================

    function setAttachmentAudio(file) {

        if (
            !file ||
            !file.type?.startsWith(
                "audio/"
            )
        ) {
            return;
        }


        setSelectedAudio(file);

    }


    // ======================================================
    // CLEAR ATTACHMENTS
    // ======================================================

    function clearAllAttachments() {

        setSelectedImages([]);

        setSelectedVideo([]);

        setSelectedFile(null);

        setSelectedAudio(null);

        setSelectedLocation(null);

        setSelectedContact(null);

    }


    // ======================================================
    // HAS ATTACHMENTS
    // ======================================================

    function hasSelectedAttachments() {

        return (

            selectedImages.length > 0 ||

            selectedVideo.length > 0 ||

            !!selectedFile ||

            !!selectedAudio ||

            !!selectedLocation ||

            !!selectedContact

        );

    }


    // ======================================================
    // UPLOAD HELPER
    // ======================================================

    async function uploadChatAttachment(
        conversationId,
        file,
        kind
    ) {

        if (!file) {
            return null;
        }


        const response =
            await attachmentAPI.upload(
                conversationId,
                file
            );


        if (
            !response?.success ||
            !response?.attachment
        ) {

            throw new Error(
                "Attachment upload failed."
            );

        }


        return {

            kind,

            url:
                response.attachment.url,

            path:
                response.attachment.path ||
                null,

            name:
                response.attachment.name ||
                file.name ||
                "Attachment",

            type:
                response.attachment.type ||
                file.type ||
                "",

            size:
                response.attachment.size ||
                file.size ||
                0

        };

    }


    // ======================================================
    // BUILD REPLY
    // ======================================================

    function buildReplyData() {

        if (!replyMessage) {
            return null;
        }


        return {

            id:
                replyMessage.id,

            sender:
                replyMessage.own
                    ? "You"
                    : (
                        selectedChat?.name ||
                        "Unknown"
                    ),

            text:
                replyMessage.text ||
                ""

        };

    }


    // ======================================================
    // PROCESS ONE BACKGROUND JOB
    // ======================================================

    async function processAttachmentJob(job) {

        const {

            clientId,

            conversationId,

            text,

            images,

            videos,

            file,

            audio,

            location,

            contact,

            reply,

            duration

        } = job;


        if (
            typeof navigator !== "undefined" &&
            navigator.onLine === false
        ) {

            throw new Error(
                "OFFLINE"
            );

        }


        const uploadedAttachments = [];


        for (
            const image of images
        ) {

            const uploaded =
                await uploadChatAttachment(
                    conversationId,
                    image,
                    "image"
                );


            if (uploaded) {

                uploadedAttachments.push(
                    uploaded
                );

            }

        }


        for (
            const videoFile of videos
        ) {

            const uploaded =
                await uploadChatAttachment(
                    conversationId,
                    videoFile,
                    "video"
                );


            if (uploaded) {

                uploadedAttachments.push(
                    uploaded
                );

            }

        }


        if (file) {

            const uploaded =
                await uploadChatAttachment(
                    conversationId,
                    file,
                    "file"
                );


            if (uploaded) {

                uploadedAttachments.push(
                    uploaded
                );

            }

        }


        if (audio) {

            const uploaded =
                await uploadChatAttachment(
                    conversationId,
                    audio,
                    "audio"
                );


            if (uploaded) {

                uploadedAttachments.push(
                    uploaded
                );

            }

        }


        let messageType =
            "attachment";


        if (
            location &&
            uploadedAttachments.length === 0 &&
            !contact
        ) {

            messageType =
                "location";

        }

        else if (
            contact &&
            uploadedAttachments.length === 0 &&
            !location
        ) {

            messageType =
                "contact";

        }

        else if (
            uploadedAttachments.length === 1 &&
            !location &&
            !contact
        ) {

            messageType =
                uploadedAttachments[0].kind;

        }


        const messageContent = {

            text,

            attachments:
                uploadedAttachments,

            location:
                location ||
                null,

            contact:
                contact ||
                null,

            reply:
                reply ||
                null,

            duration:
                duration ??
                null,

            clientId

        };


        const response =
            await messageAPI.sendMessage(

                conversationId,

                JSON.stringify(
                    messageContent
                ),

                messageType

            );


        if (
            !response?.message
        ) {

            throw new Error(
                "Attachment message was not returned by server."
            );

        }


        return response.message;

    }


    // ======================================================
    // PROCESS QUEUE
    // ======================================================

    async function processPendingQueue() {

        if (
            processingQueueRef.current
        ) {
            return;
        }


        if (
            typeof navigator !== "undefined" &&
            navigator.onLine === false
        ) {
            return;
        }


        processingQueueRef.current =
            true;


        try {

            while (
                pendingJobsRef.current.length
            ) {

                if (
                    typeof navigator !== "undefined" &&
                    navigator.onLine === false
                ) {

                    break;

                }


                const job =
                    pendingJobsRef.current[0];


                try {

                    const serverMessage =
                        await processAttachmentJob(
                            job
                        );


                    const normalized =
                        normalizeServerMessage(
                            serverMessage,
                            getCurrentUserId()
                        );


                    if (normalized) {

                        setMessages(prev => {

                            const optimisticIndex =
                                prev.findIndex(
                                    message =>
                                        message.clientId ===
                                        job.clientId
                                );


                            if (
                                optimisticIndex !==
                                -1
                            ) {

                                const updated = [
                                    ...prev
                                ];


                                updated[
                                    optimisticIndex
                                ] =
                                    normalized;


                                return updated;

                            }


                            const exists =
                                prev.some(
                                    message =>
                                        message.id ===
                                        normalized.id
                                );


                            if (exists) {
                                return prev;
                            }


                            return [
                                ...prev,
                                normalized
                            ];

                        });

                    }


                    pendingJobsRef.current.shift();

                } catch (error) {

                    console.error(
                        "Background attachment job error:",
                        error
                    );


                    if (
                        error?.message ===
                        "OFFLINE" ||
                        (
                            typeof navigator !== "undefined" &&
                            navigator.onLine === false
                        )
                    ) {

                        break;

                    }


                    const message =
                        error?.message ||
                        "";


                    const looksLikeNetworkError =
                        message
                            .toLowerCase()
                            .includes("fetch") ||
                        message
                            .toLowerCase()
                            .includes("network") ||
                        message
                            .toLowerCase()
                            .includes("failed to fetch") ||
                        message
                            .toLowerCase()
                            .includes("connection");


                    if (
                        looksLikeNetworkError
                    ) {

                        break;

                    }


                    setMessages(prev =>
                        prev.map(
                            messageItem => {

                                if (
                                    messageItem.clientId !==
                                    job.clientId
                                ) {

                                    return messageItem;

                                }


                                return {

                                    ...messageItem,

                                    pending: false,

                                    failed: true

                                };

                            }
                        )
                    );


                    pendingJobsRef.current.shift();

                }

            }

        } finally {

            processingQueueRef.current =
                false;

        }

    }


    // ======================================================
    // RETRY WHEN INTERNET RETURNS
    // ======================================================

    useEffect(() => {

        function handleOnline() {

            processPendingQueue();

        }


        window.addEventListener(
            "online",
            handleOnline
        );


        return () => {

            window.removeEventListener(
                "online",
                handleOnline
            );

        };

    }, []);


    // ======================================================
    // SEND MESSAGE
    // ======================================================

    async function sendMessage(
        payload = ""
    ) {

        const isText =
            typeof payload ===
            "string";


        const isObject =
            typeof payload ===
            "object" &&
            payload !== null;


        const text =
            isText
                ? payload.trim()
                : "";


        const hasText =
            text.length > 0;


        const hasVoice =
            isObject &&
            !!payload.audio;


        const hasImages =
            selectedImages.length >
            0;


        const hasVideo =
            selectedVideo.length >
            0;


        const hasFile =
            !!selectedFile;


        const hasAudioAttachment =
            !!selectedAudio;


        const hasLocation =
            !!selectedLocation;


        const hasContact =
            !!selectedContact;


        const hasAttachment =
            hasImages ||
            hasVideo ||
            hasFile ||
            hasAudioAttachment ||
            hasLocation ||
            hasContact;


        if (
            !hasText &&
            !hasVoice &&
            !hasAttachment
        ) {
            return;
        }


        if (
            editMessage &&
            hasText
        ) {

            updateMessage(
                editMessage.id,
                text
            );

            return;

        }


        const conversationId =
            getConversationId(
                selectedChat
            );


        if (!conversationId) {

            console.error(
                "Cannot send message: conversation ID missing."
            );


            setMessagesError(
                "Please open a valid conversation first."
            );


            return;

        }


        setMessagesError("");


        // ==================================================
        // VOICE MESSAGE
        // ==================================================

        if (hasVoice) {

            try {

                let voiceFile =
                    null;


                if (
                    payload.blob instanceof
                    Blob
                ) {

                    const extension =
                        payload.blob.type
                            ?.includes("ogg")
                            ? "ogg"
                            : "webm";


                    voiceFile =
                        new File(

                            [
                                payload.blob
                            ],

                            `voice-${Date.now()}.${extension}`,

                            {
                                type:
                                    payload.blob.type ||
                                    "audio/webm"
                            }

                        );

                }

                else if (
                    payload.audio instanceof
                    File
                ) {

                    voiceFile =
                        payload.audio;

                }


                if (!voiceFile) {

                    throw new Error(
                        "Voice audio file is missing."
                    );

                }


                const clientId =
                    `voice-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 10)}`;


                const reply =
                    buildReplyData();


                const optimisticMessage =
                    createMessage({

                        id:
                            `temp-${clientId}`,

                        clientId,

                        pending: true,

                        own: true,

                        text: "",

                        images: [],

                        video: [],

                        file: null,

                        audio:
                            voiceFile,

                        blob:
                            payload.blob ||
                            null,

                        duration:
                            payload.duration ??
                            null,

                        reply,

                        conversationId,

                        messageType:
                            "audio"

                    });


                setMessages(prev => [

                    ...prev,

                    optimisticMessage

                ]);


                setReplyMessage(null);

                setEditMessage(null);

                clearAllAttachments();


                pendingJobsRef.current.push({

                    clientId,

                    conversationId,

                    text: "",

                    images: [],

                    videos: [],

                    file: null,

                    audio:
                        voiceFile,

                    location: null,

                    contact: null,

                    reply,

                    duration:
                        payload.duration ??
                        null

                });


                processPendingQueue();


            } catch (error) {

                console.error(
                    "Voice send error:",
                    error
                );


                setMessagesError(
                    error?.message ||
                    "Failed to send voice message."
                );

            }


            return;

        }


        // ==================================================
        // TEXT ONLY
        // ==================================================

        if (
            hasText &&
            !hasAttachment
        ) {

            try {

                const response =
                    await messageAPI.sendMessage(

                        conversationId,

                        text,

                        "text"

                    );


                if (
                    !response?.message
                ) {

                    throw new Error(
                        "Message was not returned by server."
                    );

                }


                const normalized =
                    normalizeServerMessage(

                        response.message,

                        getCurrentUserId()

                    );


                if (normalized) {

                    setMessages(prev => {

                        const exists =
                            prev.some(
                                message =>
                                    message.id ===
                                    normalized.id
                            );


                        if (exists) {
                            return prev;
                        }


                        return [
                            ...prev,
                            normalized
                        ];

                    });

                }


                setReplyMessage(null);

                setEditMessage(null);

                clearAllAttachments();


            } catch (error) {

                console.error(
                    "Send message error:",
                    error
                );


                setMessagesError(
                    error?.message ||
                    "Failed to send message."
                );

            }


            return;

        }


        // ==================================================
        // ATTACHMENTS
        // ==================================================

        try {

            const images =
                [...selectedImages];


            const videos =
                [...selectedVideo];


            const file =
                selectedFile;


            const audio =
                selectedAudio;


            const location =
                selectedLocation;


            const contact =
                hasContact
                    ? {

                        id:
                            selectedContact.id,

                        name:
                            selectedContact.name,

                        username:
                            selectedContact.username,

                        phone:
                            selectedContact.phone,

                        avatar:
                            selectedContact.avatar

                    }
                    : null;


            const reply =
                buildReplyData();


            const clientId =
                `attachment-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 10)}`;


            const optimisticImages =
                images;


            const optimisticVideos =
                videos;


            const optimisticFile =
                file
                    ? {

                        url:
                            URL.createObjectURL(
                                file
                            ),

                        path: null,

                        name:
                            file.name ||
                            "File",

                        type:
                            file.type ||
                            "",

                        size:
                            file.size ||
                            0

                    }
                    : null;


            let optimisticMessageType =
                "attachment";


            if (
                images.length === 1 &&
                videos.length === 0 &&
                !file &&
                !audio &&
                !location &&
                !contact
            ) {

                optimisticMessageType =
                    "image";

            }

            else if (
                videos.length === 1 &&
                images.length === 0 &&
                !file &&
                !audio &&
                !location &&
                !contact
            ) {

                optimisticMessageType =
                    "video";

            }

            else if (
                audio &&
                images.length === 0 &&
                videos.length === 0 &&
                !file &&
                !location &&
                !contact
            ) {

                optimisticMessageType =
                    "audio";

            }

            else if (
                file &&
                images.length === 0 &&
                videos.length === 0 &&
                !audio &&
                !location &&
                !contact
            ) {

                optimisticMessageType =
                    "file";

            }

            else if (
                location &&
                images.length === 0 &&
                videos.length === 0 &&
                !file &&
                !audio &&
                !contact
            ) {

                optimisticMessageType =
                    "location";

            }

            else if (
                contact &&
                images.length === 0 &&
                videos.length === 0 &&
                !file &&
                !audio &&
                !location
            ) {

                optimisticMessageType =
                    "contact";

            }


            const optimisticMessage =
                createMessage({

                    id:
                        `temp-${clientId}`,

                    clientId,

                    pending: true,

                    failed: false,

                    own: true,

                    text,

                    images:
                        optimisticImages,

                    video:
                        optimisticVideos,

                    file:
                        optimisticFile,

                    audio:
                        audio,

                    location:
                        location,

                    contact:
                        contact,

                    reply:
                        reply,

                    duration:
                        null,

                    conversationId,

                    messageType:
                        optimisticMessageType

                });


            setMessages(prev => [

                ...prev,

                optimisticMessage

            ]);


            setReplyMessage(null);

            setEditMessage(null);

            clearAllAttachments();


            pendingJobsRef.current.push({

                clientId,

                conversationId,

                text,

                images,

                videos,

                file,

                audio,

                location,

                contact,

                reply,

                duration: null

            });


            processPendingQueue();


        } catch (error) {

            console.error(
                "Attachment send error:",
                error
            );


            setMessagesError(
                error?.message ||
                "Failed to send attachment."
            );

        }

    }


    // ======================================================
    // UPDATE MESSAGE
    // ======================================================

    function updateMessage(
        id,
        text
    ) {

        if (
            id === null ||
            id === undefined
        ) {
            return;
        }


        const cleanText =
            text?.trim();


        if (!cleanText) {
            return;
        }


        setMessages(prev =>

            prev.map(message =>

                message.id === id

                    ? {

                        ...message,

                        text:
                            cleanText,

                        edited:
                            true

                    }

                    : message

            )

        );


        setEditMessage(null);

    }


    // ======================================================
    // REACTION
    // ======================================================

    function toggleReaction(
        messageId,
        emoji
    ) {

        if (
            messageId === null ||
            messageId === undefined ||
            !emoji
        ) {
            return;
        }


        setMessages(prev =>

            prev.map(message => {

                if (
                    message.id !==
                    messageId
                ) {
                    return message;
                }


                const reactions = [

                    ...(message.reactions || [])

                ];


                const index =
                    reactions.findIndex(
                        reaction =>
                            reaction.emoji ===
                            emoji
                    );


                if (index >= 0) {

                    reactions.splice(
                        index,
                        1
                    );

                }

                else {

                    reactions.push({

                        emoji,

                        count: 1

                    });

                }


                return {

                    ...message,

                    reactions

                };

            })

        );

    }


    // ======================================================
    // TRANSLATION
    // ======================================================

    const [
        translateMessage,
        setTranslateMessage
    ] = useState(null);


    const [
        translateOpen,
        setTranslateOpen
    ] = useState(false);


    const [
        translateLanguage,
        setTranslateLanguage
    ] = useState("English");


    const [
        translatedMessages,
        setTranslatedMessages
    ] = useState({});


    function openTranslate(message) {

        if (
            !message ||
            message.deleted
        ) {
            return;
        }


        setTranslateMessage(message);

        setTranslateOpen(true);

    }


    function closeTranslate() {

        setTranslateOpen(false);

        setTranslateMessage(null);

        setTranslateLanguage(
            "English"
        );

    }


    function saveTranslation(
        messageId,
        translatedText
    ) {

        if (
            messageId === null ||
            messageId === undefined ||
            !translatedText?.trim()
        ) {
            return;
        }


        setTranslatedMessages(prev => ({

            ...prev,

            [messageId]:
                translatedText.trim()

        }));


        closeTranslate();

    }


    // ======================================================
    // SEARCH
    // ======================================================

    const [
        searchText,
        setSearchText
    ] = useState("");


    // ======================================================
    // TYPING
    // ======================================================

    const [
        isTyping,
        setIsTyping
    ] = useState(false);


    // ======================================================
    // POPUPS
    // ======================================================

    const [
        attachmentOpen,
        setAttachmentOpen
    ] = useState(false);


    const [
        emojiOpen,
        setEmojiOpen
    ] = useState(false);


    // ======================================================
    // PROVIDER
    // ======================================================

    return (

        <ChatContext.Provider
            value={{

                // ==========================================
                // CHAT
                // ==========================================

                selectedChat,

                selectChat,


                // ==========================================
                // MESSAGES
                // ==========================================

                messages,

                setMessages,

                sendMessage,

                removeMessage,

                updateMessage,

                toggleReaction,

                loadMessages,

                messagesLoading,

                messagesError,


                // ==========================================
                // REPLY / EDIT
                // ==========================================

                replyMessage,

                setReplyMessage,

                startReply,

                cancelReply,

                editMessage,

                setEditMessage,

                startEdit,

                cancelEdit,


                // ==========================================
                // CONTEXT MENU
                // ==========================================

                contextMenu,

                openContextMenu,

                closeContextMenu,


                // ==========================================
                // DELETE
                // ==========================================

                deleteModalOpen,

                setDeleteModalOpen,

                deleteMessage,

                setDeleteMessage,

                openDeleteModal,

                closeDeleteModal,

                deleteSelectedMessages:
                    () =>
                        removeMessage(
                            selectedMessages
                        ),


                // ==========================================
                // MESSAGE INFO
                // ==========================================

                messageInfo,

                setMessageInfo,

                openMessageInfo,

                closeMessageInfo,


                // ==========================================
                // RIGHT PANEL
                // ==========================================

                rightPanelOpen,

                setRightPanelOpen,

                toggleRightPanel,

                closeRightPanel,


                // ==========================================
                // SELECTION
                // ==========================================

                selectionMode,

                setSelectionMode,

                selectedMessages,

                setSelectedMessages,

                startSelection,

                toggleMessageSelection,

                clearSelection,

                selectAllMessages,

                copySelectedMessages,


                // ==========================================
                // STAR
                // ==========================================

                starredMessages,

                setStarredMessages,

                toggleStarMessage,

                starSelectedMessages,


                // ==========================================
                // PIN
                // ==========================================

                pinnedMessages,

                setPinnedMessages,

                pinSelectedMessages,


                // ==========================================
                // BOOKMARK
                // ==========================================

                bookmarkedMessages,

                setBookmarkedMessages,

                toggleBookmarkMessage,

                bookmarkSelectedMessages,


                // ==========================================
                // FORWARD
                // ==========================================

                forwardMessages,

                setForwardMessages,

                forwardMessage,

                forwardSelectedMessages,

                clearForwardMessages,


                // ==========================================
                // TRANSLATION
                // ==========================================

                translateMessage,

                setTranslateMessage,

                translateOpen,

                setTranslateOpen,

                translateLanguage,

                setTranslateLanguage,

                translatedMessages,

                setTranslatedMessages,

                openTranslate,

                closeTranslate,

                saveTranslation,


                // ==========================================
                // SEARCH
                // ==========================================

                searchText,

                setSearchText,


                // ==========================================
                // TYPING
                // ==========================================

                isTyping,

                setIsTyping,


                // ==========================================
                // POPUPS
                // ==========================================

                attachmentOpen,

                setAttachmentOpen,

                emojiOpen,

                setEmojiOpen,


                // ==========================================
                // LOCATION
                // ==========================================

                selectedLocation,

                setSelectedLocation,

                sendLocation,


                // ==========================================
                // MUTE
                // ==========================================

                muteNotifications,

                setMuteNotifications,

                muteDuration,

                setMuteDuration,

                muteUntil,

                setMuteUntil,

                muteChat,

                muteChatCustom,

                unmuteChat,


                // ==========================================
                // IMAGE ATTACHMENTS
                // ==========================================

                MAX_IMAGES_PER_MESSAGE,

                selectedImages,

                setSelectedImages,

                addSelectedImages,

                removeSelectedImage,

                clearSelectedImages,


                // ==========================================
                // VIDEO ATTACHMENTS
                // ==========================================

                MAX_VIDEOS_PER_MESSAGE,

                selectedVideo,

                setSelectedVideo,

                addSelectedVideos,

                removeSelectedVideo,

                clearSelectedVideos,

                setAttachmentVideo,


                // ==========================================
                // FILE ATTACHMENT
                // ==========================================

                selectedFile,

                setSelectedFile,

                setAttachmentFile,


                // ==========================================
                // AUDIO ATTACHMENT
                // ==========================================

                selectedAudio,

                setSelectedAudio,

                setAttachmentAudio,


                // ==========================================
                // ALL ATTACHMENTS
                // ==========================================

                clearAllAttachments,

                hasSelectedAttachments,


                // ==========================================
                // CONTACT
                // ==========================================

                selectedContact,

                setSelectedContact,

                setAttachmentContact

            }}

        >

            {children}

        </ChatContext.Provider>

    );

}


// ==========================================================
// HOOK
// ==========================================================

export function useChat() {

    return useContext(
        ChatContext
    );

}