import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper functions for localStorage with ipms_ prefixed keys
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('ipms_token');
    const user = localStorage.getItem('ipms_user');
    const teamUser = localStorage.getItem('ipms_teamUser');
    const isAuthenticated = localStorage.getItem('ipms_isAuthenticated');
    
    if (token && (user || teamUser) && isAuthenticated === 'true') {
      return {
        token,
        user: user ? JSON.parse(user) : null,
        teamUser: teamUser ? JSON.parse(teamUser) : null,
        isAuthenticated: true
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const clearStoredAuth = () => {
  try {
    localStorage.removeItem('ipms_token');
    localStorage.removeItem('ipms_user');
    localStorage.removeItem('ipms_teamUser');
    localStorage.removeItem('ipms_isAuthenticated');
    
    // Also clear any legacy keys for backward compatibility
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('teamUser');
    localStorage.removeItem('isAuthenticated');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

const storeAuth = (user, teamUser, token) => {
  try {
    if (token) localStorage.setItem('ipms_token', token);
    if (user) localStorage.setItem('ipms_user', JSON.stringify(user));
    if (teamUser) localStorage.setItem('ipms_teamUser', JSON.stringify(teamUser));
    localStorage.setItem('ipms_isAuthenticated', 'true');
    
    // Also store in legacy keys for backward compatibility
    if (token) localStorage.setItem('authToken', token);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    if (teamUser) localStorage.setItem('teamUser', JSON.stringify(teamUser));
    localStorage.setItem('isAuthenticated', 'true');
  } catch (error) {
    console.error('Error storing in localStorage:', error);
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Clear all stored data locally
      clearStoredAuth();
      
      // Clear any other stored data that might exist
      localStorage.removeItem('ipms_notifications');
      localStorage.removeItem('ipms_projects');
      localStorage.removeItem('ipms_timeLogs');
      localStorage.removeItem('ipms_userPreferences');
      
      // Clear legacy keys
      localStorage.removeItem('notifications');
      localStorage.removeItem('projects');
      localStorage.removeItem('timeLogs');
      localStorage.removeItem('userPreferences');
      
      // Clear sessionStorage as well
      sessionStorage.clear();
      
      // Clear any cookies if they exist
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      console.log('✅ Logout successful - all data cleared');
      return null;
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if there's an error, still clear local data
      clearStoredAuth();
      return rejectWithValue(error.message);
    }
  }
);

// Initialize state from localStorage
const storedAuth = getStoredAuth();
const initialState = {
  user: storedAuth?.user || null,
  teamUser: storedAuth?.teamUser || null,
  isAuthenticated: storedAuth?.isAuthenticated || false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        storeAuth(action.payload, state.teamUser, localStorage.getItem('ipms_token'));
      }
    },
    setTeamUser: (state, action) => {
      state.teamUser = action.payload;
      if (action.payload) {
        storeAuth(state.user, action.payload, localStorage.getItem('ipms_token'));
      }
    },
    logout: (state) => {
      state.user = null;
      state.teamUser = null;
      state.isAuthenticated = false;
      clearStoredAuth();
    },
    restoreAuth: (state) => {
      const storedAuth = getStoredAuth();
      if (storedAuth) {
        state.user = storedAuth.user;
        state.teamUser = storedAuth.teamUser;
        state.isAuthenticated = storedAuth.isAuthenticated;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.teamUser = action.payload.teamUser;
        state.isAuthenticated = true;
        
        // Store in localStorage
        storeAuth(action.payload.user, action.payload.teamUser, action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        clearStoredAuth();
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.teamUser = null;
        state.isAuthenticated = false;
        clearStoredAuth();
      });
  },
});

export const { clearError, setUser, setTeamUser, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer; 