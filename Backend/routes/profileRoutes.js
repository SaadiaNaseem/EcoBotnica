// backend/routes/profileRoute.js
import express from "express";
import { upsertProfile, getMyProfile, deleteAccount } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.post("/", protect, upload.single("profileImage"), upsertProfile);
router.put("/", protect, upload.single("profileImage"), upsertProfile);
router.delete("/", protect, deleteAccount);

export default router;
