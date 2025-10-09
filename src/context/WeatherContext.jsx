import React, { createContext, useState } from "react";
import axios from "../api/axios"; // ✅ use configured backend axios
import axiosExternal from "axios"; // for OpenRouter external call

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [weeklyWeather, setWeeklyWeather] = useState([]);

  const fetchWeeklyWeather = async (location) => {
    if (!location) return;

    setLoading(true);
    const todayStr = new Date().toDateString();
    const lastNotificationDate = localStorage.getItem("lastWeatherNotificationDate");
    const alreadySentToday = lastNotificationDate === todayStr;

    console.log("[WeatherContext] Fetching weather for:", location);

    const prompt = `
You are a weather assistant AI. Today is ${todayStr}.
Provide a 7-day weather forecast for ${location}, Pakistan, starting from today.
Return only JSON array of objects with {date, weather, alert}.
`;

    try {
      // ✅ Use axiosExternal for AI request
      const res = await axiosExternal.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization:"Bearer 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", // ✅ must be valid key
            "Content-Type": "application/json",
          },
        }
      );

      const aiRaw = res.data?.choices?.[0]?.message?.content;
      console.log("[WeatherContext] AI raw content:", aiRaw);

      const cleaned = aiRaw?.trim()?.replace(/^\n+|\n+$/g, "");
      let parsedData = [];
      try {
        parsedData = JSON.parse(cleaned);
      } catch (err) {
        console.error("[WeatherContext] JSON parse error:", err, aiRaw);
      }

      if (!Array.isArray(parsedData)) parsedData = [];
      setWeeklyWeather(parsedData);
      console.log("[WeatherContext] Parsed weather data:", parsedData);

      // ✅ Send today's weather to backend
      if (parsedData.length && !alreadySentToday) {
        const today = new Date();
        const todayData = parsedData.find((day) => {
          const d = new Date(day.date);
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        });

        if (todayData) {
          console.log("[WeatherContext] Sending today's weather to backend:", todayData);
          await axios.post("/weather-notifications/send", { todayWeather: todayData });
          localStorage.setItem("lastWeatherNotificationDate", todayStr);
          console.log("[WeatherContext] ✅ Weather notification sent to backend");
        } else {
          console.log("[WeatherContext] ⚠ No matching todayData found");
        }
      }
    } catch (err) {
      console.error("[WeatherContext] Error fetching weekly weather:", err);
    }
    setLoading(false);
  };

  return (
    <WeatherContext.Provider value={{ fetchWeeklyWeather, weeklyWeather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};