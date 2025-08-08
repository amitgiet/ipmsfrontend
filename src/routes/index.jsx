import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthGuard from '../guards/AuthGuard';
import AppLayout from '../components/layout/AppLayout';
import { childrenComponents } from './childrenRoutes';

const LoginPage = lazy(() => import('../pages/auth/Login'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const withSuspense = (Component) => () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);


export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: childrenComponents
  },
  {
    path: '/login',
    element: withSuspense(LoginPage)(),
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage)(),
  },
]);
