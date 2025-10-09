// Backend/utils/notificationScheduler.js
import cron from "node-cron";
import AlarmModel from "../models/alarmModel.js";
import NotificationModel from "../models/notificationModel.js";
import moment from "moment";

// ⏰ Run every minute to check today's alarms
cron.schedule("* * * * *", async () => {
  try {
    const now = moment();
    const currentTime = now.format("HH:mm");

    // Get today's date (without time)
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    // Fetch all active alarms for today
    const alarms = await AlarmModel.find({
      status: "active",
      date: { $lte: todayEnd }, // alarms that started today or earlier
    });

    for (const alarm of alarms) {
      // Match any alarm time == current time
      if (alarm.times.includes(currentTime)) {
        const title = `${alarm.activity} Reminder`;
        const content = `${alarm.activity} reminder set at ${currentTime} for your plants.`;

        // Prevent duplicate notifications within 1 min
        const existing = await NotificationModel.findOne({
          userId: alarm.userId,
          title,
          content,
          createdAt: { $gte: moment().subtract(1, "minute").toDate() },
        });
        if (existing) continue;

        await NotificationModel.create({
          userId: alarm.userId,
          title,
          content,
          date: new Date(),
        });

        console.log(`🔔 Notification created for user ${alarm.userId} at ${currentTime}`);
      }
    }
  } catch (err) {
    console.error("Scheduler Error:", err);
  }
});
