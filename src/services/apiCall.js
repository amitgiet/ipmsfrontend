import { toast } from "react-toastify";
import api from './axios';

// Retry configuration for network errors and timeouts
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay
const RETRY_MULTIPLIER = 2; // Exponential backoff multiplier

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if error is retryable (network errors, timeouts, 5xx errors)
const isRetryableError = (error) => {
  // Network errors (no response)
  if (!error.response) {
    return true;
  }
  
  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return true;
  }
  
  // 5xx server errors
  const status = error.response?.status;
  if (status >= 500 && status < 600) {
    return true;
  }
  
  return false;
};

// Health check function to test API connectivity
export const checkApiHealth = async () => {
  try { 
    const response = await api.get('/health'); 
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
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error;
    
    // Check if we should retry this error
    if (retryCount < MAX_RETRIES && isRetryableError(axiosError)) {
      const delayTime = RETRY_DELAY * Math.pow(RETRY_MULTIPLIER, retryCount);
      console.log(`🔄 Retrying API call (${retryCount + 1}/${MAX_RETRIES}) after ${delayTime}ms delay`);
      
      await delay(delayTime);
      return apiCall(url, method, data, config, retryCount + 1);
    }
    
    // Handle final error after all retries exhausted
    const errors = axiosError?.response?.data?.errors;
    const message = axiosError?.response?.data?.message || axiosError.message;

    // Show more specific error messages
    if (axiosError.code === 'ECONNABORTED' || message?.includes('timeout')) {
      toast.error("Request timed out. Please check your internet connection and try again.");
    } else if (!axiosError.response) {
      toast.error("Network error. Please check your internet connection and try again.");
    } else if (message) {
      toast.error(message);
    } else if (errors && Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstKey];
      toast.error(firstErrorMessage);
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