import React, { useEffect, useState, useContext, useRef} from "react";
import { Droplet, Leaf, Bot, Send, ArrowLeft } from "lucide-react";
import { FaBell, FaCalendarAlt, FaCloudSun, FaRobot } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Title from "../compononts/Title";
import CalendarTracker from "../compononts/CalenderTracker";
import SetAlarmForm from "../compononts/SetAlarmForm";
import api from "../api/axios";
import { getUserId } from "../utils/getUserId";
import { WeatherContext } from "../context/WeatherContext";
import { ChatbotContext } from "../context/ChatbotContext";

// ==================================================
// PlantCareRefactor.jsx (single-file bundle of new UI)
// - QuickAccessCards (grid of 4 cards)
// - BackButton
// - Section wrappers that reuse your existing components
// - Card expansion animation: simple fade + scale that looks smooth and is easy
// Note: this file still *uses* your original SetAlarmForm, CalendarTracker, WeatherContext, ChatbotContext, and api calls.
// ==================================================

const cardData = [
  {
    id: "alarm",
    title: "Set Alarm",
    desc: "Create reminders for watering, pruning & fertilizing",
    Icon: FaBell,
  },
  {
    id: "calendar",
    title: "Calendar",
    desc: "View and manage plant care activities",
    Icon: FaCalendarAlt,
  },
  {
    id: "weather",
    title: "Weather",
    desc: "Weekly weather updates for your city",
    Icon: FaCloudSun,
  },
  {
    id: "chatbot",
    title: "Chatbot",
    desc: "Ask the plant assistant questions",
    Icon: FaRobot,
  },
];

// ------------------ BackButton ------------------
const BackButton = ({ onBack }) => {
  return (
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-green-800 hover:text-green-900 rounded p-2"
    >
      <ArrowLeft size={18} />
      <span className="font-medium">Back</span>
    </button>
  );
};

// ------------------ QuickAccessCards ------------------
const QuickAccessCards = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((c, i) => (
        <motion.div
          key={c.id}
          layout
          whileHover={{ scale: 1.03, y: -6 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          onClick={() => onSelect(c.id)}
          className="cursor-pointer bg-white rounded-2xl shadow-md p-6 flex flex-col items-start gap-4 hover:shadow-xl"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-green-50">
            <c.Icon size={28} className="text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">{c.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
          </div>
          <div className="mt-auto text-xs text-gray-400">Click to open</div>
        </motion.div>
      ))}
    </div>
  );
};

// ------------------ AlarmSection ------------------
const AlarmSection = ({ onBack, onAlarmAdded }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <BackButton onBack={onBack} />
        <h2 className="text-2xl font-bold text-green-800">Set Alarm</h2>
        <div style={{ width: 64 }} />
      </div>

      <SetAlarmForm onAlarmAdded={onAlarmAdded} />
    </motion.div>
  );
};

// ------------------ CalendarActivitySection ------------------
const CalendarActivitySection = ({ onBack, alarmData, setAlarmData, activityLogs, setActivityLogs, fetchActivityLogs, newAlarm }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <BackButton onBack={onBack} />
        <h2 className="text-2xl font-bold text-green-800">Calendar & Activity</h2>
        <div style={{ width: 64 }} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <p className="text-gray-700 mb-2 font-medium">Keep track of your plant care activities below 🌱</p>
        <CalendarTracker
          alarmData={alarmData}
          setAlarmData={setAlarmData}
          activityLogs={activityLogs}
          setActivityLogs={setActivityLogs}
          onActivityUpdate={fetchActivityLogs}
          newAlarm={newAlarm}
        />
      </div>
    </motion.div>
  );
};

