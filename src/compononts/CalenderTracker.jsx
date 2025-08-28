import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api/axios";

function CalendarTracker() {
  const [date, setDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    try {
      const res = await api.get(`/plantcare/calendar/${userId}`);
      if (res.data && Array.isArray(res.data.calendar)) {
        setCalendarData(res.data.calendar);
      } else {
        setCalendarData([]);
      }
    } catch (err) {
      console.error("Error fetching calendar", err);
      setCalendarData([]);
    }
  };

  // ✅ Handle checkbox with upcoming/completed/missed logic
  const handleCheckboxChange = async (calendarId, entry) => {
    try {
      const now = new Date();
      const activityDate = new Date(entry.date);

      // check if today's activity
      const isToday = activityDate.toDateString() === now.toDateString();

      // by default upcoming
      let newStatus = "upcoming";

      if (entry.status === "completed") {
        // unchecking: revert depending on time
        if (now > activityDate && !isToday) {
          newStatus = "missed"; // past date
        } else if (isToday && now > activityDate.setHours(23, 59, 59, 999)) {
          newStatus = "missed"; // today but already finished
        } else {
          newStatus = "upcoming"; // still future today or upcoming date
        }
      } else {
        // checking the box → completed
        newStatus = "completed";
      }

      await api.put(`/plantcare/calendar/${calendarId}/status`, { status: newStatus });
      fetchCalendar();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const tileContent = ({ date }) => {
    const dayEntries = calendarData.filter(
      (item) => new Date(item.date).toDateString() === date.toDateString()
    );
    if (dayEntries.length === 0) return null;

    return (
      <div className="flex justify-center mt-1 space-x-1">
        {dayEntries.map((entry) => (
          <span
            key={entry._id}
            className={`w-2 h-2 rounded-full ${
              entry.status === "completed"
                ? entry.activity === "Watering"
                  ? "bg-blue-500"
                  : entry.activity === "Fertilizing"
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : entry.status === "upcoming"
                ? "bg-gray-400"
                : "bg-red-500"
            }`}
          ></span>
        ))}
      </div>
    );
  };

  const currentDayEntries = calendarData.filter(
    (item) => new Date(item.date).toDateString() === date.toDateString()
  );

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
          {currentDayEntries.map((entry) => (
            <label key={entry._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={entry.status === "completed"}
                onChange={() => handleCheckboxChange(entry._id, entry)}
              />
              <span>
                {entry.activityType}{" "}
                <span className="text-xs text-gray-500">({entry.status})</span>
              </span>
            </label>
          ))}
          {currentDayEntries.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No activities scheduled
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarTracker;
