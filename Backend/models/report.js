import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportedBy: { type: String, required: true },
    reportedUser: { type: String, required: true },
    reason: { type: String, required: true },
    messageText: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
