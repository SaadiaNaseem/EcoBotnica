import AlarmModel from "../models/alarmModel.js";
import ActivityTrackerModel from "../models/activityTrackerModel.js";

export const getUserPerformance = async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await ActivityTrackerModel.find({ userId });

    const monthlyStats = {};
    const now = new Date();
    const currentYear = now.getFullYear();

    activities.forEach((act) => {
      const date = new Date(act.timestamp);
      if (date.getFullYear() !== currentYear) return;

      const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
      if (!monthlyStats[month]) {
        monthlyStats[month] = { Watering: 0, Pruning: 0, Fertilizing: 0 };
      }

      if (monthlyStats[month][act.activity] !== undefined) {
        monthlyStats[month][act.activity]++;
      }
    });

    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const chartData = months.map((m) => ({
      month: m,
      Watering: monthlyStats[m]?.Watering || 0,
      Pruning: monthlyStats[m]?.Pruning || 0,
      Fertilizing: monthlyStats[m]?.Fertilizing || 0,
    }));

    const upcoming = await AlarmModel.find({ userId, status: "active" }).sort({ date: 1 });

    const analytics = {
      watering: upcoming.find((a) => a.activity === "Watering"),
      pruning: upcoming.find((a) => a.activity === "Pruning"),
      fertilizing: upcoming.find((a) => a.activity === "Fertilizing"),
    };

    res.status(200).json({
      chartData,
      analytics: {
        watering: analytics.watering ? analytics.watering.date : null,
        pruning: analytics.pruning ? analytics.pruning.date : null,
        fertilizing: analytics.fertilizing ? analytics.fertilizing.date : null,
      },
    });
  } catch (err) {
    console.error("Error fetching performance data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
