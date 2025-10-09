import NotificationModel from "../models/notificationModel.js";
import userModel from "../models/userModel.js";
import { generateTodayWeatherNotification } from "../utils/weatherNotifications.js";

export const sendWeatherNotifications = async (req, res) => {
  console.log("[Backend] ✅ /api/weather-notifications/send HIT");
  console.log("[Backend] Request body:", req.body);

  try {
    const { todayWeather } = req.body;
    if (!todayWeather) {
      console.log("[Backend] ❌ No todayWeather data provided");
      return res.status(400).json({ error: "No todayWeather data provided" });
    }

    const notificationObj = generateTodayWeatherNotification(todayWeather);
    if (!notificationObj) {
      console.log("[Backend] ℹ️ No weather alert generated for today");
      return res.json({ message: "No weather alert generated for today" });
    }

    console.log("[Backend] Notification content:", notificationObj);

    const users = await userModel.find({});
    console.log(`[Backend] Found ${users.length} users`);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    for (const user of users) {
      const exists = await NotificationModel.findOne({
        userId: user._id,
        category: "weather",
        content: notificationObj.content,
        date: { $gte: todayStart, $lte: todayEnd },
      });

      if (!exists) {
        const created = await NotificationModel.create({
          userId: user._id,
          sender: "System",
          category: "weather",
          title: notificationObj.title,
          content: notificationObj.content,
          date: new Date(),
          href: "/weather",
        });
        console.log(`[Backend] ✅ Created weather notification for ${user._id}`);
      } else {
        console.log(`[Backend] ⏩ Notification already exists for ${user._id}`);
      }
    }

    return res.json({ message: "Weather notifications processed successfully" });
  } catch (err) {
    console.error("[Backend] ❌ Error in sendWeatherNotifications:", err);
    return res.status(500).json({ error: "Failed to send weather notifications" });
  }
};
