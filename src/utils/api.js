// API utility functions
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = {
  get: async (endpoint) => {
    // TODO: Implement GET request
    console.log('GET request to:', `${API_BASE_URL}${endpoint}`);
  },
  
  post: async (endpoint, data) => {
    // TODO: Implement POST request
    console.log('POST request to:', `${API_BASE_URL}${endpoint}`, data);
  },
  
  put: async (endpoint, data) => {
    // TODO: Implement PUT request
    console.log('PUT request to:', `${API_BASE_URL}${endpoint}`, data);
  },
  
  delete: async (endpoint) => {
    // TODO: Implement DELETE request
    console.log('DELETE request to:', `${API_BASE_URL}${endpoint}`);
  }
}; 