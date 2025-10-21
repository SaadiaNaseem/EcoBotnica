// utils/weatherNotificationGenerator.js

export function generateTodayWeatherNotification(todayData) {
  if (!todayData || !todayData.weather) {
    return { message: "⚠️ No valid weather data found." };
  }

  const weatherText = todayData.weather.toLowerCase().trim();
  console.log("[Utils] Today's weather:", weatherText);

  // 🌡️ Extract numeric temperature
  const tempMatch = weatherText.match(/(-?\d+(\.\d+)?)\s?°c/);
  const temperature = tempMatch ? parseFloat(tempMatch[1]) : null;

  // 🌦️ Keyword-based alerts (broadened for OpenWeatherMap terms)
  if (
    weatherText.includes("clear") ||
    weatherText.includes("sunny")
  ) {
    return {
      title: "☀️ Clear Sky Alert",
      content: `It's a clear day with ${temperature ?? "pleasant"}°C. Water your plants early morning or late evening to avoid evaporation.`,
    };
  }

  if (
    weatherText.includes("rain") ||
    weatherText.includes("drizzle") ||
    weatherText.includes("thunderstorm")
  ) {
    return {
      title: "🌧️ Rain Alert",
      content: "Rainy conditions detected. Avoid overwatering — your plants are already getting moisture!",
    };
  }

  if (weatherText.includes("cloud")) {
    return {
      title: "⛅ Cloudy Weather",
      content: "Partly cloudy skies today. A perfect day for photosynthesis — continue regular watering.",
    };
  }

  if (
    weatherText.includes("fog") ||
    weatherText.includes("mist") ||
    weatherText.includes("haze")
  ) {
    return {
      title: "🌫️ Low Visibility Alert",
      content: "Foggy or misty conditions — make sure your plants receive enough light today.",
    };
  }

  // 🌡️ Temperature-based alerts
  if (temperature !== null) {
    if (temperature > 35) {
      return {
        title: "🔥 Hot Weather Alert",
        content: `Temperature is around ${temperature}°C — water your plants twice daily and provide shade if possible.`,
      };
    } else if (temperature < 10) {
      return {
        title: "❄️ Cold Weather Alert",
        content: `Chilly weather (${temperature}°C)! Keep sensitive plants indoors or cover them at night.`,
      };
    }
  }

  // 🌿 Default mild message
  return {
    title: "🌿 Weather Update",
    content: "Pleasant day ahead. Maintain your regular plant care routine.",
  };
}
