// ======================================================
// DEVCHAT USER ROUTES
// ======================================================

import express from "express";

import {
    getMe,
    searchUsers,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


// ======================================================
// CURRENT USER
// ======================================================

router.get(
    "/me",
    authMiddleware,
    getMe
);


// ======================================================
// SEARCH USERS
// ======================================================

router.get(
    "/search",
    authMiddleware,
    searchUsers
);


export default router;