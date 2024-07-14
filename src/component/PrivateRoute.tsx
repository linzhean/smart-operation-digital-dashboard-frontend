// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const authToken = localStorage.getItem('authToken');
  return authToken ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
