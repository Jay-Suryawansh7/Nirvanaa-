import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - Token likely expired or invalid
        alert("Session expired. Please login again."); // Replace with Toast if available
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else if (status === 403) {
        // Forbidden
        console.error("Access Forbidden:", data.message);
        // Optional: Redirect to a 403 page or show a modal
      }
    }
    return Promise.reject(error);
  }
);

export default api;
