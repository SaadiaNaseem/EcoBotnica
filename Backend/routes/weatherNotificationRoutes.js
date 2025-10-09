// routes/weatherNotificationRoutes.js
import express from "express";
import { sendWeatherNotifications } from "../controllers/weatherNotificationController.js";

const router = express.Router();

router.post("/send", sendWeatherNotifications);

export default router;
