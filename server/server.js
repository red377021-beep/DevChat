import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { createServer } from "http";
import { Server } from "socket.io";

import supabase from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import attachmentRoutes from "./routes/attachmentRoutes.js";


// ======================================================
// ENVIRONMENT CHECK
// ======================================================

const requiredEnvironmentVariables = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "JWT_SECRET",
];

for (const variable of requiredEnvironmentVariables) {

    if (!process.env[variable]) {

        console.error(
            `❌ ${variable} is missing from .env`
        );

        process.exit(1);

    }

}


// ======================================================
// CONFIGURATION
// ======================================================

const PORT =
    Number(process.env.PORT) || 5000;

const CLIENT_URL =
    process.env.CLIENT_URL ||
    "http://localhost:5173";


// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

const httpServer =
    createServer(app);


// ======================================================
// SOCKET.IO
// ======================================================

const io = new Server(
    httpServer,
    {

        cors: {

            origin: CLIENT_URL,

            credentials: true,

        },

        transports: [
            "websocket",
            "polling"
        ],

    }
);


// ======================================================
// MAKE SOCKET.IO AVAILABLE TO EXPRESS
// ======================================================

app.set(
    "io",
    io
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(

    cors({

        origin: CLIENT_URL,

        credentials: true,

    })

);


app.use(

    express.json({

        limit: "10mb",

    })

);


app.use(

    express.urlencoded({

        extended: true,

        limit: "10mb",

    })

);


app.use(cookieParser());


// ======================================================
// SECURITY / BASIC HEADERS
// ======================================================

app.disable("x-powered-by");


// ======================================================
// ROOT ROUTE
// ======================================================

app.get(

    "/",

    (req, res) => {

        res.json({

            success: true,

            message:
                "DevChat Server is running 🚀",

            status:
                "online",

            version:
                "1.0.0",

        });

    }

);


// ======================================================
// HEALTH CHECK
// ======================================================

app.get(

    "/api/health",

    async (req, res) => {

        try {

            const {
                error,
            } = await supabase

                .from("users")

                .select("id")

                .limit(1);


            if (error) {

                console.error(
                    "❌ Supabase health check failed:",
                    error.message
                );


                return res.status(500).json({

                    success: false,

                    message:
                        "Supabase connection failed",

                    error:
                        error.message,

                });

            }


            return res.json({

                success: true,

                message:
                    "DevChat API + Supabase are working",

                status:
                    "healthy",

            });

        }

        catch (error) {

            console.error(
                "❌ Health check error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Health check failed",

                error:
                    error.message,

            });

        }

    }

);


// ======================================================
// AUTH ROUTES
// ======================================================

app.use(

    "/api/auth",

    authRoutes

);


// ======================================================
// ATTACHMENT ROUTES
// ======================================================

app.use(

    "/api/attachments",

    attachmentRoutes

);


// ======================================================
// USER ROUTES
// ======================================================

app.use(

    "/api/users",

    userRoutes

);


// ======================================================
// FRIEND ROUTES
// ======================================================

app.use(

    "/api/friends",

    friendRoutes

);


// ======================================================
// CONVERSATION ROUTES
// ======================================================

app.use(

    "/api/conversations",

    conversationRoutes

);


// ======================================================
// MESSAGE ROUTES
// ======================================================

app.use(

    "/api/messages",

    messageRoutes

);


// ======================================================
// SOCKET HELPERS
// ======================================================

function getUserRoom(userId) {

    if (!userId) {
        return null;
    }

    return `user:${String(userId)}`;

}


function getConversationRoom(conversationId) {

    if (!conversationId) {
        return null;
    }

    return `conversation:${String(conversationId)}`;

}


function isSocketRegistered(socket) {

    return Boolean(
        socket.data?.userId
    );

}


function logSocketEvent(
    event,
    socket,
    extra = ""
) {

    console.log(
        `🔌 [${event}] ${socket.id} ${extra}`
    );

}


// ======================================================
// SOCKET.IO
// ======================================================

