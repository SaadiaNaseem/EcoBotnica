import express from "express";
import { getUserPerformance } from "../controllers/dashboardController.js";

const router = express.Router();

// simple test route to verify
router.get("/test", (req, res) => {
  res.json({ success: true, message: "✅ Dashboard route working" });
});

// main route
router.get("/:userId", getUserPerformance);

export default router;
