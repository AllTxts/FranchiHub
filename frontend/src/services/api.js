import axios from 'axios';

// Get API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:5001/api';

console.log('API URL:', API_URL); // Para verificar que está cargando bien

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important for HTTPS with self-signed certificates in development
  httpsAgent: {
    rejectUnauthorized: false
  }
});

// Request interceptor para debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Is the backend running?');
      console.error('Make sure your backend is running on:', API_URL);
    } else if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;