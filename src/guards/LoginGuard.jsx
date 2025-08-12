import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { restoreAuth } from "@/features/auth/authSlice";

const LoginGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Check if we have stored authentication data
    const token = localStorage.getItem("ipms_token");
    const user = localStorage.getItem("ipms_user");
    const teamUser = localStorage.getItem("ipms_teamUser");
    const isStoredAuthenticated = localStorage.getItem("ipms_isAuthenticated");

    if (
      token &&
      (user || teamUser) &&
      isStoredAuthenticated === "true" &&
      !isAuthenticated
    ) {
      // Restore authentication state from localStorage
      dispatch(restoreAuth());
    }
  }, [dispatch, isAuthenticated]);

  // Check localStorage directly for immediate authentication state
  const checkStoredAuth = () => {
    const token = localStorage.getItem("ipms_token");
    const user = localStorage.getItem("ipms_user");
    const teamUser = localStorage.getItem("ipms_teamUser");
    const isStoredAuthenticated = localStorage.getItem("ipms_isAuthenticated");

    return token && (user || teamUser) && isStoredAuthenticated === "true";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated || checkStoredAuth()) {
    // Try to redirect to the intended destination or default to dashboard
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect') || '/';
    
    // Ensure we don't redirect back to login
    if (redirectTo === '/login') {
      return <Navigate to="/" replace />;
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default LoginGuard;
