import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper functions for localStorage with ipms_ prefixed keys
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('ipms_token');
    const user = localStorage.getItem('ipms_user');
    const teamUser = localStorage.getItem('ipms_teamUser');
    const isAuthenticated = localStorage.getItem('ipms_isAuthenticated')
    const userRole = localStorage.getItem('ipms_userRole');
    
    if (token && (user || teamUser) && isAuthenticated === 'true') {
      return {
        token,
        user: user ? JSON.parse(user) : null,
        teamUser: teamUser ? JSON.parse(teamUser) : null,
        isAuthenticated: true,
        userRole: userRole || 'admin'
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
    localStorage.removeItem('ipms_userRole');
    } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

const storeAuth = (user, teamUser, token, userRole) => {
  try {
    console.log("storing auth", user, teamUser, token, userRole);
    if (token) localStorage.setItem('ipms_token', token);
    if (user) localStorage.setItem('ipms_user', JSON.stringify(user));
    if (teamUser) localStorage.setItem('ipms_teamUser', JSON.stringify(teamUser));
    localStorage.setItem('ipms_isAuthenticated', 'true');
    if (userRole) localStorage.setItem('ipms_userRole', userRole);
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
      clearStoredAuth();
      
      sessionStorage.clear();
      
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      console.log('✅ Logout successful - all data cleared');
      return null;
    } catch (error) {
      console.error('❌ Error during logout:', error);
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
  userRole: storedAuth?.userRole || 'admin',
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
        storeAuth(action.payload, state.teamUser, localStorage.getItem('ipms_token'), state.userRole);
      }
    },
    setTeamUser: (state, action) => { 
      state.teamUser = action.payload;
        state.userRole = action.payload.user.role || '';
      if (action.payload) {
        storeAuth(state.user, action.payload, localStorage.getItem('ipms_token'), state.userRole);
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
        state.userRole = storedAuth.userRole;
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
        storeAuth(action.payload.user, action.payload.teamUser, action.payload.token, action.payload.userRole);
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