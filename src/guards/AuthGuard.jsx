import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { restoreAuth } from "@/features/auth/authSlice";

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if we have stored authentication data
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const teamUser = localStorage.getItem("teamUser");
    const isStoredAuthenticated = localStorage.getItem("isAuthenticated");

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
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const teamUser = localStorage.getItem("teamUser");
    const isStoredAuthenticated = localStorage.getItem("isAuthenticated");

    return token && (user || teamUser) && isStoredAuthenticated === "true";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check both Redux state and localStorage
  if (!isAuthenticated && !checkStoredAuth()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
