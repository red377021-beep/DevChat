import supabase from "../config/db.js";


// =====================================================
// GET USER ID
// =====================================================

const getUserId = (req) => {

    return (
        req.user?.userId ||
        req.user?.id ||
        null
    );

};


// =====================================================
// CHECK CONVERSATION ACCESS
// =====================================================

const checkConversationAccess = async (
    conversationId,
    userId
) => {

    const {
        data,
        error,
    } = await supabase

        .from("conversations")

        .select(`
            id,
            user_one_id,
            user_two_id
        `)

        .eq(
            "id",
            conversationId
        )

        .maybeSingle();


    if (error) {
        throw error;
    }


    if (!data) {

        return {
            exists: false,
            allowed: false,
            conversation: null,
        };

    }


    const allowed =
        data.user_one_id === userId ||
        data.user_two_id === userId;


    return {

        exists: true,

        allowed,

        conversation: data,

    };

};


// =====================================================
// GET MESSAGES
// =====================================================

export const getMessages = async (
    req,
    res
) => {

    try {

        const userId =
            getUserId(req);

        const {
            conversationId,
        } = req.params;


        // ---------------------------------------------
        // AUTH CHECK
        // ---------------------------------------------

        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        // ---------------------------------------------
        // CONVERSATION ID CHECK
        // ---------------------------------------------

        if (!conversationId) {

            return res.status(400).json({

                success: false,

                message:
                    "Conversation ID is required",

            });

        }


        // ---------------------------------------------
        // ACCESS CHECK
        // ---------------------------------------------

        const membership =
            await checkConversationAccess(
                conversationId,
                userId
            );


        if (!membership.exists) {

            return res.status(404).json({

                success: false,

                message:
                    "Conversation not found",

            });

        }


        if (!membership.allowed) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have access to this conversation",

            });

        }


        // ---------------------------------------------
        // GET MESSAGES
        // ---------------------------------------------

        const {
            data,
            error,
        } =
            await supabase

                .from("messages")

                .select(`

                    id,

                    conversation_id,

                    sender_id,

                    message_type,

                    content,

                    created_at,

                    updated_at,

                    edited_at,

                    deleted_at,

                    sender:users!messages_sender_id_fkey (

                        id,

                        username,

                        full_name,

                        avatar_url

                    )

                `)

                .eq(
                    "conversation_id",
                    conversationId
                )

                .order(
                    "created_at",
                    {
                        ascending: true,
                    }
                );


        if (error) {

            console.error(
                "Get messages error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to load messages",

                error:
                    error.message,

            });

        }


        return res.status(200).json({

            success: true,

            messages:
                data || [],

        });


    } catch (error) {

        console.error(
            "Get messages exception:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while loading messages",

            error:
                error.message,

        });

    }

};


// =====================================================
// SEND MESSAGE
// =====================================================

export const sendMessage = async (
    req,
    res
) => {

    try {

        const userId =
            getUserId(req);

        const {
            conversationId,
        } = req.params;


        const {
            content,
            message_type,
            messageType,
        } = req.body;


        // ---------------------------------------------
        // AUTH CHECK
        // ---------------------------------------------

        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        // ---------------------------------------------
        // CONVERSATION ID CHECK
        // ---------------------------------------------

        if (!conversationId) {

            return res.status(400).json({

                success: false,

                message:
                    "Conversation ID is required",

            });

        }


        // ---------------------------------------------
        // MESSAGE CONTENT
        // ---------------------------------------------

        const cleanContent =
            typeof content === "string"
                ? content.trim()
                : "";


        if (!cleanContent) {

            return res.status(400).json({

                success: false,

                message:
                    "Message content is required",

            });

        }


        // ---------------------------------------------
        // MESSAGE TYPE
        // ---------------------------------------------

        const finalMessageType =
            message_type ||
            messageType ||
            "text";


        // ---------------------------------------------
        // CHECK CONVERSATION ACCESS
        // ---------------------------------------------

        const membership =
            await checkConversationAccess(
                conversationId,
                userId
            );


        if (!membership.exists) {

            return res.status(404).json({

                success: false,

                message:
                    "Conversation not found",

            });

        }


        if (!membership.allowed) {

            return res.status(403).json({

                success: false,

                message:
                    "You do not have access to this conversation",

            });

        }


        // ---------------------------------------------
        // INSERT MESSAGE
        // ---------------------------------------------

        const {
            data: insertedMessage,
            error: insertError,
        } =
            await supabase

                .from("messages")

                .insert({

                    conversation_id:
                        conversationId,

                    sender_id:
                        userId,

                    message_type:
                        finalMessageType,

                    content:
                        cleanContent,

                })

                .select(`

                    id,

                    conversation_id,

                    sender_id,

                    message_type,

                    content,

                    created_at,

                    updated_at,

                    edited_at,

                    deleted_at,

                    sender:users!messages_sender_id_fkey (

                        id,

                        username,

                        full_name,

                        avatar_url

                    )

                `)

                .single();


        if (insertError) {

            console.error(
                "Send message insert error:",
                insertError
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to send message",

                error:
                    insertError.message,

            });

        }


        // ---------------------------------------------
        // UPDATE CONVERSATION TIMESTAMP
        // ---------------------------------------------

        const {
            error: conversationError,
        } =
            await supabase

                .from("conversations")

                .update({

                    updated_at:
                        new Date().toISOString(),

                })

                .eq(
                    "id",
                    conversationId
                );


        if (conversationError) {

            console.warn(
                "Conversation timestamp update warning:",
                conversationError.message
            );

        }


        // =================================================
        // SOCKET.IO REAL-TIME EMIT
        // =================================================

        const io =
            req.app.get("io");


        if (io) {

            const room =
                `conversation:${conversationId}`;


            io.to(room).emit(
                "new_message",
                insertedMessage
            );


            console.log(
                `📨 Message emitted to ${room}`
            );

        } else {

            console.warn(
                "Socket.IO instance not found"
            );

        }


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                insertedMessage,

        });


    } catch (error) {

        console.error(
            "Send message exception:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while sending message",

            error:
                error.message,

        });

    }

};