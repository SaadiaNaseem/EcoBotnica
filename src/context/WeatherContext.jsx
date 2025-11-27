// frontend/context/WeatherContext.jsx
import React, { createContext, useState } from "react";
import axios from "../api/axios"; // backend axios instance
import axiosExternal from "axios"; // external API calls

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [weeklyWeather, setWeeklyWeather] = useState([]);

  const OPENWEATHER_API_KEY = "";

  const fetchWeeklyWeather = async (location) => {
    if (!location) return;

    setLoading(true);
    const todayStr = new Date().toDateString();

    console.log("[WeatherContext] Fetching weather for:", location);

    try {
      // 🌍 Step 1: Get coordinates for city
      const geoRes = await axiosExternal.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location},PK&limit=1&appid=${OPENWEATHER_API_KEY}`
      );

      if (!geoRes.data || geoRes.data.length === 0) {
        console.warn("[WeatherContext] ⚠️ Invalid location or no coordinates found");
        setWeeklyWeather([]);
        setLoading(false);
        return;
      }

      const { lat, lon } = geoRes.data[0];
      console.log("[WeatherContext] Coordinates:", lat, lon);

      // 🌦️ Step 2: Get 5-day / 3-hour forecast
      const forecastRes = await axiosExternal.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      const list = forecastRes.data?.list || [];
      const dailyMap = {};

      // Group one weather entry per day
      list.forEach((entry) => {
        const date = new Date(entry.dt * 1000).toDateString();
        if (!dailyMap[date]) {
          const weather = entry.weather[0]?.description || "No description";
          const temp = `${entry.main.temp}°C`;
          let alert = "Normal";

          if (entry.weather[0]?.main === "Rain") alert = "Rain expected – carry umbrella!";
          if (entry.main.temp > 35) alert = "Hot day – stay hydrated!";
          if (entry.main.temp < 10) alert = "Cold day – wear warm clothes!";

          dailyMap[date] = { date, weather: `${weather}, ${temp}`, alert };
        }
      });

      const parsedData = Object.values(dailyMap).slice(0, 7);
      setWeeklyWeather(parsedData);

      console.log("[WeatherContext] Parsed weather data:", parsedData);

      // 🌤️ Step 3: Find today’s weather data
      const today = new Date().toDateString();
      const todayData = parsedData.find((d) => d.date === today);

      console.log("[DEBUG] Today:", today);
      console.log("[DEBUG] Found todayData:", todayData);

      // ✅ Step 4: Send today’s weather to backend
      if (todayData) {
        console.log("[WeatherContext] Sending today's weather to backend:", todayData);

        try {
          const res = await axios.post("/weather-notifications/send", { todayWeather: todayData });
          console.log("[WeatherContext] ✅ Weather notification sent:", res.data);
        } catch (err) {
          console.error("[WeatherContext] ❌ Error sending to backend:", err);
        }
      } else {
        console.log("[WeatherContext] ⚠️ No matching today weather data found.");
      }
    } catch (err) {
      console.error("[WeatherContext] ❌ Error fetching weekly weather:", err);
    }

    setLoading(false);
  };

  return (
    <WeatherContext.Provider value={{ fetchWeeklyWeather, weeklyWeather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};
