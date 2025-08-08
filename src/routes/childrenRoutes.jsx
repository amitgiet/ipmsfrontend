import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Utility wrapper
const withSuspense = (Component) => {
  return function WrappedComponent() {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    );
  };
};

// Lazy Pages
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProjectListPage = lazy(() => import('../pages/project/ProjectListPage'));
const SprintListPage = lazy(() => import('../pages/sprint/SprintListPage'));
const StoryListPage = lazy(() => import('../pages/story/StoryListPage'));
const TaskListPage = lazy(() => import('../pages/tasks/TaskListPage'));
const TimesheetPage = lazy(() => import('../pages/timesheet/TimesheetPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const LoginPage = lazy(() => import('../pages/auth/Login'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// App Routes
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
