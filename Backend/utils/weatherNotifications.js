export const generateTodayWeatherNotification = (weeklyWeather) => {
  const today = new Date();
  const todayData = weeklyWeather.find((day) => {
    const d = new Date(day.date);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  if (!todayData) return null;

  const weather = todayData.weather.toLowerCase();
  const date = new Date(todayData.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  console.log("[Utils] Today's weather:", weather);

  if (weather.includes("thunderstorm")) return { title: "Weather Alert", content: `⚡ Thunderstorm today (${date}). Move sensitive plants indoors.` };
  if (weather.includes("rain")) return { title: "Weather Alert", content: `🌧️ Rain today (${date}). Outdoor plants do not need watering.` };
  if (weather.includes("sunny")) return { title: "Weather Alert", content: `🌞 Sunny day today (${date}). Water sensitive plants twice.` };
  if (weather.includes("cloudy")) return { title: "Weather Alert", content: `☁️ Cloudy today (${date}). Ideal for pruning/fertilizing.` };
  if (weather.includes("fog") || weather.includes("mist")) return { title: "Weather Alert", content: `🌫️ Foggy today (${date}). Avoid watering to prevent fungus.` };
  if (weather.includes("snow")) return { title: "Weather Alert", content: `❄️ Snow/cold today (${date}). Protect sensitive plants.` };

  return null;
};
