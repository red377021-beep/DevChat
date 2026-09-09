import supabase from "../config/db.js";


// =====================================================
// GET OR CREATE ONE-TO-ONE CONVERSATION
// =====================================================

export const getOrCreateConversation = async (
    req,
    res
) => {
    try {

        const currentUserId =
            req.user?.userId;

        const {
            friendId
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (!currentUserId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        if (!friendId) {

            return res.status(400).json({

                success: false,

                message:
                    "Friend ID is required",

            });

        }


        if (
            currentUserId ===
            friendId
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "You cannot create a conversation with yourself",

            });

        }


        // =================================================
        // CHECK FRIENDSHIP
        // =================================================

        const {
            data: friendship,
            error: friendshipError,
        } = await supabase

            .from("friendships")

            .select("id")

            .eq(
                "user_id",
                currentUserId
            )

            .eq(
                "friend_id",
                friendId
            )

            .maybeSingle();


        if (friendshipError) {

            console.error(
                "Friendship check error:",
                friendshipError
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to verify friendship",

            });

        }


        if (!friendship) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only chat with friends",

            });

        }


        // =================================================
        // NORMALIZE USER ORDER
        // =================================================

        const userOne =
            currentUserId <
            friendId
                ? currentUserId
                : friendId;


        const userTwo =
            currentUserId <
            friendId
                ? friendId
                : currentUserId;


        // =================================================
        // FIND EXISTING CONVERSATION
        // =================================================

        const {
            data: existingConversation,
            error: conversationError,
        } = await supabase

            .from("conversations")

            .select("*")

            .eq(
                "user_one_id",
                userOne
            )

            .eq(
                "user_two_id",
                userTwo
            )

            .maybeSingle();


        if (conversationError) {

            console.error(
                "Conversation lookup error:",
                conversationError
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to find conversation",

            });

        }


        // =================================================
        // RETURN EXISTING
        // =================================================

        if (existingConversation) {

            return res.status(200).json({

                success: true,

                conversation:
                    existingConversation,

                created: false,

            });

        }


        // =================================================
        // CREATE CONVERSATION
        // =================================================

        const {
            data: newConversation,
            error: createError,
        } = await supabase

            .from("conversations")

            .insert({

                user_one_id:
                    userOne,

                user_two_id:
                    userTwo,

            })

            .select("*")

            .single();


        if (createError) {

            console.error(
                "Conversation creation error:",
                createError
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to create conversation",

            });

        }


        return res.status(201).json({

            success: true,

            conversation:
                newConversation,

            created: true,

        });

    } catch (error) {

        console.error(
            "Get/Create conversation error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Something went wrong",

        });

    }

};


// =====================================================
// GET MY CONVERSATIONS
// =====================================================

export const getMyConversations = async (
    req,
    res
) => {

    try {

        const currentUserId =
            req.user?.userId;


        // =================================================
        // AUTH CHECK
        // =================================================

        if (!currentUserId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        // =================================================
        // GET CONVERSATIONS
        // =================================================

        const {
            data: conversations,
            error,
        } = await supabase

            .from("conversations")

            .select(`
                id,
                user_one_id,
                user_two_id,
                created_at,
                updated_at,

                user_one:users!conversations_user_one_id_fkey (
                    id,
                    username,
                    email,
                    full_name,
                    bio,
                    avatar_url,
                    status,
                    is_online
                ),

                user_two:users!conversations_user_two_id_fkey (
                    id,
                    username,
                    email,
                    full_name,
                    bio,
                    avatar_url,
                    status,
                    is_online
                )
            `)

            .or(
                `user_one_id.eq.${currentUserId},user_two_id.eq.${currentUserId}`
            )

            .order(
                "updated_at",
                {
                    ascending: false,
                }
            );


        if (error) {

            console.error(
                "Get conversations error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to load conversations",

            });

        }


        // =================================================
        // FORMAT CONVERSATIONS
        // =================================================

        const formattedConversations =
            (conversations || [])
                .map(
                    (conversation) => {

                        const isUserOne =
                            conversation.user_one_id ===
                            currentUserId;


                        const friend =
                            isUserOne
                                ? conversation.user_two
                                : conversation.user_one;


                        if (!friend) {

                            return null;

                        }


                        return {

                            id:
                                conversation.id,

                            conversationId:
                                conversation.id,

                            type:
                                "private",

                            user: {

                                id:
                                    friend.id,

                                userId:
                                    friend.id,

                                username:
                                    friend.username ||
                                    "",

                                email:
                                    friend.email ||
                                    "",

                                name:
                                    friend.full_name ||
                                    friend.username ||
                                    "Unknown User",

                                full_name:
                                    friend.full_name ||
                                    friend.username ||
                                    "Unknown User",

                                avatar:
                                    friend.avatar_url ||
                                    "",

                                avatar_url:
                                    friend.avatar_url ||
                                    "",

                                status:
                                    friend.status ||
                                    "Available on DevChat",

                                online:
                                    Boolean(
                                        friend.is_online
                                    ),

                                is_online:
                                    Boolean(
                                        friend.is_online
                                    ),

                            },

                            name:
                                friend.full_name ||
                                friend.username ||
                                "Unknown User",

                            username:
                                friend.username ||
                                "",

                            avatar:
                                friend.avatar_url ||
                                "",

                            avatar_url:
                                friend.avatar_url ||
                                "",

                            online:
                                Boolean(
                                    friend.is_online
                                ),

                            is_online:
                                Boolean(
                                    friend.is_online
                                ),

                            lastMessage:
                                "",

                            lastMessageType:
                                null,

                            time:
                                "",

                            typing:
                                false,

                            pinned:
                                false,

                            unread:
                                0,

                            created_at:
                                conversation.created_at,

                            updated_at:
                                conversation.updated_at,

                        };

                    }
                )
                .filter(Boolean);


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            conversations:
                formattedConversations,

        });

    } catch (error) {

        console.error(
            "Get my conversations error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Something went wrong",

        });

    }

};