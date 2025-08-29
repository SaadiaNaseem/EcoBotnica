import express from "express";
import {
  createAlarm,
  getAlarms,
  updateAlarm,
  deleteAlarm,
  updateCalendarStatus,
  getCalendar,
  getActivity,
} from "../controllers/plantCareController.js";
import plantCareAuth from "../middleware/plantCareAuth.js";  // 👈 use the dedicated one

const router = express.Router();

// Alarms
router.post("/alarms", plantCareAuth, createAlarm);
router.get("/alarms/:userId?", plantCareAuth, getAlarms);
router.put("/alarms/:id", plantCareAuth, updateAlarm);
router.delete("/alarms/:id", plantCareAuth, deleteAlarm);

// Calendar
router.put("/calendar/:id/status", plantCareAuth, updateCalendarStatus);
router.get("/calendar/:userId?", plantCareAuth, getCalendar);

// Activity
router.get("/activity/:userId?", plantCareAuth, getActivity);

export default router;
