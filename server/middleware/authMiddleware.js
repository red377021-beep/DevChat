// ======================================================
// DEVCHAT AUTHENTICATION MIDDLEWARE
// ======================================================

import jwt from "jsonwebtoken";


// ======================================================
// AUTH MIDDLEWARE
// ======================================================

const authMiddleware = (req, res, next) => {

    try {

        // ==================================================
        // GET AUTHORIZATION HEADER
        // ==================================================

        const authHeader =
            req.headers.authorization;


        // ==================================================
        // CHECK TOKEN
        // ==================================================

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication required",

            });

        }


        // ==================================================
        // EXTRACT TOKEN
        // ==================================================

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                success: false,

                message:
                    "Authentication token missing",

            });

        }


        // ==================================================
        // VERIFY JWT
        // ==================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ==================================================
        // ATTACH USER TO REQUEST
        // ==================================================

        req.user = decoded;


        // ==================================================
        // CONTINUE
        // ==================================================

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired authentication token",

        });

    }

};


export default authMiddleware;