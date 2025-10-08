// Backend/models/activityTrackerModel.js
import mongoose from "mongoose";

const ActivityTrackerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    // alarmId is optional now because some activity logs may not have an alarm reference
    alarmId: { type: mongoose.Schema.Types.ObjectId, ref: "Alarm", required: false },
    activity: { type: String, required: true }, // watering/pruning/fertilizing
    // status now includes all statuses used by CalendarModel/controller
    status: { type: String, enum: ["upcoming", "uncompleted", "completed", "missed"], required: true },
    timestamp: { type: Date, default: () => new Date() }, // when the action was recorded
  },
  { timestamps: true }
);

const ActivityTrackerModel =
  mongoose.models.ActivityTracker ||
  mongoose.model("ActivityTracker", ActivityTrackerSchema);
export default ActivityTrackerModel;