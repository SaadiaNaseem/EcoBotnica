// Backend/models/calendarModel.js
import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    alarmId: { type: mongoose.Schema.Types.ObjectId, ref: "Alarm", required: true },
    activity: { type: String, required: true }, // copied from alarm (Watering/Pruning/Fertilizing)
    date: { type: Date, required: true }, // specific occurrence date (date-only part considered)
    time: { type: String, default: "" }, // optional time for the occurrence in "HH:mm"
    status: {
      type: String,
      enum: ["upcoming", "completed", "missed"],
      default: "upcoming",
    },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

const CalendarModel = mongoose.models.Calendar || mongoose.model("Calendar", CalendarSchema);
export default CalendarModel;
