const API_BASE_URL =
    "https://devchat-production-dc1f.up.railway.app/api";

// =====================================================
// GET TOKEN
// =====================================================

const getToken = () => {

    return localStorage.getItem(
        "devchat_token"
    );

};


// =====================================================
// API REQUEST
// =====================================================

export const apiRequest = async (
    endpoint,
    options = {}
) => {

    const token =
        getToken();


    const headers = {

        "Content-Type":
            "application/json",

        ...(options.headers || {}),

    };


    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }


    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {

                ...options,

                headers,

            }
        );


    let data = {};


    try {

        data =
            await response.json();

    } catch {

        data = {};

    }


    if (!response.ok) {

        throw new Error(

            data.message ||
            "Something went wrong"

        );

    }


    return data;

};


// =====================================================
// USER API
// =====================================================

export const userAPI = {

    // -----------------------------------------------
    // GET CURRENT USER
    // -----------------------------------------------

    getMe: () => {

        return apiRequest(
            "/users/me"
        );

    },


    // -----------------------------------------------
    // SEARCH USERS
    // -----------------------------------------------

    searchUsers: (
        query
    ) => {

        return apiRequest(

            `/users/search?q=${encodeURIComponent(
                query
            )}`

        );

    },

};


// =====================================================
// FRIEND API
// =====================================================

export const friendAPI = {

    // -----------------------------------------------
    // GET FRIENDS
    // -----------------------------------------------

    getFriends: () => {

        return apiRequest(
            "/friends"
        );

    },


    // -----------------------------------------------
    // GET FRIEND REQUESTS
    // -----------------------------------------------

    getRequests: () => {

        return apiRequest(
            "/friends/requests"
        );

    },


    // -----------------------------------------------
    // SEND FRIEND REQUEST
    // -----------------------------------------------

    sendRequest: (
        receiverId
    ) => {

        return apiRequest(

            "/friends/request",

            {

                method: "POST",

                body:
                    JSON.stringify({

                        receiver_id:
                            receiverId,

                    }),

            }

        );

    },


    // -----------------------------------------------
    // ACCEPT FRIEND REQUEST
    // -----------------------------------------------

    acceptRequest: (
        requestId
    ) => {

        return apiRequest(

            `/friends/requests/${requestId}/accept`,

            {

                method: "PUT",

            }

        );

    },


    // -----------------------------------------------
    // REJECT FRIEND REQUEST
    // -----------------------------------------------

    rejectRequest: (
        requestId
    ) => {

        return apiRequest(

            `/friends/requests/${requestId}/reject`,

            {

                method: "PUT",

            }

        );

    },

};


// =====================================================
// CONVERSATION API
// =====================================================

export const conversationAPI = {

    // -----------------------------------------------
    // GET ALL MY CONVERSATIONS
    // -----------------------------------------------

    getMyConversations: () => {

        return apiRequest(
            "/conversations"
        );

    },


    // -----------------------------------------------
    // GET OR CREATE ONE-TO-ONE
    // -----------------------------------------------

    getOrCreate: (
        friendId
    ) => {

        return apiRequest(

            "/conversations",

            {

                method: "POST",

                body:
                    JSON.stringify({

                        friendId,

                    }),

            }

        );

    },

};


// =====================================================
// MESSAGE API
// =====================================================

export const messageAPI = {

    // -----------------------------------------------
    // GET CONVERSATION MESSAGES
    // -----------------------------------------------

    getMessages: (
        conversationId
    ) => {

        return apiRequest(

            `/messages/${conversationId}`

        );

    },


    


    // -----------------------------------------------
    // SEND MESSAGE
    // -----------------------------------------------

    sendMessage: (
        conversationId,
        content,
        messageType = "text"
    ) => {

        return apiRequest(

            `/messages/${conversationId}`,

            {

                method: "POST",

                body:
                    JSON.stringify({

                        content,

                        message_type:
                            messageType,

                    }),

            }

        );

    },

};

export const attachmentAPI = {
    upload: async (
        conversationId,
        file
    ) => {

        const token =
            getToken();

        if (!token) {
            throw new Error(
                "Authentication required"
            );
        }

        if (!conversationId) {
            throw new Error(
                "Conversation ID is required"
            );
        }

        if (!file) {
            throw new Error(
                "File is required"
            );
        }


        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );


        const response =
            await fetch(
                `${API_BASE_URL}/attachments/${conversationId}`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: formData,
                }
            );


        let data = null;

        try {
            data =
                await response.json();
        } catch {
            data = null;
        }


        if (!response.ok) {

            throw new Error(
                data?.message ||
                "Attachment upload failed"
            );

        }


        return data;
    },
};