import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/GoogleLogin/Login';
import Pdata from './Pdata/Pdata';
import './index.css';


// App 组件是应用的入口点
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app/*" element={<AppLayout />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

// AppLayout 包含 App 应用的布局和导航
const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/pdata" element={<Pdata />} />
          {/* 在这里添加其他页面的路由 */}
        </Routes>
      </main>
    </div>
  );
};

// Navbar 组件
const Navbar: React.FC = () => {
  return (
    <nav>
      {/* 在这里添加 Navbar 的内容 */}
    </nav>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
