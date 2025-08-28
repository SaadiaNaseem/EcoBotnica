// Backend/controllers/plantCareController.js
import AlarmModel from "../models/alarmModel.js";
import CalendarModel from "../models/calendarModel.js";
import ActivityTrackerModel from "../models/activityTrackerModel.js";
import mongoose from "mongoose";
import dayjs from "dayjs";

/**
 * Helpers to generate calendar occurrences based on frequency.
 * You can tweak occurrence counts if desired.
 */

const toDateOnly = (d) => dayjs(d).startOf("day").toDate();

function addDays(date, days) {
  return dayjs(date).add(days, "day").toDate();
}
function addWeeks(date, weeks) {
  return dayjs(date).add(weeks, "week").toDate();
}
function addMonths(date, months) {
  return dayjs(date).add(months, "month").toDate();
}

/**
 * Create calendar occurrences for an alarm.
 * Behavior:
 *  - If frequency === "Daily" => create 30 daily occurrences (including base date).
 *  - If frequency includes "2 times" => create occurrences for the base date using each time.
 *  - If frequency === "Weekly" => create 12 weekly occurrences.
 *  - If frequency === "After 2 weeks" => create 1 occurrence at date+14.
 *  - If frequency === "Monthly" => create 6 monthly occurrences.
 *  - Default (Once) => create occurrence for base date (and times if provided).
 */
