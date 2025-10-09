import React, { useEffect, useState } from "react";
import { Droplet, Leaf, Bot, Send } from "lucide-react";
import Title from "../compononts/Title";
import CalendarTracker from "../compononts/CalenderTracker";
import SetAlarmForm from "../compononts/SetAlarmForm";
import api from "../api/axios";

const PlantCare = () => {
  const [alarmData, setAlarmData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAlarms();
    fetchActivityLogs();
  }, []);

  const fetchAlarms = async () => {
    try {
      const res = await api.get(`/plantcare/alarms/${userId}`);
      setAlarmData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching alarms", err);
      setAlarmData([]);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const res = await api.get(`/plantcare/activity/${userId}`);
      setActivityLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching activities", err);
      setActivityLogs([]);
    }
  };

  const toggleChatbot = () => setShowChatbot(!showChatbot);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMessage = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Bot reply to: ${userMessage.text}` },
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
    "☀ Sunny",
    "⛅ Partly Cloudy",
    "🌧 Rainy",
    "🌤 Clear",
    "🌦 Light Showers",
    "☁ Cloudy",
    "🌧 Thunderstorms",
  ];

  return (
    <div className="py-12 bg-[#F4FFF4] min-h-screen p-6 relative">
      <div className="text-2xl mb-4">
        <Title text1="PLANT" text2="CARE" />
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left */}
        <div className="w-full md:w-1/2 space-y-6 mt-6 md:mt-0 md:pl-6">
          <SetAlarmForm setAlarmData={setAlarmData} />
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
          {/* Weather */}
          <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Weekly Weather Update</h2>
            <p className="text-gray-700 mb-2 font-medium">
              Today: {new Date().toDateString()}
            </p>
            <ul className="space-y-2 text-gray-700">
              {getNext7Days().map((day, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>{day}</span>
                  <span>{weatherData[i % weatherData.length]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity Tracker */}
          <div className="bg-white p-6 rounded-2xl shadow-md w-full">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Activity Tracker</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {activityLogs.map((item, i) => (
                <li key={i}>
                  {item.activity === "Watering" && (
                    <>
                      <Droplet className="inline-block mr-2" /> Watering on{" "}
                      <strong>{new Date(item.timestamp || item.date).toDateString()}</strong>
                    </>
                  )}
                  {item.activity === "Pruning" && (
                    <>
                      <Leaf className="inline-block mr-2" /> Pruning on{" "}
                      <strong>{new Date(item.timestamp || item.date).toDateString()}</strong>
                    </>
                  )}
                  {item.activity === "Fertilizing" && (
                    <>
                      <Leaf className="inline-block mr-2" /> Fertilizing on{" "}
                      <strong>{new Date(item.timestamp || item.date).toDateString()}</strong>
                    </>
                  )}
                  {item.status === "missed" && (
                    <span className="text-red-600 ml-2">(Missed)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Chatbot */}
          {!showChatbot && (
            <div className="bg-white p-6 rounded-2xl shadow-md w-full flex flex-col items-center text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/10649/10649416.png"
                alt="Help Icon"
                className="w-56 h-56 mb-4 animate-zoom-in-out"
              />
              <p className="text-gray-700 text-sm font-medium">
                Need help? Try asking the chatbot:
                <br />
                <span className="italic text-green-800">
                  “In Islamabad, I want to grow tomatoes. When's the best time?”
                </span>
              </p>
            </div>
          )}
          {showChatbot && (
            <div className="bg-white p-6 rounded-2xl shadow-md w-full">
              <h2 className="text-xl font-semibold text-green-800 mb-4">Chatbot</h2>
              <div className="h-96 overflow-y-auto bg-[#f0f0f0] p-4 rounded-md mb-2 space-y-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-md max-w-[80%] ${
                      msg.sender === "user"
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
