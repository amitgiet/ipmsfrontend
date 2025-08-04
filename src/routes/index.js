import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '../guards/AuthGuard';
import AppLayout from '../components/layout/AppLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const ProjectListPage = lazy(() => import('../pages/project/ProjectListPage'));
const SprintListPage = lazy(() => import('../pages/sprint/SprintListPage'));
const StoryListPage = lazy(() => import('../pages/story/StoryListPage'));
const TaskListPage = lazy(() => import('../pages/tasks/TaskListPage'));
const TimesheetPage = lazy(() => import('../pages/timesheet/TimesheetPage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: '/dashboard',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardPage />
            </Suspense>
          </AuthGuard>
        )
      },
      {
        path: '/projects',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectListPage />
            </Suspense>
          </AuthGuard>
        )
      },
      {
        path: '/sprints',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <SprintListPage />
            </Suspense>
          </AuthGuard>
        )
      },
      {
        path: '/stories',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <StoryListPage />
            </Suspense>
          </AuthGuard>
        )
      },
      {
        path: '/tasks',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <TaskListPage />
            </Suspense>
          </AuthGuard>
        )
      },
      {
        path: '/timesheet',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <TimesheetPage />
            </Suspense>
          </AuthGuard>
        )
      },
      {
        path: '/settings',
        element: (
          <AuthGuard>
            <Suspense fallback={<LoadingSpinner />}>
              <SettingsPage />
            </Suspense>
          </AuthGuard>
        )
      }
    ]
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFoundPage />
      </Suspense>
    )
  }
]); 