// ------------------ WeatherSection ------------------
const WeatherSection = ({ onBack, location, setLocation, pakistanCities, weeklyWeather, weatherLoading }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-2">
        <BackButton onBack={onBack} />
        <h2 className="text-2xl font-bold text-green-800">Weekly Weather Update</h2>
        <div style={{ width: 64 }} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded mb-4 w-full"
        >
          {pakistanCities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {weatherLoading ? (
          <p>Loading weather...</p>
        ) : weeklyWeather.length > 0 ? (
          <ul className="space-y-2 text-gray-700">
            {weeklyWeather.map((day, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span>{day.date}</span>
                <span>{day.weather}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No weather data available 🌤</p>
        )}
      </div>
    </motion.div>
  );
};

// ------------------ ChatbotSection ------------------
const ChatbotSection = ({ onBack, chatContext, chatInput, setChatInput, handleSendMessage }) => {
  const { chatMessages, loading } = chatContext;
  const chatContainerRef = useRef(null);

  // ✅ Scroll only the chat box (not full page)
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, loading]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <div className="flex items-center justify-between mb-4">
        <BackButton onBack={onBack} />
        <h2 className="text-2xl font-bold text-green-800">Chatbot</h2>
        <div style={{ width: 64 }} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-md">
        {/* ✅ reduced height by 30px (was h-96 -> h-[354px]) */}
        <div
          ref={chatContainerRef}
          className="h-[354px] overflow-y-auto bg-[#f0f0f0] p-4 rounded-md mb-2 space-y-2 flex flex-col"
        >
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-md max-w-[80%] break-words ${
                  msg.sender === "user"
                    ? "bg-green-700 text-white"
                    : "bg-gray-300 text-black border-l-4 border-green-700"
                }`}
                style={{ width: "fit-content" }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <p className="text-gray-500 italic">Bot is typing...</p>}
        </div>

        <div className="w-full max-w-full flex">
          <input
            type="text"
            placeholder="Type your message..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-grow p-2 border border-r-0 rounded-l-md min-w-0"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-700 hover:bg-green-800 text-white px-4 rounded-r-md shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};



// ------------------ Main Component ------------------
export default function PlantCareRefactor() {
  const [alarmData, setAlarmData] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const chatContext = useContext(ChatbotContext);
  const [chatInput, setChatInput] = useState("");
  const [activeSection, setActiveSection] = useState(null); // null | 'alarm' | 'calendar' | 'weather' | 'chatbot'
  const userId = getUserId();
  const [location, setLocation] = useState("Islamabad");

  const { fetchWeeklyWeather, weeklyWeather, loading: weatherLoading } = useContext(WeatherContext);

  useEffect(() => {
    if (!userId) return;
    fetchAlarms();
    fetchActivityLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const todayLogs = (Array.isArray(res.data) ? res.data : []).filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= todayStart && logDate < todayEnd;
      });

      setActivityLogs(todayLogs);
    } catch (err) {
      console.error("Error fetching activities", err);
      setActivityLogs([]);
    }
  };

  const handleAlarmAdded = async (newAlarm) => {
    if (!newAlarm) return;
    setAlarmData((prev) => [...prev, newAlarm]);
    await fetchActivityLogs();
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    chatContext.sendMessage(chatInput);
    setChatInput("");
  };

  useEffect(() => {
    if (location) fetchWeeklyWeather(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const pakistanCities = ["Islamabad", "Karachi", "Lahore", "Rawalpindi", "Peshawar", "Quetta", "Multan"];

  return (
    <div className="py-12 bg-[#F4FFF4] min-h-screen p-6">
      <div className="text-2xl mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Title text1="PLANT" text2="CARE" />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === null ? (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuickAccessCards onSelect={(id) => setActiveSection(id)} />

            {/* quick overview row below cards for small widgets (optional) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="font-semibold text-green-800 mb-2">Today&apos;s Activities</h3>
                {activityLogs.length ? (
                  <ul className="text-gray-700 space-y-2">
                    {activityLogs.map((item) => (
                      <li key={item._id} className="flex items-center gap-2">
                        {item.activity === "Watering" ? <Droplet /> : <Leaf />}
                        <div>
                          {item.activity} at {item.time || "—"} • <strong>{new Date(item.timestamp).toLocaleDateString()}</strong>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No activity logs yet 🌱</p>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md">
                <h3 className="font-semibold text-green-800 mb-2">Weather Preview</h3>
                {weatherLoading ? (
                  <p>Loading...</p>
                ) : weeklyWeather.length ? (
                  <div className="text-gray-700 space-y-1">
                    {weeklyWeather.slice(0, 3).map((d, i) => (
                      <div key={i} className="flex justify-between border-b pb-1">
                        <span>{d.date}</span>
                        <span>{d.weather}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No weather data 🌤</p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key={activeSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mt-4">
              {activeSection === "alarm" && (
                <AlarmSection onBack={() => setActiveSection(null)} onAlarmAdded={handleAlarmAdded} />
              )}

              {activeSection === "calendar" && (
                <CalendarActivitySection
                  onBack={() => setActiveSection(null)}
                  alarmData={alarmData}
                  setAlarmData={setAlarmData}
                  activityLogs={activityLogs}
                  setActivityLogs={setActivityLogs}
                  fetchActivityLogs={fetchActivityLogs}
                  newAlarm={alarmData[alarmData.length - 1]}
                />
              )}

              {activeSection === "weather" && (
                <WeatherSection
                  onBack={() => setActiveSection(null)}
                  location={location}
                  setLocation={setLocation}
                  pakistanCities={pakistanCities}
                  weeklyWeather={weeklyWeather}
                  weatherLoading={weatherLoading}
                />
              )}

              {activeSection === "chatbot" && (
                <ChatbotSection
                  onBack={() => setActiveSection(null)}
                  chatContext={chatContext}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleSendMessage={handleSendMessage}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
