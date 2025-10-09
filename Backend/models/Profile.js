import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  fullName: { type: String },
  nickName: { type: String },
  gender: { type: String },
  country: { type: String },
  language: { type: String },
  timeZone: { type: String },
  gardeningExperience: { type: String },
  favoritePlant: { type: String },
  profileImage: {
    url: { type: String },
    public_id: { type: String }
  },
  updatedAt: { type: Date, default: Date.now }
});

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
export default Profile;
