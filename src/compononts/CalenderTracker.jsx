// components/CalendarTracker.jsx
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const activities = [
  { id: "watering", label: "Watering" },
  { id: "fertilizing", label: "Fertilizing" },
  { id: "pruning", label: "Pruning" },
];

function CalendarTracker() {
  const [date, setDate] = useState(new Date());
  const [activityLog, setActivityLog] = useState({});

  const handleCheckboxChange = (activityId) => {
    const dateStr = date.toDateString();

    setActivityLog((prev) => {
      const current = prev[dateStr] || {};
      return {
        ...prev,
        [dateStr]: {
          ...current,
          [activityId]: !current[activityId],
        },
      };
    });
  };

  const tileContent = ({ date }) => {
    const dateStr = date.toDateString();
    const activitiesDone = activityLog[dateStr];

    if (!activitiesDone) return null;

    return (
      <div className="flex justify-center mt-1 space-x-1">
        {Object.entries(activitiesDone).map(
          ([activityId, done]) =>
            done && (
              <span
                key={activityId}
                className={`w-2 h-2 rounded-full ${
                  activityId === "watering"
                    ? "bg-blue-500"
                    : activityId === "fertilizing"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              ></span>
            )
        )}
      </div>
    );
  };

  const currentActivities = activityLog[date.toDateString()] || {};

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-4 text-center">📅 Activity Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
        className="border-none w-full"
      />

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-center">
          Activities for {date.toDateString()}:
        </h3>
        <div className="space-y-2">
          {activities.map((activity) => (
            <label key={activity.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!currentActivities[activity.id]}
                onChange={() => handleCheckboxChange(activity.id)}
              />
              <span>{activity.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarTracker;