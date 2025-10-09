// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api", // ✅ backend port aur /api prefix
});

// 🔑 Token automatically attach karna
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