async function generateCalendarEntries(alarmDoc) {
  const entries = [];
  const baseDate = dayjs(alarmDoc.date).startOf("day");
  const times = Array.isArray(alarmDoc.times) ? alarmDoc.times : [];

  const pushEntry = (dateObj, timeStr = "") => {
    entries.push({
      userId: alarmDoc.userId,
      alarmId: alarmDoc._id,
      activity: alarmDoc.activity,
      date: dayjs(dateObj).startOf("day").toDate(),
      time: timeStr,
      status: "upcoming",
    });
  };

  const freq = (alarmDoc.frequency || "").toLowerCase();

  if (freq.includes("2 times")) {
    // create entries for the baseDate with each provided time
    if (times.length === 0) {
      // fallback: at midnight if none provided
      pushEntry(baseDate.toDate(), "");
    } else {
      times.forEach((t) => pushEntry(baseDate.toDate(), t));
    }
  } else if (freq === "daily") {
    for (let i = 0; i < 30; i++) {
      const d = baseDate.add(i, "day").toDate();
      if (times.length === 0) {
        pushEntry(d, "");
      } else {
        times.forEach((t) => pushEntry(d, t));
      }
    }
  } else if (freq === "weekly") {
    for (let i = 0; i < 12; i++) {
      const d = baseDate.add(i, "week").toDate();
      if (times.length === 0) pushEntry(d, "");
      else times.forEach((t) => pushEntry(d, t));
    }
  } else if (freq === "after 2 weeks") {
    const d = baseDate.add(14, "day").toDate();
    if (times.length === 0) pushEntry(d, "");
    else times.forEach((t) => pushEntry(d, t));
  } else if (freq === "monthly") {
    for (let i = 0; i < 6; i++) {
      const d = baseDate.add(i, "month").toDate();
      if (times.length === 0) pushEntry(d, "");
      else times.forEach((t) => pushEntry(d, t));
    }
  } else {
    // default once
    if (times.length === 0) pushEntry(baseDate.toDate(), "");
    else times.forEach((t) => pushEntry(baseDate.toDate(), t));
  }

  // Bulk insert entries (ignore duplicates using alarmId+date+time uniqueness check)
  if (entries.length > 0) {
    // Optional: remove duplicates for same alarm+date+time before inserting
    const uniqueKey = (e) => `${e.alarmId}_${dayjs(e.date).format("YYYY-MM-DD")}_${e.time || ""}`;
    const seen = new Set();
    const filtered = entries.filter((e) => {
      const k = uniqueKey(e);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    // Insert many
    const created = await CalendarModel.insertMany(filtered);
    return created;
  }
  return [];
}

/**
 * POST /alarms
 * Create alarm + generate calendar entries.
 */
export const createAlarm = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { activity, frequency, date, times } = req.body;
    if (!activity || !date) {
      return res.status(400).json({ message: "activity and date are required" });
    }

    const alarm = new AlarmModel({
      userId,
      activity,
      frequency: frequency || "Once",
      date: new Date(date),
      times: Array.isArray(times) ? times : [],
      setDate: new Date(),
      updatedDate: new Date(),
      status: "active",
    });

    const saved = await alarm.save();

    // generate calendar entries
    const createdEntries = await generateCalendarEntries(saved);

    return res.status(201).json({ alarm: saved, calendarCreated: createdEntries.length });
  } catch (err) {
    console.error("createAlarm error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /alarms/:userId
 * fetch alarms for a user (or /alarms?userId=)
 */
export const getAlarms = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId || (req.user && req.user.id);
    if (!userId) return res.status(400).json({ message: "userId required" });

    const alarms = await AlarmModel.find({ userId }).sort({ date: 1, createdAt: -1 }).lean();
    return res.status(200).json(alarms);
  } catch (err) {
    console.error("getAlarms error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /alarms/:id
 * Update alarm settings. We'll update alarm doc & regenerate future calendar entries (simple approach: delete future calendar entries for that alarm and regenerate).
 */
export const updateAlarm = async (req, res) => {
  try {
    const alarmId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(alarmId)) return res.status(400).json({ message: "Invalid alarm id" });

    const update = req.body;
    update.updatedDate = new Date();

    const alarm = await AlarmModel.findByIdAndUpdate(alarmId, update, { new: true });
    if (!alarm) return res.status(404).json({ message: "Alarm not found" });

    // Delete future calendar entries for this alarm (from today onwards)
    await CalendarModel.deleteMany({ alarmId: alarm._id, date: { $gte: dayjs().startOf("day").toDate() } });

    // regenerate based on updated alarm
    const createdEntries = await generateCalendarEntries(alarm);

    return res.status(200).json({ alarm, calendarCreated: createdEntries.length });
  } catch (err) {
    console.error("updateAlarm error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /alarms/:id
 * Delete alarm and cascade delete calendar + activity logs
 */
export const deleteAlarm = async (req, res) => {
  try {
    const alarmId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(alarmId)) return res.status(400).json({ message: "Invalid alarm id" });

    const alarm = await AlarmModel.findByIdAndDelete(alarmId);
    if (!alarm) return res.status(404).json({ message: "Alarm not found" });

    await CalendarModel.deleteMany({ alarmId: alarm._id });
    await ActivityTrackerModel.deleteMany({ alarmId: alarm._id });

    return res.status(200).json({ message: "Alarm and related entries deleted" });
  } catch (err) {
    console.error("deleteAlarm error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /calendar/:id/status
 * Update checkbox status for a calendar row (completed/missed)
 * Body: { status: "completed" | "missed" }
 *
 * When updating to completed or missed, we also create an ActivityTracker record.
 */
export const updateCalendarStatus = async (req, res) => {
  try {
    const calId = req.params.id;
    const { status } = req.body;
    if (!["completed", "missed", "upcoming"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const cal = await CalendarModel.findById(calId);
    if (!cal) return res.status(404).json({ message: "Calendar entry not found" });

    cal.status = status;
    cal.updatedAt = new Date();
    await cal.save();

    // log into activity tracker for completed/missed only (not for upcoming)
    if (status === "completed" || status === "missed") {
      const at = new ActivityTrackerModel({
        userId: cal.userId,
        alarmId: cal.alarmId,
        activity: cal.activity,
        status: status,
        timestamp: new Date(),
      });
      await at.save();
    }

    return res.status(200).json({ calendar: cal });
  } catch (err) {
    console.error("updateCalendarStatus error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /calendar/:userId
 * Return calendar entries for a user with simple aggregation to help frontend highlight dates.
 *
 * Response shape:
 * {
 *   calendar: [...entries...],
 *   highlights: {
 *     "2025-08-27": { date: "2025-08-27", totals: { total: 2, completed: 1, missed: 1 }, activities: { watering: 1, pruning: 0, fertilizing: 1 } }
 *   }
 * }
 */
export const getCalendar = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user && req.user.id);
    if (!userId) return res.status(400).json({ message: "userId required" });

    const entries = await CalendarModel.find({ userId }).sort({ date: 1, time: 1 }).lean();

    // Build highlights map
    const highlights = {}; // key: YYYY-MM-DD
    entries.forEach((e) => {
      const dKey = dayjs(e.date).format("YYYY-MM-DD");
      if (!highlights[dKey]) {
        highlights[dKey] = {
          date: dKey,
          totals: { total: 0, completed: 0, missed: 0, upcoming: 0 },
          activities: {}, // activity counts
          items: [],
        };
      }
      highlights[dKey].totals.total += 1;
      highlights[dKey].totals[e.status] = (highlights[dKey].totals[e.status] || 0) + 1;
      highlights[dKey].activities[e.activity] = (highlights[dKey].activities[e.activity] || 0) + 1;
      highlights[dKey].items.push({
        id: e._id,
        alarmId: e.alarmId,
        activity: e.activity,
        time: e.time,
        status: e.status,
      });
    });

    return res.status(200).json({ calendar: entries, highlights });
  } catch (err) {
    console.error("getCalendar error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /activity/:userId
 * Return activity tracker logs (optionally paginated)
 */
export const getActivity = async (req, res) => {
  try {
    const userId = req.params.userId || (req.user && req.user.id);
    if (!userId) return res.status(400).json({ message: "userId required" });

    const logs = await ActivityTrackerModel.find({ userId }).sort({ timestamp: -1 }).lean();
    return res.status(200).json(logs);
  } catch (err) {
    console.error("getActivity error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
