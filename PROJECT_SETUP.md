# IPMS Frontend Project Setup Documentation

## 📁 Folder Structure

```
ipmsfrontend/
├── public/                          # Static assets
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── common/                  # Common components (Button, Modal, Table, etc.)
│   │   ├── forms/                   # Form components and sections
│   │   ├── layout/                  # Layout components (Header, Sidebar, AppLayout)
│   │   └── ui/                      # Shadcn/ui components
│   ├── constants/                   # Application constants
│   │   └── projectConstants.js      # Project types, statuses, priorities, currencies
│   ├── features/                    # Redux slices (feature-based organization)
│   │   ├── auth/
│   │   │   └── authSlice.jsx        # Authentication state management
│   │   ├── projects/
│   │   │   └── projectSlice.jsx     # Projects state management
│   │   ├── sprints/
│   │   │   └── sprintSlice.jsx      # Sprints state management
│   │   ├── stories/
│   │   │   └── storySlice.jsx       # User stories state management
│   │   ├── tasks/
│   │   │   └── taskSlice.jsx        # Tasks state management
│   │   └── timesheet/
│   │       └── timesheetSlice.jsx   # Timesheet state management
│   ├── guards/                      # Route protection components
│   │   ├── AuthGuard.jsx            # Authentication guard
│   │   └── RoleGuard.jsx            # Role-based access control
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.jsx              # Authentication hook
│   │   ├── useProjects.jsx          # Projects hook
│   │   └── use-toast.js             # Toast notification hook
│   ├── lib/                         # Utility libraries
│   │   └── utils.ts                 # Utility functions (cn, etc.)
│   ├── pages/                       # Page components
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── SignUpForm.jsx       # Sign up form
│   │   │   └── TeamLoginForm.jsx    # Team login form
│   │   ├── dashboard/               # Dashboard pages
│   │   │   ├── DashboardPage.jsx    # Main dashboard
│   │   │   ├── AdminDashboard/      # Admin dashboard components
│   │   │   ├── ProductOwner/        # Product owner dashboard
│   │   │   └── Modal/               # Modal components
│   │   ├── project/                 # Project pages
│   │   ├── sprint/                  # Sprint pages
│   │   ├── story/                   # Story pages
│   │   ├── tasks/                   # Task pages
│   │   ├── timesheet/               # Timesheet pages
│   │   └── settings/                # Settings pages
│   ├── routes/                      # Routing configuration
│   │   ├── index.jsx                # Main router configuration
│   │   └── childrenRoutes.jsx       # Child routes definition
│   ├── services/                    # API services and utilities
│   │   ├── axios.js                 # Axios instance configuration
│   │   ├── apiCall.js               # Generic API call utility
│   │   ├── routes.js                # API routes definition
│   │   └── index.js                 # Service exports
│   ├── store/                       # Redux store configuration
│   │   └── index.jsx                # Store setup and configuration
│   ├── utils/                       # Utility functions
│   │   ├── api.jsx                  # API utilities
│   │   ├── helpers.jsx              # Helper functions
│   │   ├── dateCalculations.js      # Date calculation utilities
│   │   └── formValidation.js        # Form validation utilities
│   ├── App.jsx                      # Main application component
│   ├── index.jsx                    # Application entry point
│   └── index.css                    # Global styles
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.js                   # Vite configuration
└── jsconfig.json                    # JavaScript configuration
```

## 🛣️ Routing Setup

### Main Router Configuration (`src/routes/index.jsx`)

```javascript
import { createBrowserRouter } from 'react-router-dom';
import { withSuspense } from '@/utils/helpers';
import AppLayout from '@/components/layout/AppLayout';
import AuthGuard from '@/guards/AuthGuard';
import LoginPage from '@/pages/auth/Login';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { path: '', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(DashboardPage)() },
      { path: 'projects', element: withSuspense(ProjectListPage)() },
      { path: 'sprints', element: withSuspense(SprintListPage)() },
      { path: 'stories', element: withSuspense(StoryListPage)() },
      { path: 'tasks', element: withSuspense(TaskListPage)() },
      { path: 'timesheet', element: withSuspense(TimesheetPage)() },
      { path: 'settings', element: withSuspense(SettingsPage)() }
    ]
  },
  {
    path: '/auth',
    element: <LoginPage />,
    children: [
      { path: '', element: <Navigate to="/auth/login" replace /> },
      { path: 'login', element: withSuspense(LoginPage)() }
    ]
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage)()
  }
]);

export default router;
```

