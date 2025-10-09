// import express from "express";
// import {
//   createAlarm,
//   getAlarms,
//   updateAlarm,
//   deleteAlarm,
//   updateCalendarStatus,
//   getCalendar,
//   getActivity,
// } from "../controllers/plantCareController.js";
// import plantCareAuth from "../middleware/plantCareAuth.js";  // 👈 use the dedicated one

// const router = express.Router();

// // Alarms
// router.post("/alarms", plantCareAuth, createAlarm);
// router.get("/alarms/:userId?", plantCareAuth, getAlarms);
// router.put("/alarms/:id", plantCareAuth, updateAlarm);
// router.delete("/alarms/:id", plantCareAuth, deleteAlarm);

// // Calendar
// router.put("/calendar/:id/status", plantCareAuth, updateCalendarStatus);
// router.get("/calendar/:userId?", plantCareAuth, getCalendar);

// // Activity
// router.get("/activity/:userId?", plantCareAuth, getActivity);

// export default router;



// SAIRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

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

// --------------------
// Alarms
// --------------------
router.post("/alarms", plantCareAuth, createAlarm);

// List all alarms (e.g., for current user or all users, depending on auth logic)
router.get("/alarms", plantCareAuth, getAlarms);

// Get alarms by userId
router.get("/alarms/:userId", plantCareAuth, getAlarms);

// Update a specific alarm
router.put("/alarms/:id", plantCareAuth, updateAlarm);

// Delete a specific alarm
router.delete("/alarms/:id", plantCareAuth, deleteAlarm);

// --------------------
// Calendar
// --------------------
router.put("/calendar/:id/status", plantCareAuth, updateCalendarStatus);

// Get calendar (no userId param)
router.get("/calendar", plantCareAuth, getCalendar);

// Get calendar by userId
router.get("/calendar/:userId", plantCareAuth, getCalendar);

// --------------------
// Activity
// --------------------
router.get("/activity", plantCareAuth, getActivity);
router.get("/activity/:userId", plantCareAuth, getActivity);

export default router;
