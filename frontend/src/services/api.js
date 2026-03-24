import axios from 'axios';

// API base URL - change to HTTPS for local development
const API_URL = 'https://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important for development with self-signed certificates
  httpsAgent: {
    rejectUnauthorized: false
  }
});

// Debug log
console.log('API URL:', API_URL);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status);
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Make sure backend is running on:', API_URL);
    } else if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;