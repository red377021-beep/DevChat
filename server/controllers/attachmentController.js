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
        };

    }


    const allowed =
        data.user_one_id === userId ||
        data.user_two_id === userId;


    return {
        exists: true,
        allowed,
    };

};


// =====================================================
// SANITIZE FILE NAME
// =====================================================

const sanitizeFileName = (
    fileName
) => {

    return fileName
        .replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

};


// =====================================================
// UPLOAD ATTACHMENT
// =====================================================

export const uploadAttachment = async (
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
        // AUTH
        // ---------------------------------------------

        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        // ---------------------------------------------
        // CONVERSATION
        // ---------------------------------------------

        if (!conversationId) {

            return res.status(400).json({

                success: false,

                message:
                    "Conversation ID is required",

            });

        }


        // ---------------------------------------------
        // FILE
        // ---------------------------------------------

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "No file selected",

            });

        }


        // ---------------------------------------------
        // ACCESS
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


        const file =
            req.file;


            console.log("========== ATTACHMENT DEBUG ==========");
console.log("FILE NAME:", file.originalname);
console.log("MIME TYPE:", file.mimetype);
console.log("SIZE:", file.size);
console.log("FIELD NAME:", file.fieldname);
console.log("======================================");

        // ---------------------------------------------
        // FILE SIZE
        // ---------------------------------------------

        const MAX_FILE_SIZE =
            100 * 1024 * 1024;


        if (
            file.size >
            MAX_FILE_SIZE
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "File size cannot exceed 100 MB",

            });

        }


        // ---------------------------------------------
        // FILE NAME
        // ---------------------------------------------

        const safeName =
            sanitizeFileName(
                file.originalname
            );


        const timestamp =
            Date.now();


        const randomPart =
            Math.random()
                .toString(36)
                .slice(2, 10);


        const storagePath =
            `${conversationId}/${userId}/${timestamp}-${randomPart}-${safeName}`;


        // ---------------------------------------------
        // UPLOAD TO SUPABASE STORAGE
        // ---------------------------------------------

        const {
            error: uploadError,
        } =
            await supabase
                .storage
                .from("chat-attachments")
                .upload(
                    storagePath,
                    file.buffer,
                    {
                        contentType:
                            file.mimetype,

                        upsert: false,
                    }
                );


        if (uploadError) {

            console.error(
                "Storage upload error:",
                uploadError
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to upload attachment",

                error:
                    uploadError.message,

            });

        }


        // ---------------------------------------------
        // PUBLIC URL
        // ---------------------------------------------

        const {
            data: publicData,
        } =
            supabase
                .storage
                .from(
                    "chat-attachments"
                )
                .getPublicUrl(
                    storagePath
                );


        const publicUrl =
            publicData?.publicUrl;


        if (!publicUrl) {

            return res.status(500).json({

                success: false,

                message:
                    "Attachment uploaded but URL could not be generated",

            });

        }


        // ---------------------------------------------
        // RESPONSE
        // ---------------------------------------------

        return res.status(201).json({

            success: true,

            attachment: {

                url:
                    publicUrl,

                path:
                    storagePath,

                name:
                    file.originalname,

                safeName,

                type:
                    file.mimetype,

                size:
                    file.size,

            },

        });


    } catch (error) {

        console.error(
            "Upload attachment exception:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error while uploading attachment",

            error:
                error.message,

        });

    }

};