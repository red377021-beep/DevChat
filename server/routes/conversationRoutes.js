import express from "express";

import {
    getOrCreateConversation,
    getMyConversations,
} from "../controllers/conversationController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router =
    express.Router();


// =====================================================
// GET MY CONVERSATIONS
// =====================================================

router.get(
    "/",
    authMiddleware,
    getMyConversations
);


// =====================================================
// GET OR CREATE CONVERSATION
// =====================================================

router.post(
    "/",
    authMiddleware,
    getOrCreateConversation
);


export default router;