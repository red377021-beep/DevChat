import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());


// ==========================================
// TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "DevChat Server is running 🚀",
        status: "online",
    });
});


app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "DevChat API is working",
    });
});


// ==========================================
// SOCKET.IO
// ==========================================

io.on("connection", (socket) => {

    console.log(
        "Socket connected:",
        socket.id
    );


    socket.on("disconnect", () => {

        console.log(
            "Socket disconnected:",
            socket.id
        );

    });

});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {

    console.log(
        `DevChat Server running on http://localhost:${PORT}`
    );

});