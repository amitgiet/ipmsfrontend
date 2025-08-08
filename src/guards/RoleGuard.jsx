import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleGuard = ({ children, allowedRoles, fallback, redirectTo = "/unauthorized" }) => {
  const { user, teamUser } = useSelector((state) => state.auth);
  const currentUser = user || teamUser;
  
  // if (!currentUser) {
  //   return <Navigate to="/auth/login" replace />;
  // }
  
  if (!allowedRoles.includes("admin")) {
    return fallback ? <>{fallback}</> : <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default RoleGuard; 