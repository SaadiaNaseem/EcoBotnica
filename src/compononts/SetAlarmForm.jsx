import React, { useState } from "react";
import api from "../api/axios"; // use axios instance

const SetAlarmForm = ({ setAlarmData }) => {
  const [activity, setActivity] = useState("Watering");
  const [frequency, setFrequency] = useState("Once");
  const [date, setDate] = useState("");
  const [times, setTimes] = useState([""]);

  const userId = localStorage.getItem("userId"); // 👈 get userId from localStorage

  const handleAddTime = () => setTimes([...times, ""]);
  const handleTimeChange = (i, val) => {
    const updated = [...times];
    updated[i] = val;
    setTimes(updated);
  };

  const handleSetAlarm = async (e) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split("T")[0];

      const payload = {
        activity,
        frequency,
        date: frequency === "Daily" ? today : date,
        times,
      };

      const res = await api.post("/plantcare/alarms", payload);

      if (res.data && res.data.alarm) {
        setAlarmData((prev) => [...prev, res.data.alarm]);
        setActivity("Watering");
        setFrequency("Once");
        setDate("");
        setTimes([""]);
      }
    } catch (err) {
      console.error("Error saving alarm", err);
      alert("Failed to save alarm. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSetAlarm}
      className="bg-white p-6 rounded-2xl shadow-md w-full"
    >
      <h2 className="text-xl font-semibold text-green-800 mb-4">Set Plant Alarm</h2>
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

        {/* Date — hide if Daily */}
        {frequency !== "Daily" && (
          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-full"
              required={frequency === "Once"}
            />
          </div>
        )}

        {/* Times */}
        <div>
          <label className="block text-gray-700">Times</label>
          {times.map((t, i) => (
            <input
              key={i}
              type="time"
              value={t}
              onChange={(e) => handleTimeChange(i, e.target.value)}
              className="border p-2 rounded w-full mb-2"
              required
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

        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
        >
          Save Alarm
        </button>
      </div>
    </form>
  );
};

export default SetAlarmForm;
