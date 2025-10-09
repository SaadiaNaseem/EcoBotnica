import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { getUserId } from "../utils/getUserId";

const SetAlarmForm = ({ onAlarmAdded }) => {
  const [activity, setActivity] = useState("Watering");
  const [frequency, setFrequency] = useState("Once");
  const [date, setDate] = useState("");
  const [times, setTimes] = useState([""]);
  const userId = getUserId();

  // Dialog states
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleAddTime = () => setTimes([...times, ""]);

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...times];
    updatedTimes[index] = value;
    setTimes(updatedTimes);
  };

  const resetForm = () => {
    setActivity("Watering");
    setFrequency("Once");
    setDate("");
    setTimes([""]);
  };

  const handleSetAlarm = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login to set alarms.");
      return;
    }

    setShowDialog(true);
    setDialogMessage("Setting alarm...");

    try {
      // Clean times array - only keep valid values
      const cleanedTimes = Array.isArray(times)
        ? times
            .map((t) => (typeof t === "string" ? t.trim() : t))
            .filter(Boolean)
        : [];

      const today = new Date().toISOString().split("T")[0];

      // Build payload
      const payload = {
        activity,
        frequency,
        date: frequency.toLowerCase() === "daily" ? today : date,
        times: cleanedTimes,
        userId,
      };

      console.log("📤 Sending payload to backend:", payload);

      const res = await api.post("/plantcare/alarms", payload);

      console.log("✅ Backend response:", res.data);

      if (res.data) {
        const createdEntries = res.data.calendarEntries || null;
        onAlarmAdded?.({ alarm: res.data.alarm, createdEntries });
        resetForm();

        setDialogMessage("Alarm set successfully!");
        setTimeout(() => setShowDialog(false), 1500);
      }
    } catch (err) {
      console.error("❌ Error saving alarm:", err.response?.data || err);

      const message =
        err.response?.data?.message ||
        "Server error: Failed to save alarm. Please try again.";

      alert(`Error: ${message}`);
      setShowDialog(false);
    }
  };

  return (
    <>
      {/* Animated Dialog */}
      <AnimatePresence>
        {showDialog && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-semibold text-green-800">
                {dialogMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSetAlarm}
        className="bg-white p-6 rounded-2xl shadow-md w-full"
      >
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          Set Plant Alarm
        </h2>
        <div className="space-y-4">
          {/* Activity */}
          <div>
            <label className="block text-gray-700">Activity</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="Watering">Watering</option>
              <option value="Pruning">Pruning</option>
              <option value="Fertilizing">Fertilizing</option>
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-gray-700">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="Once">Once</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="2 times a day">2 times a day</option>
              <option value="After 2 weeks">After 2 weeks</option>
            </select>
          </div>

          {/* Date (not needed for daily) */}
          {frequency !== "Daily" && (
            <div>
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-2 rounded w-full"
                required
              />
            </div>
          )}

          {/* Times (Optional) */}
          <div>
            <label className="block text-gray-700">Times (optional)</label>
            {times.map((t, i) => (
              <input
                key={i}
                type="time"
                value={t}
                onChange={(e) => handleTimeChange(i, e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
            ))}
            <button
              type="button"
              onClick={handleAddTime}
              className="bg-green-700 text-white px-3 py-1 rounded"
            >
              + Add Time
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Save Alarm
          </button>
        </div>
      </form>
    </>
  );
};

export default SetAlarmForm;
