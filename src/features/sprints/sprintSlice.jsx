import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSprints = createAsyncThunk(
  'sprints/fetchSprints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/sprints');
      if (!response.ok) throw new Error('Failed to fetch sprints');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  sprints: [],
  currentSprint: null,
  isLoading: false,
  error: null,
};

const sprintSlice = createSlice({
  name: 'sprints',
  initialState,
  reducers: {
    setCurrentSprint: (state, action) => {
      state.currentSprint = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSprints.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSprints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sprints = action.payload;
      })
      .addCase(fetchSprints.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentSprint, clearError } = sprintSlice.actions;
export default sprintSlice.reducer; 