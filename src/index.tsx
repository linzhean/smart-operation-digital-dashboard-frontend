// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './component/Bootstrap/css/bootstrap.min.css';
import { UserProvider } from './context/UserContext';
import { ChartProvider } from './context/ChartContext';
import Main from './Main';
import Login from './pages/Login/Login';
import ProfileSetup from './pages/ProfileSetup/ProfileSetup';
import AwaitingApproval from './pages/ProfileSetup/AwaitingApproval';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <UserProvider>
    <ChartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/awaiting-approval" element={<AwaitingApproval />} />
          <Route path="/*" element={<Main />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ChartProvider>
  </UserProvider>
);