io.on(

    "connection",

    (socket) => {

        console.log(
            "----------------------------------------"
        );

        console.log(
            "🔌 Socket connected:",
            socket.id
        );

        console.log(
            "🌐 Transport:",
            socket.conn.transport.name
        );

        console.log(
            "----------------------------------------"
        );


        // ==================================================
        // REGISTER USER
        //
        // Every device/browser of a user joins:
        //
        // user:<userId>
        //
        // Example:
        //
        // Account A
        //
        // PC       → user:123
        // Phone    → user:123
        // Laptop   → user:123
        //
        // All devices receive events for that account.
        // ==================================================

        socket.on(

            "register_user",

            (userId) => {

                if (
                    userId === undefined ||
                    userId === null ||
                    userId === ""
                ) {

                    console.log(

                        "⚠️ Socket tried to register without user ID:",

                        socket.id

                    );

                    return;

                }


                const normalizedUserId =
                    String(userId).trim();


                if (!normalizedUserId) {

                    console.log(

                        "⚠️ Invalid user ID received:",

                        socket.id

                    );

                    return;

                }


                // ------------------------------------------
                // Leave previous user room if socket changes
                // account/session.
                // ------------------------------------------

                const previousUserId =
                    socket.data?.userId;


                if (
                    previousUserId &&
                    String(previousUserId) !==
                        normalizedUserId
                ) {

                    const previousRoom =
                        getUserRoom(
                            previousUserId
                        );


                    if (previousRoom) {

                        socket.leave(
                            previousRoom
                        );


                        console.log(

                            `🚪 ${socket.id} left previous user room: ${previousRoom}`

                        );

                    }

                }


                // ------------------------------------------
                // Save user ID on socket
                // ------------------------------------------

                socket.data.userId =
                    normalizedUserId;


                // ------------------------------------------
                // User-specific room
                // ------------------------------------------

                const userRoom =
                    getUserRoom(
                        normalizedUserId
                    );


                socket.join(
                    userRoom
                );


                console.log(
                    `👤 ${socket.id} registered as user ${normalizedUserId}`
                );


                console.log(
                    `🏠 Joined user room: ${userRoom}`
                );


                logSocketEvent(
                    "REGISTER",
                    socket,
                    `userId=${normalizedUserId}`
                );

            }

        );


        // ==================================================
        // JOIN CONVERSATION
        // ==================================================

        socket.on(

            "join_conversation",

            (data) => {

                const conversationId =

                    typeof data === "string"

                        ? data

                        : data?.conversationId;


                if (!conversationId) {

                    console.log(

                        "⚠️ Socket tried to join without conversation ID:",

                        socket.id

                    );

                    return;

                }


                const room =
                    getConversationRoom(
                        conversationId
                    );


                socket.join(
                    room
                );


                console.log(
                    `💬 ${socket.id} joined ${room}`
                );


                logSocketEvent(
                    "JOIN_CONVERSATION",
                    socket,
                    `conversationId=${conversationId}`
                );

            }

        );


        // ==================================================
        // LEAVE CONVERSATION
        // ==================================================

        socket.on(

            "leave_conversation",

            (data) => {

                const conversationId =

                    typeof data === "string"

                        ? data

                        : data?.conversationId;


                if (!conversationId) {

                    console.log(

                        "⚠️ Leave conversation requested without ID:",

                        socket.id

                    );

                    return;

                }


                const room =
                    getConversationRoom(
                        conversationId
                    );


                socket.leave(
                    room
                );


                console.log(
                    `🚪 ${socket.id} left ${room}`
                );


                logSocketEvent(
                    "LEAVE_CONVERSATION",
                    socket,
                    `conversationId=${conversationId}`
                );

            }

        );


        // ==================================================
        // WEBRTC CALL SIGNALING
        // ==================================================


        // ==================================================
        // CALL OFFER
        // ==================================================

        socket.on(

            "call:offer",

            (data) => {

                if (
                    !isSocketRegistered(socket)
                ) {

                    console.log(

                        "⚠️ Call offer rejected: socket is not registered",

                        socket.id

                    );

                    return;

                }


                const {
                    to,
                    offer,
                    callType,
                    caller
                } = data || {};


                if (!to || !offer) {

                    console.log(

                        "⚠️ Invalid call offer from:",

                        socket.id

                    );

                    return;

                }


                const targetUserId =
                    String(to).trim();


                if (!targetUserId) {

                    return;

                }


                const targetRoom =
                    getUserRoom(
                        targetUserId
                    );


                if (!targetRoom) {

                    return;

                }


                const callerUserId =
                    socket.data.userId;


                const callerData =
                    caller || {};


                const callPayload = {

                    // Debug/trace socket ID.
                    // Routing does NOT depend on this.
                    from:
                        socket.id,

                    // Real account identity.
                    fromUserId:
                        callerUserId,

                    offer,

                    callType:
                        callType === "video"
                            ? "video"
                            : "audio",

                    caller: {

                        ...callerData,

                        id:
                            callerData.id ||
                            callerUserId,

                    },

                };


                io.to(
                    targetRoom
                ).emit(

                    "call:offer",

                    callPayload

                );


                console.log(

                    `📞 Call offer: user ${callerUserId} → user ${targetUserId}`

                );


                logSocketEvent(

                    "CALL_OFFER",

                    socket,

                    `from=${callerUserId} to=${targetUserId} type=${callPayload.callType}`

                );

            }

        );


        // ==================================================
        // CALL ANSWER
        // ==================================================

        socket.on(

            "call:answer",

            (data) => {

                if (
                    !isSocketRegistered(socket)
                ) {

                    console.log(

                        "⚠️ Call answer rejected: socket is not registered",

                        socket.id

                    );

                    return;

                }


                const {
                    to,
                    answer
                } = data || {};


                if (!to || !answer) {

                    console.log(

                        "⚠️ Invalid call answer from:",

                        socket.id

                    );

                    return;

                }


                const targetUserId =
                    String(to).trim();


                const targetRoom =
                    getUserRoom(
                        targetUserId
                    );


                if (!targetRoom) {

                    return;

                }


                io.to(
                    targetRoom
                ).emit(

                    "call:answer",

                    {

                        from:
                            socket.id,

                        fromUserId:
                            socket.data.userId,

                        answer,

                    }

                );


                console.log(

                    `📞 Call answer: user ${socket.data.userId} → user ${targetUserId}`

                );


                logSocketEvent(

                    "CALL_ANSWER",

                    socket,

                    `from=${socket.data.userId} to=${targetUserId}`

                );

            }

        );


        // ==================================================
        // ICE CANDIDATE
        // ==================================================

        socket.on(

            "call:ice-candidate",

            (data) => {

                if (
                    !isSocketRegistered(socket)
                ) {

                    console.log(

                        "⚠️ ICE candidate rejected: socket is not registered",

                        socket.id

                    );

                    return;

                }


                const {
                    to,
                    candidate
                } = data || {};


                if (!to || !candidate) {

                    console.log(

                        "⚠️ Invalid ICE candidate from:",

                        socket.id

                    );

                    return;

                }


                const targetUserId =
                    String(to).trim();


                const targetRoom =
                    getUserRoom(
                        targetUserId
                    );


                if (!targetRoom) {

                    return;

                }


                io.to(
                    targetRoom
                ).emit(

                    "call:ice-candidate",

                    {

                        from:
                            socket.id,

                        fromUserId:
                            socket.data.userId,

                        candidate,

                    }

                );


                logSocketEvent(

                    "CALL_ICE",

                    socket,

                    `from=${socket.data.userId} to=${targetUserId}`

                );

            }

        );


        // ==================================================
        // CALL DECLINE
        // ==================================================

        socket.on(

            "call:decline",

            (data) => {

                if (
                    !isSocketRegistered(socket)
                ) {

                    console.log(

                        "⚠️ Call decline rejected: socket is not registered",

                        socket.id

                    );

                    return;

                }


                const {
                    to
                } = data || {};


                if (!to) {

                    return;

                }


                const targetUserId =
                    String(to).trim();


                const targetRoom =
                    getUserRoom(
                        targetUserId
                    );


                if (!targetRoom) {

                    return;

                }


                io.to(
                    targetRoom
                ).emit(

                    "call:decline",

                    {

                        from:
                            socket.id,

                        fromUserId:
                            socket.data.userId,

                    }

                );


                console.log(

                    `📵 Call declined: user ${socket.data.userId} → user ${targetUserId}`

                );


                logSocketEvent(

                    "CALL_DECLINE",

                    socket,

                    `from=${socket.data.userId} to=${targetUserId}`

                );

            }

        );


        // ==================================================
        // CALL END
        // ==================================================

        socket.on(

            "call:end",

            (data) => {

                if (
                    !isSocketRegistered(socket)
                ) {

                    console.log(

                        "⚠️ Call end rejected: socket is not registered",

                        socket.id

                    );

                    return;

                }


                const {
                    to
                } = data || {};


                if (!to) {

                    return;

                }


                const targetUserId =
                    String(to).trim();


                const targetRoom =
                    getUserRoom(
                        targetUserId
                    );


                if (!targetRoom) {

                    return;

                }


                io.to(
                    targetRoom
                ).emit(

                    "call:end",

                    {

                        from:
                            socket.id,

                        fromUserId:
                            socket.data.userId,

                    }

                );


                console.log(

                    `📴 Call ended: user ${socket.data.userId} → user ${targetUserId}`

                );


                logSocketEvent(

                    "CALL_END",

                    socket,

                    `from=${socket.data.userId} to=${targetUserId}`

                );

            }

        );


        // ==================================================
        // SOCKET DISCONNECT
        // ==================================================

        socket.on(

            "disconnect",

            (reason) => {

                console.log(
                    "----------------------------------------"
                );

                console.log(
                    "🔌 Socket disconnected:",
                    socket.id
                );

                console.log(
                    "👤 User:",
                    socket.data?.userId ||
                    "unknown"
                );

                console.log(
                    "📌 Reason:",
                    reason
                );

                console.log(
                    "----------------------------------------"
                );

            }

        );

    }

);


