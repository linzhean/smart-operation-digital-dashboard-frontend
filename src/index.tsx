import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './component/Bootstrap/css/bootstrap.min.css';
import { UserProvider } from './context/UserControlContext';
import { ChartProvider } from './context/ChartContext';
import Main from './Main';
import Login from './pages/Login/Login';
// import PrivateRoute from './component/PrivateRoute';
import ProfileSetup from './pages/ProfileSetup/ProfileSetup';
import AwaitingApproval from './pages/ProfileSetup/AwaitingApproval';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <ChartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<Main />} />
            {/* <Route 
              path="/profile-setup" 
              element={<PrivateRoute requiredRole="0"><ProfileSetup /></PrivateRoute>} 
            /> */}
            {/* <Route 
              path="/awaiting-approval" 
              element={<PrivateRoute requiredRole="0"><AwaitingApproval /></PrivateRoute>} 
            /> */}
            {/* <Route 
              path="/*" 
              element={<PrivateRoute requiredRole="3"><Main /></PrivateRoute>} 
            /> */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ChartProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
