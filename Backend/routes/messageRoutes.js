import express from "express";
import { getMessages, postMessage, voteMessage } from "../controllers/messageController.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all messages
router.get("/", getMessages);

// POST a new message (open for now – add auth later if needed)
router.post("/", postMessage);

// PATCH vote (up/down) → you can protect this if required
router.patch("/:id/vote", voteMessage);

export default router;
