import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '@/services/ProjectService/projectService';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching projects from API...');
      
      // Temporary: Check if we're in development and use mock data
      const isDevelopment = import.meta.env.DEV;
      if (isDevelopment) {
        console.log('Development mode - using mock data for testing');
        const mockProjects = [
          {
            id: '1',
            project_name: 'Test Project 1',
            project_id: 'TEST-001',
            project_status: 'in-progress',
            project_type: 'web-development',
            priority: 'high',
            client_name: 'Test Client',
            client_email: 'test@example.com',
            estimated_budget: 50000,
            budget_currency: 'USD',
            actual_budget_used: 25000,
            logged_hours: 120,
            start_date: '2024-01-15',
            end_date: '2024-06-30',
            duration: 165,
            created_at: '2024-01-10T10:00:00Z',
            created_by: 'admin',
            progress_percent: 50
          }
        ];
        return mockProjects;
      }
      
      const response = await projectService.getProjects();
      
      console.log('API Response received:', response);
      
      if (response.success && response.data) {
        console.log('Projects fetched successfully:', response.data);
        return response.data;
      } else {
        console.error('Failed to fetch projects:', response.error);
        // Return empty array instead of rejecting to prevent loops
        return [];
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Return empty array instead of rejecting to prevent loops
      return [];
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      console.log('Creating new project:', projectData);
      const response = await projectService.createProject(projectData);
      
      if (response.success && response.data) {
        console.log('Project created successfully:', response.data);
        return response.data;
      } else {
        console.error('Failed to create project:', response.error);
        return rejectWithValue(response.error?.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      return rejectWithValue(error.message || 'Error creating project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      console.log('Updating project:', id, projectData);
      const response = await projectService.updateProject(id, projectData);
      
      if (response.success && response.data) {
        console.log('Project updated successfully:', response.data);
        return response.data;
      } else {
        console.error('Failed to update project:', response.error);
        return rejectWithValue(response.error?.message || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      return rejectWithValue(error.message || 'Error updating project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting project:', id);
      const response = await projectService.deleteProject(id);
      
      if (response.success) {
        console.log('Project deleted successfully');
        return id;
      } else {
        console.error('Failed to delete project:', response.error);
        return rejectWithValue(response.error?.message || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      return rejectWithValue(error.message || 'Error deleting project');
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentProject, clearError, setProjects } = projectSlice.actions;
export default projectSlice.reducer; 