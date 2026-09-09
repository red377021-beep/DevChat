// ======================================================
// DEVCHAT FRIEND CONTROLLER
// ======================================================

import supabase from "../config/db.js";


// ======================================================
// SEND FRIEND REQUEST
// ======================================================

export const sendFriendRequest = async (req, res) => {

    try {

        const senderId =
            req.user?.userId;

        const receiverId =
            req.body?.receiver_id;


        // ==================================================
        // VALIDATION
        // ==================================================

        if (!senderId) {

            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });

        }


        if (!receiverId) {

            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });

        }


        if (senderId === receiverId) {

            return res.status(400).json({
                success: false,
                message:
                    "You cannot send a friend request to yourself",
            });

        }


        // ==================================================
        // CHECK RECEIVER
        // ==================================================

        const {
            data: receiver,
            error: receiverError,
        } = await supabase
            .from("users")
            .select("id")
            .eq("id", receiverId)
            .maybeSingle();


        if (receiverError) {

            console.error(
                "Receiver check error:",
                receiverError
            );

            return res.status(500).json({
                success: false,
                message: "Failed to find user",
            });

        }


        if (!receiver) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        }


        // ==================================================
        // CHECK EXISTING REQUEST
        // ==================================================

        const {
            data: existingRequest,
            error: existingRequestError,
        } = await supabase
            .from("friend_requests")
            .select("*")
            .or(
                `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
            )
            .maybeSingle();


        if (existingRequestError) {

            console.error(
                "Existing request check error:",
                existingRequestError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to check existing friend request",
            });

        }


        if (existingRequest) {

            // ==================================================
            // ALREADY FRIENDS
            // ==================================================

            if (
                existingRequest.status ===
                "accepted"
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "You are already friends",
                });

            }


            // ==================================================
            // PENDING
            // ==================================================

            if (
                existingRequest.status ===
                "pending"
            ) {

                if (
                    existingRequest.sender_id ===
                    senderId
                ) {

                    return res.status(409).json({
                        success: false,
                        message:
                            "Friend request already sent",
                    });

                }


                return res.status(409).json({
                    success: false,
                    message:
                        "This user has already sent you a friend request",
                });

            }


            // ==================================================
            // REUSE REJECTED / CANCELLED REQUEST
            // ==================================================

            const {
                data: updatedRequest,
                error: updateError,
            } = await supabase
                .from("friend_requests")
                .update({
                    sender_id: senderId,
                    receiver_id: receiverId,
                    status: "pending",
                    updated_at:
                        new Date().toISOString(),
                })
                .eq(
                    "id",
                    existingRequest.id
                )
                .select("*")
                .single();


            if (updateError) {

                console.error(
                    "Request reuse error:",
                    updateError
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to send friend request",
                });

            }


            return res.status(201).json({
                success: true,
                message:
                    "Friend request sent",
                request: updatedRequest,
            });

        }


        // ==================================================
        // CREATE REQUEST
        // ==================================================

        const {
            data: request,
            error: createError,
        } = await supabase
            .from("friend_requests")
            .insert([
                {
                    sender_id: senderId,
                    receiver_id: receiverId,
                    status: "pending",
                },
            ])
            .select("*")
            .single();


        if (createError) {

            console.error(
                "Create friend request error:",
                createError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to send friend request",
            });

        }


        return res.status(201).json({
            success: true,
            message:
                "Friend request sent",
            request,
        });


    } catch (error) {

        console.error(
            "Send friend request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to send friend request",
        });

    }

};


// ======================================================
// GET FRIEND REQUESTS
// ======================================================

export const getFriendRequests = async (req, res) => {

    try {

        const userId =
            req.user?.userId;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });

        }


        const {
            data: requests,
            error,
        } = await supabase
            .from("friend_requests")
            .select(`
                id,
                sender_id,
                receiver_id,
                status,
                created_at,
                updated_at,

                sender:users!friend_requests_sender_id_fkey (
                    id,
                    username,
                    full_name,
                    bio,
                    avatar_url,
                    status,
                    is_online
                ),

                receiver:users!friend_requests_receiver_id_fkey (
                    id,
                    username,
                    full_name,
                    bio,
                    avatar_url,
                    status,
                    is_online
                )
            `)
            .or(
                `sender_id.eq.${userId},receiver_id.eq.${userId}`
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            );


        if (error) {

            console.error(
                "Get friend requests error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch friend requests",
            });

        }


        return res.status(200).json({
            success: true,
            requests:
                requests || [],
        });


    } catch (error) {

        console.error(
            "Get friend requests error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch friend requests",
        });

    }

};


// ======================================================
// ACCEPT FRIEND REQUEST
// ======================================================

export const acceptFriendRequest = async (req, res) => {

    try {

        const userId =
            req.user?.userId;

        const requestId =
            req.params?.id;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });

        }


        if (!requestId) {

            return res.status(400).json({
                success: false,
                message:
                    "Friend request ID is required",
            });

        }


        // ==================================================
        // FIND REQUEST
        // ==================================================

        const {
            data: request,
            error: requestError,
        } = await supabase
            .from("friend_requests")
            .select("*")
            .eq(
                "id",
                requestId
            )
            .eq(
                "receiver_id",
                userId
            )
            .eq(
                "status",
                "pending"
            )
            .maybeSingle();


        if (requestError) {

            console.error(
                "Find friend request error:",
                requestError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to find friend request",
            });

        }


        if (!request) {

            return res.status(404).json({
                success: false,
                message:
                    "Friend request not found",
            });

        }


        // ==================================================
        // UPDATE REQUEST
        // ==================================================

        const {
            data: updatedRequest,
            error: updateError,
        } = await supabase
            .from("friend_requests")
            .update({
                status: "accepted",
                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "id",
                requestId
            )
            .select("*")
            .single();


        if (updateError) {

            console.error(
                "Accept friend request error:",
                updateError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to accept friend request",
            });

        }


        // ==================================================
        // CREATE FRIENDSHIP FOR RECEIVER
        // ==================================================

        const {
            error: friendshipError,
        } = await supabase
            .from("friendships")
            .upsert(
                [
                    {
                        user_id:
                            request.receiver_id,

                        friend_id:
                            request.sender_id,
                    },
                    {
                        user_id:
                            request.sender_id,

                        friend_id:
                            request.receiver_id,
                    },
                ],
                {
                    onConflict:
                        "user_id,friend_id",
                }
            );


        if (friendshipError) {

            console.error(
                "Create friendship error:",
                friendshipError
            );


            // Roll request back if friendship creation fails
            await supabase
                .from("friend_requests")
                .update({
                    status: "pending",
                    updated_at:
                        new Date().toISOString(),
                })
                .eq(
                    "id",
                    requestId
                );


            return res.status(500).json({
                success: false,
                message:
                    "Friend request accepted but friendship could not be created",
            });

        }


        return res.status(200).json({
            success: true,
            message:
                "Friend request accepted",
            request:
                updatedRequest,
        });


    } catch (error) {

        console.error(
            "Accept friend request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to accept friend request",
        });

    }

};


// ======================================================
// REJECT FRIEND REQUEST
// ======================================================

export const rejectFriendRequest = async (req, res) => {

    try {

        const userId =
            req.user?.userId;

        const requestId =
            req.params?.id;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });

        }


        if (!requestId) {

            return res.status(400).json({
                success: false,
                message:
                    "Friend request ID is required",
            });

        }


        // ==================================================
        // FIND REQUEST
        // ==================================================

        const {
            data: request,
            error: requestError,
        } = await supabase
            .from("friend_requests")
            .select("id")
            .eq(
                "id",
                requestId
            )
            .eq(
                "receiver_id",
                userId
            )
            .eq(
                "status",
                "pending"
            )
            .maybeSingle();


        if (requestError) {

            console.error(
                "Find request error:",
                requestError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to find friend request",
            });

        }


        if (!request) {

            return res.status(404).json({
                success: false,
                message:
                    "Friend request not found",
            });

        }


        // ==================================================
        // REJECT
        // ==================================================

        const {
            data: updatedRequest,
            error: updateError,
        } = await supabase
            .from("friend_requests")
            .update({
                status: "rejected",
                updated_at:
                    new Date().toISOString(),
            })
            .eq(
                "id",
                requestId
            )
            .select("*")
            .single();


        if (updateError) {

            console.error(
                "Reject friend request error:",
                updateError
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to reject friend request",
            });

        }


        return res.status(200).json({
            success: true,
            message:
                "Friend request rejected",
            request:
                updatedRequest,
        });


    } catch (error) {

        console.error(
            "Reject friend request error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to reject friend request",
        });

    }

};


// ======================================================
// GET FRIENDS
// ======================================================

export const getFriends = async (req, res) => {

    try {

        const userId =
            req.user?.userId;


        if (!userId) {

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });

        }


        const {
            data: friendships,
            error,
        } = await supabase
            .from("friendships")
            .select(`
                id,
                created_at,

                friend:users!friendships_friend_id_fkey (
                    id,
                    username,
                    full_name,
                    bio,
                    avatar_url,
                    status,
                    is_online
                )
            `)
            .eq(
                "user_id",
                userId
            )
            .order(
                "created_at",
                {
                    ascending: false,
                }
            );


        if (error) {

            console.error(
                "Get friends error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch friends",
            });

        }


        const friends =
            (friendships || [])
                .map(
                    (item) =>
                        item.friend
                )
                .filter(Boolean);


        return res.status(200).json({
            success: true,
            friends,
        });


    } catch (error) {

        console.error(
            "Get friends error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch friends",
        });

    }

};