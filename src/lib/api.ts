import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dies64unud.tech";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure cookies are sent if using HTTP-only cookies
  withCredentials: true, 
});

// Request Interceptor: Add Auth Token from Local Storage (if fallback to Local Storage is used)
apiClient.interceptors.request.use(
  (config) => {
    // Note: If using HTTP-only cookies, you don't need to manually set the token here.
    // This is just a fallback if you store it in localStorage.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Global Errors (like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (e.g., redirect to login or clear token)
      console.error("Unauthorized! Redirecting to login...");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
