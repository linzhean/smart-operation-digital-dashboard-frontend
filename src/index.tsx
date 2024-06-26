// App.js 或 index.js 中
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './component/Bootstrap/css/bootstrap.min.css';
import Main from './Main';
import Login from './pages/Login/Login'; // 假設有登錄頁面的組件

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Main />} /> {/* 其他頁面都導向到 Main */}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);