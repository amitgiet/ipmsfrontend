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
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error;
    const errors = axiosError?.response?.data?.errors;
    const message = axiosError?.response?.data?.message || axiosError.message;

    if (errors && Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstKey];
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