// ======================================================
// 404 ROUTE
// ======================================================

app.use(

    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route not found",

            path:
                req.originalUrl,

        });

    }

);


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(

    (err, req, res, next) => {

        console.error(
            "❌ Server Error:",
            err
        );


        res.status(
            err.status || 500
        ).json({

            success: false,

            message:
                err.message ||
                "Internal server error",

        });

    }

);


// ======================================================
// PROCESS ERROR HANDLING
// ======================================================

process.on(

    "uncaughtException",

    (error) => {

        console.error(
            "❌ UNCAUGHT EXCEPTION:",
            error
        );

    }

);


process.on(

    "unhandledRejection",

    (reason) => {

        console.error(
            "❌ UNHANDLED PROMISE REJECTION:",
            reason
        );

    }

);


// ======================================================
// GRACEFUL SHUTDOWN
// ======================================================

function gracefulShutdown(signal) {

    console.log(
        `\n🛑 ${signal} received. Shutting down DevChat...`
    );


    io.close(
        () => {

            console.log(
                "🔌 Socket.IO server closed"
            );


            httpServer.close(
                () => {

                    console.log(
                        "🌐 HTTP server closed"
                    );


                    process.exit(0);

                }

            );

        }

    );

}


process.on(
    "SIGINT",
    () => gracefulShutdown("SIGINT")
);


