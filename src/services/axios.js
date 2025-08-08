import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ipmsnew.24livehost.com/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401/403 errors globally - but only if we're not already on login page
    if ((error.response?.status === 401 || error.response?.status === 403) && 
        !window.location.pathname.includes('/login')) {
      // Clear authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('teamUser');
      localStorage.removeItem('isAuthenticated');
      
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 