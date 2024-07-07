import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './component/Bootstrap/css/bootstrap.min.css';
import { ChartProvider } from './context/ChartContext';
import Main from './Main';
import Login from './pages/Login/Login';
import UserManagement from './pages/Admin/UserManagement'; // 新增

ReactDOM.render(
  <React.StrictMode>
    <ChartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/user-management" element={<UserManagement />} /> {/* 新增 */}
          <Route path="/*" element={<Main />} /> {/* 其他頁面都導向到 Main */}
        </Routes>
      </Router>
    </ChartProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
