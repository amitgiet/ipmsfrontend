import { apiCall } from './apiCall';
import { allRoutes } from './routes';

export const authService = {
  // User login
  login: async (credentials) => {
    return await apiCall(allRoutes.auth.login, 'post', credentials);
  },

  // Team login
  teamLogin: async (credentials) => {
    return await apiCall(allRoutes.auth.teamLogin, 'post', credentials);
  },

  // User registration
  register: async (userData) => {
    return await apiCall(allRoutes.auth.register, 'post', userData);
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await apiCall(allRoutes.auth.forgotPassword, 'post', { email });
  },

  // OTP verification
  verifyOtp: async (otpData) => {
    return await apiCall(allRoutes.auth.otpVerify, 'post', otpData);
  },

  // Change password
  changePassword: async (passwordData) => {
    return await apiCall(allRoutes.auth.changePassword, 'post', passwordData);
  },

  // Refresh token
  refreshToken: async () => {
    return await apiCall(allRoutes.auth.refreshToken, 'post');
  },

  // Logout
  logout: async () => {
    return await apiCall(allRoutes.auth.logout, 'post');
  }
}; 