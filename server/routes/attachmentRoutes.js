import express from "express";
import multer from "multer";

import {
    uploadAttachment,
} from "../controllers/attachmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();


// =====================================================
// MULTER
// =====================================================

const upload =
    multer({

        storage:
            multer.memoryStorage(),

        limits: {

            fileSize:
                100 * 1024 * 1024,

        },

    });


// =====================================================
// UPLOAD
// =====================================================

router.post(

    "/:conversationId",

    authMiddleware,

    upload.single("file"),

    uploadAttachment

);


export default router;