process.on(
    "SIGTERM",
    () => gracefulShutdown("SIGTERM")
);


// ======================================================
// START SERVER
// ======================================================

httpServer.listen(

    PORT,

    () => {

        console.log(
            ""
        );

        console.log(
            "========================================"
        );

        console.log(
            "🚀 DEVCHAT SERVER STARTED"
        );

        console.log(
            "========================================"
        );

        console.log(
            `🌐 Server: http://localhost:${PORT}`
        );

        console.log(
            `🖥️ Client: ${CLIENT_URL}`
        );

        console.log(
            "🗄️ Supabase: configured"
        );

        console.log(
            "🔐 Authentication: enabled"
        );

        console.log(
            "👤 User API: enabled"
        );

        console.log(
            "👥 Friend API: enabled"
        );

        console.log(
            "💬 Conversation API: enabled"
        );

        console.log(
            "💬 Message API: enabled"
        );

        console.log(
            "📎 Attachment API: enabled"
        );

        console.log(
            "🔌 Socket.IO: enabled"
        );

        console.log(
            "🏠 Conversation rooms: enabled"
        );

        console.log(
            "👤 User rooms: enabled"
        );

        console.log(
            "📞 WebRTC signaling: enabled"
        );

        console.log(
            "📱 Multi-device calling: enabled"
        );

        console.log(
            "🛡️ Socket registration checks: enabled"
        );

        console.log(
            "🧹 Graceful shutdown: enabled"
        );

        console.log(
            "========================================"
        );

    }

);