### Child Routes (`src/routes/childrenRoutes.jsx`)

```javascript
import { Navigate } from 'react-router-dom';
import { withSuspense } from '@/utils/helpers';

// Import pages
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProjectListPage from '@/pages/project/ProjectListPage';
import SprintListPage from '@/pages/sprint/SprintListPage';
import StoryListPage from '@/pages/story/StoryListPage';
import TaskListPage from '@/pages/tasks/TaskListPage';
import TimesheetPage from '@/pages/timesheet/TimesheetPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import LoginPage from '@/pages/auth/Login';
import NotFoundPage from '@/pages/NotFoundPage';

export const childrenComponents = [
  { path: '', element: <Navigate to="/dashboard" replace /> },
  { path: 'dashboard', element: withSuspense(DashboardPage)() },
  { path: 'projects', element: withSuspense(ProjectListPage)() },
  { path: 'sprints', element: withSuspense(SprintListPage)() },
  { path: 'stories', element: withSuspense(StoryListPage)() },
  { path: 'tasks', element: withSuspense(TaskListPage)() },
  { path: 'timesheet', element: withSuspense(TimesheetPage)() },
  { path: 'settings', element: withSuspense(SettingsPage)() }
];

export const authChildren = [
  { path: '', element: withSuspense(LoginPage)() }
];

export const notFoundChildren = [
  { path: '*', element: withSuspense(NotFoundPage)() }
];
```

### Route Guards

#### Authentication Guard (`src/guards/AuthGuard.jsx`)

```javascript
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthGuard;
```

#### Role Guard (`src/guards/RoleGuard.jsx`)

```javascript
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleGuard = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleGuard;
```

## 🔄 Redux Setup

### Store Configuration (`src/store/index.jsx`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import projectReducer from '@/features/projects/projectSlice';
import sprintReducer from '@/features/sprints/sprintSlice';
import storyReducer from '@/features/stories/storySlice';
import taskReducer from '@/features/tasks/taskSlice';
import timesheetReducer from '@/features/timesheet/timesheetSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    sprints: sprintReducer,
    stories: storyReducer,
    tasks: taskReducer,
    timesheet: timesheetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
```

### Auth Slice Example (`src/features/auth/authSlice.jsx`)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // API call would go here
      const response = await apiCall({
        method: 'POST',
        url: '/auth/login',
        data: credentials
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await apiCall({
        method: 'POST',
        url: '/auth/logout'
      });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
```

## 🌐 API Setup

### Axios Configuration (`src/services/axios.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Generic API Call Utility (`src/services/apiCall.js`)

```javascript
import api from './axios';
import { toast } from 'react-toastify';

export const apiCall = async (config, retries = 2) => {
  try {
    const response = await api(config);
    return response;
  } catch (error) {
    if (error.response?.status === 500 && retries > 0) {
      // Retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, (3 - retries) * 1000));
      return apiCall(config, retries - 1);
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(errorMessage);
    throw error;
  }
};

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
```

### API Routes Definition (`src/services/routes.js`)

```javascript
export const allRoutes = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  projects: {
    list: '/projects',
    create: '/projects',
    getById: (id) => `/projects/${id}`,
    update: (id) => `/projects/${id}`,
    delete: (id) => `/projects/${id}`,
    search: '/projects/search',
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    getById: (id) => `/tasks/${id}`,
    update: (id) => `/tasks/${id}`,
    delete: (id) => `/tasks/${id}`,
    assign: (id) => `/tasks/${id}/assign`,
    status: (id) => `/tasks/${id}/status`,
  },
  timesheet: {
    list: '/timesheet',
    create: '/timesheet',
    getById: (id) => `/timesheet/${id}`,
    update: (id) => `/timesheet/${id}`,
    delete: (id) => `/timesheet/${id}`,
    todayTotal: '/timesheet/today-total',
    underperformers: '/timesheet/underperformers',
    memberLogs: (email, date) => `/timesheet/member/${email}?date=${date}`,
  },
  team: {
    members: '/team/members',
    create: '/team/members',
    getById: (id) => `/team/members/${id}`,
    update: (id) => `/team/members/${id}`,
    delete: (id) => `/team/members/${id}`,
  },
  sprints: {
    list: '/sprints',
    create: '/sprints',
    getById: (id) => `/sprints/${id}`,
    update: (id) => `/sprints/${id}`,
    delete: (id) => `/sprints/${id}`,
  },
  stories: {
    list: '/stories',
    create: '/stories',
    getById: (id) => `/stories/${id}`,
    update: (id) => `/stories/${id}`,
    delete: (id) => `/stories/${id}`,
  },
};
```

