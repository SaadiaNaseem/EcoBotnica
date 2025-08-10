import React, { useState } from "react";

const SetAlarmForm = ({ date, setAlarmData }) => {
  const [activity, setActivity] = useState("Watering");
  const [frequency, setFrequency] = useState("Daily");
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");

  const renderFrequencyOptions = () => (
    <>
      <label className="block text-gray-700">Frequency</label>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        {activity === "Watering" ? (
          <>
            <option>Daily</option>
            <option>2 times a day</option>
            <option>Weekly</option>
          </>
        ) : (
          <>
            <option>Weekly</option>
            <option>After 2 weeks</option>
            <option>Monthly</option>
          </>
        )}
      </select>
    </>
  );

  const renderTimeInputs = () => {
    if (activity === "Watering" && frequency === "2 times a day") {
      return (
        <>
          <label className="block text-gray-700">Time 1</label>
          <input type="time" className="w-full p-2 border rounded-md" value={time1} onChange={(e) => setTime1(e.target.value)} />
          <label className="block text-gray-700">Time 2</label>
          <input type="time" className="w-full p-2 border rounded-md" value={time2} onChange={(e) => setTime2(e.target.value)} />
        </>
      );
    } else {
      return (
        <>
          <label className="block text-green-800">Time</label>
          <input type="time" className="w-full p-2 border rounded-md" value={time1} onChange={(e) => setTime1(e.target.value)} />
        </>
      );
    }
  };

  const handleSetAlarm = () => {
    const selectedDate = date.toDateString();

    if (activity === "Watering") {
      const newEntry = {
        activity,
        frequency,
        date: selectedDate,
        times: frequency === "2 times a day" ? [time1, time2] : [time1],
      };
      setAlarmData((prev) => [...prev, newEntry]);
    }

    if (activity === "Pruning") {
      const today = new Date(date);
      for (let i = 0; i < 4; i++) {
        const next = new Date(today);
        next.setDate(today.getDate() + i * 7);
        setAlarmData((prev) => [
          ...prev,
          {
            activity,
            frequency,
            date: next.toDateString(),
            times: [],
          },
        ]);
      }
    }

    if (activity === "Fertilizing") {
      const fertDate = new Date(date);
      fertDate.setDate(fertDate.getDate() + 9);
      setAlarmData((prev) => [
        ...prev,
        {
          activity,
          frequency,
          date: fertDate.toDateString(),
          times: [],
        },
      ]);
    }

    alert("Alarm set locally!");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Set Alarm</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700">Activity</label>
          <select
            value={activity}
            onChange={(e) => {
              setActivity(e.target.value);
              setFrequency("");
            }}
            className="w-full p-2 border rounded-md"
          >
            <option>Watering</option>
            <option>Pruning</option>
            <option>Fertilizing</option>
          </select>
        </div>
        <div>{renderFrequencyOptions()}</div>
        <div>{renderTimeInputs()}</div>

        <button
          type="button"
          onClick={handleSetAlarm}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm cursor-pointer"
        >
          Set Alarm
        </button>
      </form>
    </div>
  );
};

export default SetAlarmForm;
