import React, { useContext, useEffect, useState } from "react";
import { WeatherContext } from "../context/WeatherContext";

const WeeklyWeather = ({ location }) => {
  const { fetchWeeklyWeather, weeklyWeather, loading } = useContext(WeatherContext);

  useEffect(() => {
    if (location) fetchWeeklyWeather(location);
  }, [location]);

  if (!location) return <p>Please select a city.</p>;
  if (loading) return <p>Loading weather...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Weekly Weather Update</h2>
      <ul className="space-y-2 text-gray-700">
        {weeklyWeather.length > 0 ? (
          weeklyWeather.map((day, i) => (
            <li key={i} className="flex justify-between border-b pb-1">
              <span>{day.date}</span>
              <span>{day.weather}</span>
              {day.alert && <span className="text-red-600 ml-2">{day.alert}</span>}
            </li>
          ))
        ) : (
          <p>No weather data available.</p>
        )}
      </ul>
    </div>
  );
};

export default WeeklyWeather;
