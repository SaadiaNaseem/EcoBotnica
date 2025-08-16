import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Droplet, Leaf, Bot, Send } from "lucide-react";
import Title from "../compononts/Title";
import CalendarTracker from "../compononts/Calendertracker";
import SetAlarmForm from "../compononts/SetAlarmForm";


const PlantCare = () => {
  const [date, setDate] = useState(new Date());
  const [activity, setActivity] = useState("Watering");
  const [frequency, setFrequency] = useState("Daily");
  const [showChatbot, setShowChatbot] = useState(false);
  const [time1, setTime1] = useState("");
  const [time2, setTime2] = useState("");
  const [alarmData, setAlarmData] = useState([]);


  const [chatMessages, setChatMessages] = useState([
    { sender: "user", text: "When to water basil?" },
    { sender: "bot", text: "Water basil every 2–3 days." },
  ]);
  const [chatInput, setChatInput] = useState("");

  const toggleChatbot = () => setShowChatbot(!showChatbot);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Bot reply to: ${userMessage.text}" },
      ]);
    }, 500);
  };

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push(nextDay.toDateString());
    }
    return days;
  };

  const weatherData = [
    "☀ Sunny", "⛅ Partly Cloudy", "🌧 Rainy",
    "🌤 Clear", "🌦 Light Showers", "☁ Cloudy", "🌧 Thunderstorms"
  ];

  const renderFrequencyOptions = () => {
    return (
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
  };

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

  return (
    <div className="py-12 bg-[#F4FFF4] min-h-screen p-6 relative">
      <div className="text-2xl mb-4">
        <Title text1="PLANT" text2="CARE" />
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left */}
        <div className="w-full md:w-1/2 space-y-6 mt-6 md:mt-0 md:pl-6">
          {/* Set Alarm */}
          <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Set Alarm</h2>
            <SetAlarmForm/>
          </div>

          {/* Activity Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-xl font-semibold ext-green-800 mb-4">Activity Tracker</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {alarmData.map((item, index) => (
                <li key={index}>
                  {item.activity === "Watering" && (
                    <>
                      <Droplet className="inline-block mr-2" />
                      Watering scheduled on <strong>{item.date}</strong>{" "}
                      {item.times.length > 0 && (
                        <span>{`at ${item.times.join(" & ")}`}</span>
                      )}
                    </>
                  )}
                  {item.activity === "Pruning" && (
                    <>
                      <Leaf className="inline-block mr-2" />
                      Pruning on <strong>{item.date}</strong>
                    </>
                  )}
                  {item.activity === "Fertilizing" && (
                    <>
                      <Leaf className="inline-block mr-2" />
                      Fertilizing due on <strong>{item.date}</strong>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Calendar</h2>
            <p className="text-gray-700 mb-2 font-medium">
              Keep track of your plant care activities below 🌱
            </p>
            <CalendarTracker />
          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 space-y-6 ml-[10px] relative">
          {/* Weather Update */}
          <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Weekly Weather Update</h2>
            <p className="text-gray-700 mb-2 font-medium">Today: {new Date().toDateString()}</p>
            <ul className="space-y-2 text-gray-700">
              {getNext7Days().map((day, index) => (
                <li key={index} className="flex justify-between border-b pb-1">
                  <span>{day}</span>
                  <span>{weatherData[index % weatherData.length]}</span>
                </li>
              ))}
            </ul>
          </div>

          {!showChatbot && (
            <div className="bg-white p-6 rounded-2xl shadow-md w-full flex flex-col items-center text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/10649/10649416.png"
                alt="Help Icon"
                className="w-56 h-56 mb-4 animate-zoom-in-out"
              />
              <p className="text-gray-700 text-sm font-medium">
                Need help? Try asking the chatbot:<br />
                <span className="italic text-green-800">“In Islamabad, I want to grow tomatoes. When's the best time?”</span>
              </p>
            </div>
          )}

          {showChatbot && (
            <div className="bg-white p-6 rounded-2xl shadow-md w-full">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Chatbot</h2>
              <div className="h-96 overflow-y-auto bg-[#f0f0f0] p-4 rounded-md mb-2 space-y-2">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md max-w-[80%] ${msg.sender === "user"
                      ? "bg-green-700 text-white ml-auto"
                      : "bg-gray-300 text-black border-l-4 border-green-700"
                      }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="w-full max-w-full flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow p-2 border border-r-0 rounded-l-md min-w-0"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 rounded-r-md shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={toggleChatbot}
            className="absolute bottom-0 right-0 bg-green-700 hover:bg-green-800 text-white p-4 rounded-full shadow-lg z-10"
          >
            <Bot size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCare;