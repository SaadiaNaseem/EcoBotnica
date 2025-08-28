import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    text: { type: String },
    image: { type: String },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
