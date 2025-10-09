// Backend/controllers/notificationController.js
import mongoose from "mongoose";
import NotificationModel from "../models/notificationModel.js";

// 📩 Create new notification
export const createNotification = async (req, res) => {
  try {
    const notification = await NotificationModel.create(req.body);
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: "Failed to create notification", details: err });
  }
};

// 📜 Get all notifications for a user

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    
    const notifications = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// 👀 Mark as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationModel.findByIdAndUpdate(id, { isRead: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// ❌ Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await NotificationModel.findByIdAndDelete(id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
