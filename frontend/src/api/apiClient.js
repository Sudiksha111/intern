// frontend/src/api/apiClient.js
import axios from 'axios';

// Create an Axios instance with the base URL from your environment variables
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// VERY IMPORTANT: This part automatically adds the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Get the token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;