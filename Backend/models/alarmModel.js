// Backend/models/alarmModel.js
import mongoose from "mongoose";

const AlarmSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    activity: { type: String, required: true }, // "Watering" | "Pruning" | "Fertilizing"
    frequency: { type: String, default: "Once" }, // "Daily", "Weekly", "Monthly", "2 times a day", "After 2 weeks", etc.
    date: { type: Date, required: true }, // base date (start)
    times: { type: [String], default: [] }, // times in "HH:mm" format (one or many)
    setDate: { type: Date, default: () => new Date() },
    updatedDate: { type: Date, default: () => new Date() },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const AlarmModel = mongoose.models.Alarm || mongoose.model("Alarm", AlarmSchema);
export default AlarmModel;
