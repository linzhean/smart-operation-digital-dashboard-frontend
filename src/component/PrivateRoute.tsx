// // src/component/PrivateRoute.tsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useUserContext } from '../context/UserContext';

// interface PrivateRouteProps {
//   allowedRoles: string[];
//   children: React.ReactNode;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles, children }) => {
//   const { user } = useUserContext();

//   if (!user || !allowedRoles.includes(user.identity)) {
//     return <Navigate to="/login" />;
//   }

//   return <>{children}</>;
// };

// export default PrivateRoute;