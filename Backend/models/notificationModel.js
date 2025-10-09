// Backend/models/notificationModel.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    category: { type: String, default: "plant-care" },
    sender: { type: String, default: "System" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    href: { type: String, default: "/plant-care" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default NotificationModel;
