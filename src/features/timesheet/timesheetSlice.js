import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTimeLogs = createAsyncThunk(
  'timesheet/fetchTimeLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/timesheet');
      if (!response.ok) throw new Error('Failed to fetch time logs');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  timeLogs: [],
  currentTimeLog: null,
  isLoading: false,
  error: null,
};

const timesheetSlice = createSlice({
  name: 'timesheet',
  initialState,
  reducers: {
    setCurrentTimeLog: (state, action) => {
      state.currentTimeLog = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeLogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTimeLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timeLogs = action.payload;
      })
      .addCase(fetchTimeLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentTimeLog, clearError } = timesheetSlice.actions;
export default timesheetSlice.reducer; 