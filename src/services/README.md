# API Infrastructure Documentation

This directory contains the API infrastructure for the IPMS application.

## Files Structure

```
src/services/
├── axios.js           # Axios instance with interceptors
├── apiCall.js         # Main API call utility with retry logic
├── routes.js          # API routes organized by feature
├── index.js           # Main exports
├── projectService.js  # Project-related API calls
├── taskService.js     # Task-related API calls
├── authService.js     # Authentication-related API calls
└── README.md          # This documentation
```

## Usage

### Basic API Call

```javascript
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

// GET request
const result = await apiCall(allRoutes.projects.list, 'get');

// POST request
const newProject = await apiCall(allRoutes.projects.create, 'post', projectData);

// PUT request
const updatedProject = await apiCall(allRoutes.projects.update(id), 'put', projectData);

// DELETE request
const deletedProject = await apiCall(allRoutes.projects.delete(id), 'delete');
```

### Using Service Files

```javascript
import { projectService } from '@/services/projectService';

// Get all projects
const { success, data, error } = await projectService.getProjects();

// Create a project
const result = await projectService.createProject({
  name: 'New Project',
  description: 'Project description'
});

// Update a project
const updated = await projectService.updateProject(id, {
  name: 'Updated Project Name'
});
```

### Error Handling

The `apiCall` function automatically handles:
- 401/403 errors (redirects to login)
- 500 errors (retries up to 2 times)
- Network errors
- Validation errors
- Toast notifications for errors

```javascript
const result = await apiCall(url, 'get');

if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
}
```

### Configuration

#### Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Axios Configuration

The axios instance is configured with:
- Base URL from environment variable
- 10-second timeout
- Automatic token injection
- Global error handling

## Features

- **Retry Logic**: Automatically retries failed requests (500 errors)
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Authentication**: Automatic token injection and logout on auth errors
- **Type Safety**: Organized routes with clear structure
- **Logging**: Detailed logging for debugging
- **Toast Notifications**: Automatic error notifications using react-toastify

## Adding New Services

1. Create a new service file (e.g., `userService.js`)
2. Import `apiCall` and `allRoutes`
3. Define your service methods
4. Export the service

```javascript
import { apiCall } from './apiCall';
import { allRoutes } from './routes';

export const userService = {
  getUsers: async () => {
    return await apiCall(allRoutes.users.list, 'get');
  },
  
  createUser: async (userData) => {
    return await apiCall(allRoutes.users.create, 'post', userData);
  }
};
```

## Health Check

```javascript
import { checkApiHealth } from '@/services/apiCall';

const health = await checkApiHealth();
if (health.success) {
  console.log('API is healthy');
} else {
  console.error('API health check failed');
}
``` 