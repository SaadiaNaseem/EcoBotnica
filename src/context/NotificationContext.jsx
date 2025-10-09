// frontend/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios"; // Axios instance pointing to backend
import { getUserId } from "../utils/getUserId";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = getUserId();

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/notifications/${userId}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{ notifications, fetchNotifications, deleteNotification, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
