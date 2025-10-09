// backend/controllers/profileController.js
import asyncHandler from "express-async-handler";
import Profile from "../models/Profile.js";
import User from "../models/userModel.js";
import { cloudinary } from "../config/cloudinary.js";
import { deleteUserRelatedData } from "../utils/deleteUserRelatedData.js";
import fs from "fs"; // ✅ Node ka built-in File System module


// Create / Update profile
export const upsertProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ success: false, message: "Not authorized" });

  const {
    fullName, nickName, gender, country,
    language, timeZone, gardeningExperience, favoritePlant, email
  } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Valid email required" });
  }

  const profileData = {
    userId,
    fullName, nickName, gender, country,
    language, timeZone, gardeningExperience, favoritePlant, updatedAt: new Date()
  };

  if (req.file) {
    const existing = await Profile.findOne({ userId });
    if (existing?.profileImage?.public_id) {
      try { await cloudinary.uploader.destroy(existing.profileImage.public_id); } catch (err) { console.warn("Cloudinary destroy fail", err.message); }
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ecobotanica/profiles" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer || fs.readFileSync(req.file.path));
    });

    profileData.profileImage = { url: uploadResult.secure_url || uploadResult.url, public_id: uploadResult.public_id };
  }

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: profileData },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (fullName || email) {
    await User.findByIdAndUpdate(userId, { $set: { name: fullName || undefined, email } }, { new: true });
  }

  return res.json({ success: true, message: "Profile saved", profile });
});

// Get current user's profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const profile = await Profile.findOne({ userId });
  return res.json({ success: true, profile });
});

// Delete account, profile and related data
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const profile = await Profile.findOne({ userId });
  if (profile?.profileImage?.public_id) {
    try { await cloudinary.uploader.destroy(profile.profileImage.public_id); } catch (err) { console.warn("Cloudinary destroy fail", err.message); }
  }

  await Profile.deleteOne({ userId });
  await User.findByIdAndDelete(userId);
  await deleteUserRelatedData(userId);

  return res.json({ success: true, message: "Account and all related data deleted" });
});