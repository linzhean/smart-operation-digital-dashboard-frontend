// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './component/Bootstrap/css/bootstrap.min.css';
import { ChartProvider } from './context/ChartContext';
import { UserProvider } from './context/UserContext';
import Main from './Main';
import Login from './pages/Login/Login';
import UserManagement from './pages/Admin/UserManagement';
import PrivateRoute from './component/PrivateRoute';

ReactDOM.render(
  <React.StrictMode>
    <ChartProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin/user-management" element={<PrivateRoute element={<UserManagement />} />} />
            {/* <Route path="/admin/user-management" element={<UserManagement />} /> */}
            <Route path="/*" element={<PrivateRoute element={<Main />} />} />
            {/* <Route path="/*" element={<Main />} /> */}
          </Routes>
        </Router>
      </UserProvider>
    </ChartProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