### Service Examples

#### Project Service (`src/services/projectService.js`)

```javascript
import { apiCall } from './apiCall';
import { allRoutes } from './routes';

export const projectService = {
  // Get all projects
  getProjects: async (params = {}) => {
    return apiCall({
      method: 'GET',
      url: allRoutes.projects.list,
      params
    });
  },

  // Create new project
  createProject: async (projectData) => {
    return apiCall({
      method: 'POST',
      url: allRoutes.projects.create,
      data: projectData
    });
  },

  // Get project by ID
  getProjectById: async (id) => {
    return apiCall({
      method: 'GET',
      url: allRoutes.projects.getById(id)
    });
  },

  // Update project
  updateProject: async (id, projectData) => {
    return apiCall({
      method: 'PUT',
      url: allRoutes.projects.update(id),
      data: projectData
    });
  },

  // Delete project
  deleteProject: async (id) => {
    return apiCall({
      method: 'DELETE',
      url: allRoutes.projects.delete(id)
    });
  },

  // Search projects
  searchProjects: async (searchTerm) => {
    return apiCall({
      method: 'GET',
      url: allRoutes.projects.search,
      params: { q: searchTerm }
    });
  }
};
```

#### Timesheet Service (`src/services/timesheetService.js`)

```javascript
import { apiCall } from './apiCall';
import { allRoutes } from './routes';

export const timesheetService = {
  // Get all time logs
  getTimeLogs: async (params = {}) => {
    return apiCall({
      method: 'GET',
      url: allRoutes.timesheet.list,
      params
    });
  },

  // Create time log
  createTimeLog: async (timeLogData) => {
    return apiCall({
      method: 'POST',
      url: allRoutes.timesheet.create,
      data: timeLogData
    });
  },

  // Get today's total
  getTodayTotal: async () => {
    return apiCall({
      method: 'GET',
      url: allRoutes.timesheet.todayTotal
    });
  },

  // Get underperformers
  getUnderperformers: async (params = {}) => {
    return apiCall({
      method: 'GET',
      url: allRoutes.timesheet.underperformers,
      params
    });
  },

  // Get member time logs
  getMemberTimeLogs: async (email, date) => {
    return apiCall({
      method: 'GET',
      url: allRoutes.timesheet.memberLogs(email, date)
    });
  },

  // Update time log
  updateTimeLog: async (id, timeLogData) => {
    return apiCall({
      method: 'PUT',
      url: allRoutes.timesheet.update(id),
      data: timeLogData
    });
  },

  // Delete time log
  deleteTimeLog: async (id) => {
    return apiCall({
      method: 'DELETE',
      url: allRoutes.timesheet.delete(id)
    });
  }
};
```

## 🎯 Usage Examples

### Using Redux in Components

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchProjects } from '@/features/projects/projectSlice';

const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
};
```

### Using API Services

```javascript
import { useState, useEffect } from 'react';
import { projectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';

const ProjectForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (projectData) => {
    setLoading(true);
    try {
      const response = await projectService.createProject(projectData);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Authentication
VITE_AUTH_TOKEN_KEY=authToken

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.0",
    "react-toastify": "^9.1.3",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.536.0",
    "tailwindcss": "^3.3.6"
  }
}
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update API base URL and other configurations

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📝 Notes

- All API calls use the centralized `apiCall` utility for consistent error handling
- Redux slices are organized by feature for better maintainability
- Route guards ensure proper authentication and authorization
- Mock data is used for development and can be easily replaced with real API calls
- Toast notifications provide user feedback for all operations
- TypeScript support can be added by renaming `.jsx` files to `.tsx` and adding type definitions 