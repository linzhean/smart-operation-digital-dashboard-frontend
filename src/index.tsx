import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Login from './pages/Login/Login';
import InterimKPIControl from './pages/InterimKPIControl/InterimKPIControl';

import UserManagement from './pages/Admin/UserManagement'; // 新增

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/user-management" element={<UserManagement />} /> {/* 新增 */}
        <Route path="/*" element={<Main />} /> {/* 其他頁面都導向到 Main */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
