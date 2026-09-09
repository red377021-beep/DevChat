import express from "express";

import {
    getMessages,
    sendMessage,
} from "../controllers/messageController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router =
    express.Router();


// =====================================================
// GET MESSAGES
// =====================================================

router.get(
    "/:conversationId",
    authMiddleware,
    getMessages
);


// =====================================================
// SEND MESSAGE
// =====================================================

router.post(
    "/:conversationId",
    authMiddleware,
    sendMessage
);


export default router;