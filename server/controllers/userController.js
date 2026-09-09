// ======================================================
// DEVCHAT USER CONTROLLER
// ======================================================

import supabase from "../config/db.js";


// ======================================================
// GET CURRENT USER
// ======================================================

export const getMe = async (req, res) => {

    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication data",
            });
        }


        const {
            data: user,
            error,
        } = await supabase
            .from("users")
            .select(`
                id,
                username,
                email,
                full_name,
                bio,
                avatar_url,
                status,
                is_online,
                created_at,
                updated_at
            `)
            .eq("id", userId)
            .single();


        if (error) {

            console.error(
                "Get current user error:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch user",
            });

        }


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        }


        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {

        console.error(
            "GetMe error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get current user",
        });

    }

};


// ======================================================
// SEARCH USERS
// ======================================================

export const searchUsers = async (req, res) => {

    try {

        const currentUserId =
            req.user?.userId;

        const query =
            req.query.q?.trim();


        // ==================================================
        // VALIDATE SEARCH QUERY
        // ==================================================

        if (!query) {

            return res.status(400).json({

                success: false,

                message:
                    "Search query is required",

            });

        }


        if (query.length < 2) {

            return res.status(400).json({

                success: false,

                message:
                    "Search must contain at least 2 characters",

            });

        }


        // ==================================================
        // SEARCH USERNAME / EMAIL / FULL NAME
        // ==================================================

        const {
            data: users,
            error,
        } = await supabase

            .from("users")

            .select(`
                id,
                username,
                email,
                full_name,
                bio,
                avatar_url,
                status,
                is_online,
                created_at
            `)

            .or(
                `username.ilike.%${query}%,email.ilike.%${query}%,full_name.ilike.%${query}%`
            )

            .neq(
                "id",
                currentUserId
            )

            .order(
                "username",
                {
                    ascending: true,
                }
            )

            .limit(20);


        // ==================================================
        // DATABASE ERROR
        // ==================================================

        if (error) {

            console.error(
                "Search users error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to search users",

            });

        }


        // ==================================================
        // SUCCESS
        // ==================================================

        return res.status(200).json({

            success: true,

            users: users || [],

        });

    } catch (error) {

        console.error(
            "Search users exception:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "User search failed",

        });

    }

};