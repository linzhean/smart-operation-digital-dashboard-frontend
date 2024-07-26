// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useUserContext } from '../context/UserControlContext';

// interface PrivateRouteProps {
//   children: React.ReactNode;
//   requiredRole: string;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
//   const { user } = useUserContext();
//   const location = useLocation();

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (user.role !== requiredRole) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return <>{children}</>;
// };

// export default PrivateRoute;
