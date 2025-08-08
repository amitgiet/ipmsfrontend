import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      // Mock data for now since API doesn't exist
      const mockTasks = [
        {
          id: 1,
          title: 'Design User Interface',
          description: 'Create wireframes and mockups for the e-commerce platform',
          status: 'in-progress',
          assignee: 'John Doe',
          priority: 'high',
          projectId: 1,
          dueDate: '2024-04-15'
        },
        {
          id: 2,
          title: 'Implement Authentication',
          description: 'Set up user authentication and authorization system',
          status: 'completed',
          assignee: 'Jane Smith',
          priority: 'high',
          projectId: 1,
          dueDate: '2024-03-30'
        },
        {
          id: 3,
          title: 'Database Schema Design',
          description: 'Design and implement the database structure',
          status: 'in-progress',
          assignee: 'Mike Johnson',
          priority: 'medium',
          projectId: 2,
          dueDate: '2024-04-20'
        },
        {
          id: 4,
          title: 'API Development',
          description: 'Build RESTful APIs for the mobile app',
          status: 'pending',
          assignee: 'Sarah Wilson',
          priority: 'high',
          projectId: 2,
          dueDate: '2024-05-01'
        },
        {
          id: 5,
          title: 'Testing and QA',
          description: 'Perform comprehensive testing of all features',
          status: 'pending',
          assignee: 'Alex Brown',
          priority: 'medium',
          projectId: 1,
          dueDate: '2024-05-15'
        },
        {
          id: 6,
          title: 'Deployment Setup',
          description: 'Configure production environment and deployment pipeline',
          status: 'completed',
          assignee: 'David Lee',
          priority: 'low',
          projectId: 4,
          dueDate: '2024-01-25'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockTasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentTask, clearError } = taskSlice.actions;
export default taskSlice.reducer; 