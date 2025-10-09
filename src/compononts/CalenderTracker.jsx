// CalendarTracker.jsx
import React, { useEffect, useState, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../api/axios";
import { getUserId } from "../utils/getUserId";
import { Trash2 } from "lucide-react";

function CalendarTracker({ onActivityUpdate, newAlarm }) {
  const [date, setDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const userId = getUserId();
  const isMounted = useRef(true);

  // keep a snapshot for rollback in case optimistic update fails
  const lastCalendarSnapshot = useRef([]);

  useEffect(() => { 
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchCalendar();
  }, [userId]);

  // Add new alarm instantly & update activity (ensure shape matches calendar entries)
  useEffect(() => {
    if (!newAlarm) return;

    // newAlarm could be { alarm, createdEntries } or just alarm
    const entries = Array.isArray(newAlarm) ? newAlarm : (newAlarm.createdEntries || (newAlarm.alarm ? [] : []));
    // if newAlarm is { alarm } without createdEntries, just ignore (server may not have created entries)
    if (entries && entries.length > 0) {
      setCalendarData((prev) => {
        const key = (e) => `${e._id || e.id}_${new Date(e.date).toDateString()}_${e.time || ""}`;
        const seen = new Set(prev.map(key));
        const filtered = entries.filter((n) => !seen.has(key(n)));
        return [...prev, ...filtered];
      });
      if (onActivityUpdate) onActivityUpdate();
    }
  }, [newAlarm, onActivityUpdate]);

  const fetchCalendar = async () => {
    try {
      const res = await api.get(`/plantcare/calendar/${userId}`);
      const arr = Array.isArray(res.data.calendar) ? res.data.calendar : [];
      if (isMounted.current) setCalendarData(arr);
    } catch (err) {
      console.error("Error fetching calendar", err);
      if (isMounted.current) setCalendarData([]);
    }
  };

  /* ----------------- Optimistic Delete ----------------- */
  const handleDeleteClick = (entry) => {
    setSelectedEntry(entry);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedEntry) return;

    // store alarmId before clearing selectedEntry
    const alarmIdToDelete = selectedEntry.alarmId;
    lastCalendarSnapshot.current = calendarData;
    setCalendarData((prev) => prev.filter((item) => item._id !== selectedEntry._id));
    setShowDialog(false);
    setSelectedEntry(null);
    if (onActivityUpdate) onActivityUpdate();

    try {
      // delete the alarm (server will cleanup calendar and activity logs)
      await api.delete(`/plantcare/alarms/${alarmIdToDelete}`);
      // small delay and re-fetch to ensure DB and UI are in sync
      setTimeout(fetchCalendar, 600);
    } catch (err) {
      console.error("Error deleting alarm", err);
      // rollback
      if (isMounted.current) setCalendarData(lastCalendarSnapshot.current || []);
    }
  };

  /* -------------- Optimistic Checkbox Toggle -------------- */
  const handleCheckboxChange = async (calendarId, entry) => {
    const newStatus = entry.status === "completed" ? "uncompleted" : "completed";

    lastCalendarSnapshot.current = calendarData;
    setCalendarData((prev) =>
      prev.map((it) => (it._id === calendarId ? { ...it, status: newStatus } : it))
    );

    try {
      await api.put(`/plantcare/calendar/${calendarId}/status`, { status: newStatus });
      if (onActivityUpdate) onActivityUpdate();
      setTimeout(fetchCalendar, 600);
    } catch (err) {
      console.error("Error updating status", err);
      if (isMounted.current) setCalendarData(lastCalendarSnapshot.current || []);
    }
  };

  /* --------------- tileContent for calendar - shows dots ---------------- */
  const tileContent = ({ date: tileDate }) => {
    const dayEntries = calendarData.filter((item) => new Date(item.date).toDateString() === tileDate.toDateString());
    if (!dayEntries.length) return null;

    return (
      <div className="flex justify-center mt-1 space-x-1">
        {dayEntries.map((entry) => (
          <span
            key={`${entry._id}_${entry.time || "noTime"}`}
            className={`w-2 h-2 rounded-full ${
              entry.status === "completed"
                ? entry.activity === "Watering"
                  ? "bg-blue-500"
                  : entry.activity === "Fertilizing"
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : entry.status === "missed" || entry.status === "uncompleted"
                ? "bg-red-400"
                : "bg-gray-400"
            }`}
            title={`${entry.activity} (${entry.status})`}
          ></span>
        ))}
      </div>
    );
  };

  const currentDayEntries = calendarData.filter((item) => new Date(item.date).toDateString() === date.toDateString());

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold mb-4 text-center">📅 Activity Calendar</h2>

      <Calendar onChange={setDate} value={date} tileContent={tileContent} />

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2 text-center">Activities for {date.toDateString()}:</h3>
        <div className="space-y-2">
          {currentDayEntries.length ? (
            currentDayEntries.map((entry) => (
              <div key={entry._id} className="flex items-center justify-between gap-2 border-b pb-1">
                <label className="flex items-center gap-2 flex-grow">
                  <input type="checkbox" checked={entry.status === "completed"} onChange={() => handleCheckboxChange(entry._id, entry)} />
                  <span>
                    {entry.activity} at {entry.time || "—"} <span className="text-xs text-gray-500">({entry.status})</span>
                  </span>
                </label>
                <button onClick={() => handleDeleteClick(entry)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">No activities scheduled</p>
          )}
        </div>
      </div>

      {showDialog && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Delete Alarm</h3>
            <p className="mb-6 text-gray-700">
              Do you want to delete <span className="font-bold">{selectedEntry.activity} alarm for {selectedEntry.time || "—"}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDialog(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarTracker;