import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the import path as needed

const ProtectedRoute = ({ roles, children }) => {
  const { isAuthenticated, userRoles } = useContext(AppContext);

  // Check if user roles intersect with the required roles for this route
  const hasRequiredRole = roles.length === 0 || roles.some(role => userRoles.includes(role));

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  } else if (!hasRequiredRole) {
    // If missing required roles, redirect to an unauthorized page or similar
    return <Navigate to="/unauthorized" />;
  }

  // User is authenticated and has required role(s)
  return children;
};

export default ProtectedRoute;