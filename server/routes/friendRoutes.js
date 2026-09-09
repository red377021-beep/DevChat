// ======================================================
// DEVCHAT FRIEND ROUTES
// ======================================================

import express from "express";

import {
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
} from "../controllers/friendController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


// ======================================================
// SEND FRIEND REQUEST
// ======================================================

router.post(
    "/request",
    authMiddleware,
    sendFriendRequest
);


// ======================================================
// GET FRIEND REQUESTS
// ======================================================

router.get(
    "/requests",
    authMiddleware,
    getFriendRequests
);


// ======================================================
// ACCEPT FRIEND REQUEST
// ======================================================

router.put(
    "/requests/:id/accept",
    authMiddleware,
    acceptFriendRequest
);


// ======================================================
// REJECT FRIEND REQUEST
// ======================================================

router.put(
    "/requests/:id/reject",
    authMiddleware,
    rejectFriendRequest
);


export default router;