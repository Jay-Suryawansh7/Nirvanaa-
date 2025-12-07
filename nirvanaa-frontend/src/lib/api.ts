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
  async (error) => {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      const { status, data } = error.response;

      if (status === 401) {
        // Handle Token Refresh
        const originalRequest = error.config;
        if (!originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                const newToken = refreshResponse.data.accessToken; // Check if backend returns 'token' or 'accessToken'
                
                if (newToken) {
                    localStorage.setItem("token", newToken);
                    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh failed:", refreshError);
                // Fallback to logout
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        
        // If retry already failed or other 401
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (status === 403) {
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
