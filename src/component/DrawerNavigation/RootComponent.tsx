import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../GoogleLogin/Login';
import App from '../../App';

const RootComponent = () => {
  const authToken = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app/*" element={authToken ? <App /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={authToken ? "/app/pdata" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default RootComponent;
