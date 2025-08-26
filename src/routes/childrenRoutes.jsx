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

// Additional Lazy Pages for missing routes
const ProjectDashboardPage = lazy(() => import("../components/projects/ProjectDashboardPage"));
const UserStoryGrooming = lazy(() => import('../pages/story/UserStoryGrooming'));
const StoryDetailsPage = lazy(() => import('../pages/story/StoryDetailsPage'));
const SprintManagementPage = lazy(() => import('../components/sprints/SprintManagementPage'));
const CreateSprintPageWrapper = lazy(() => import('../components/sprints/CreateSprintPageWrapper'));
const DeveloperTasksPage = lazy(() => import('../components/developer/DeveloperTasksPage'));
const QAStoriesPage = lazy(() => import('../components/qa/QAStoriesPage'));
const ClientDashboard = lazy(() => import('../pages/dashboard/ClientDashboard/ClientDashboard'));
// const TimeLogsPage = lazy(() => import('../components/TimeLogsPage'));

// App Routes
export const childrenComponents = [
  { path: '', element: <Navigate to="/dashboard" replace /> },
  { path: 'dashboard/*', element: withSuspense(DashboardPage)() },
  { path: 'projects', element: withSuspense(ProjectListPage)() },
  { path: 'sprints', element: withSuspense(SprintListPage)() },
  { path: 'stories', element: withSuspense(StoryListPage)() },
  { path: 'tasks', element: withSuspense(TaskListPage)() },
  { path: 'timesheet', element: withSuspense(TimesheetPage)() },
  { path: 'settings', element: withSuspense(SettingsPage)() },
  
  // Project-specific routes
  { path: 'project/:projectId', element: withSuspense(ProjectDashboardPage)() },
  { path: 'client-project/:projectId', element: withSuspense(ClientDashboard)() },
  // { path: 'project/:projectId/time-logs', element: withSuspense(TimeLogsPage)() },
  { path: 'project/:projectId/sprints/create', element: withSuspense(CreateSprintPageWrapper)() },
  { path: 'project/:projectId/story/:storyId/groom', element: withSuspense(UserStoryGrooming)() },
  { path: 'project/:projectId/story/:storyId/details', element: withSuspense(StoryDetailsPage)() },
  { path: 'project/:projectId/sprint/:sprintId/manage', element: withSuspense(SprintManagementPage)() },
  
  // Developer and QA routes
  { path: 'my-tasks', element: withSuspense(DeveloperTasksPage)() },
  { path: 'qa/stories', element: withSuspense(QAStoriesPage)() }
];

export const authChildren = [
  { path: '', element: withSuspense(LoginPage)() }
];

export const notFoundChildren = [
  { path: '*', element: withSuspense(NotFoundPage)() }
];
