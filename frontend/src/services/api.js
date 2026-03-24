import axios from 'axios';

// Cambia de HTTP a HTTPS
const API_URL = 'https://localhost:5001/api'; // Nota el https://

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Importante para desarrollo con certificados self-signed
  httpsAgent: {
    rejectUnauthorized: false
  }
});

// Log para debugging
console.log('API URL:', API_URL);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status);
    return response;
  },
  (error) => {
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