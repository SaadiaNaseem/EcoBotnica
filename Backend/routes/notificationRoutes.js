// Backend/routes/notificationRoutes.js
import express from "express";
import {
  createNotification,
  getUserNotifications,
  deleteNotification,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getUserNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
