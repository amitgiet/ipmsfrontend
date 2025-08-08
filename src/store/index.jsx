import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice';
import sprintReducer from '../features/sprints/sprintSlice';
import storyReducer from '../features/stories/storySlice';
import taskReducer from '../features/tasks/taskSlice';
import timesheetReducer from '../features/timesheet/timesheetSlice';

export const store = configureStore({
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