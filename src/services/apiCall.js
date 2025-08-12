import { toast } from "react-toastify";
import api from './axios';

// Retry configuration for 500 errors
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Health check function to test API connectivity
export const checkApiHealth = async () => {
  try {
    console.log('Checking API health...');
    const response = await api.get('/health');
    console.log('API Health Check Success:', response);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return { success: false, error };
  }
};

export const apiCall = async (
  url, 
  method = 'get', 
  data = null, 
  config = {},
  retryCount = 0
) => {
  try {
    const isFormData = data instanceof FormData;

    // Build headers safely
    const finalHeaders = { ...(config.headers || {}) };
    if (!isFormData && !finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }

    const response =
      method === "get" || method === "delete"
        ? await api[method](url, config)
        : await api[method](url, data, {
            ...config,
            headers: finalHeaders,
          });

    console.log('API Response:', response);
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error;
    
    // Handle 401/403 errors - but only if we're not already on login page
    if ((axiosError.response?.status === 401 || axiosError.response?.status === 403) && 
        !window.location.pathname.includes('/login')) {
      
      // Clear ipms_ authentication data
      localStorage.removeItem('ipms_token');
      localStorage.removeItem('ipms_user');
      localStorage.removeItem('ipms_teamUser');
      localStorage.removeItem('ipms_isAuthenticated');
      
      // Also clear legacy keys for backward compatibility
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('teamUser');
      localStorage.removeItem('isAuthenticated');
      
      // Only redirect if we're not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return { success: false };
    }

    // Retry logic for 500 errors
    if (axiosError.response?.status === 500 && retryCount < MAX_RETRIES) {
      console.log(`Retrying API call due to 500 error. Attempt ${retryCount + 1}/${MAX_RETRIES}`);
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return apiCall(url, method, data, config, retryCount + 1);
    }
    
    // Log detailed error information
    console.error('API Call Error Details:', {
      url: axiosError.url || url,
      method: axiosError.method || method,
      status: axiosError.response?.status || axiosError.status,
      message: axiosError.response?.data?.message || axiosError.message,
      data: axiosError.response?.data,
      retryCount,
      timestamp: new Date().toISOString()
    });

    const errors = axiosError?.response?.data?.errors;
    const message = axiosError?.response?.data?.message || axiosError.message;

    if (errors && Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstKey][0];
      toast.error(firstErrorMessage);
    } else if (message) {
      toast.error(message);
    } else {
      toast.error("Something went wrong, please try again.");
    }
    
    return { 
      success: false, 
      error: {
        status: axiosError.response?.status || axiosError.status,
        message: message,
        url: axiosError.url || url,
        method: axiosError.method || method
      }
    };
  }
}; 