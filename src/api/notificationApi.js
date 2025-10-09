// Frontend/api/notificationApi.js
import axios from "./axios.js"; // your configured backend axios instance

// Send weather notifications (already exists)
export const sendWeatherNotifications = async (weeklyWeather) => {
  try {
    const res = await axios.post("/weather-notifications/send", { weeklyWeather });
    return res.data;
  } catch (err) {
    console.error("Error sending weather notifications:", err);
    return null;
  }
};

// Delete a notification by ID
export const deleteNotification = async (id) => {
  try {
    const res = await axios.delete(`/notifications/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting notification:", err);
    return null;
  }
};
