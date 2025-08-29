// Backend/models/activityTrackerModel.js
import mongoose from "mongoose";

const ActivityTrackerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    alarmId: { type: mongoose.Schema.Types.ObjectId, ref: "Alarm", required: true },
    activity: { type: String, required: true }, // watering/pruning/fertilizing
    status: { type: String, enum: ["completed", "missed"], required: true },
    timestamp: { type: Date, default: () => new Date() }, // when the action was recorded
  },
  { timestamps: true }
);

const ActivityTrackerModel =
  mongoose.models.ActivityTracker ||
  mongoose.model("ActivityTracker", ActivityTrackerSchema);
export default ActivityTrackerModel;
