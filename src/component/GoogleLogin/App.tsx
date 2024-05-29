import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../Home/Home';
import Group from '../Group/Group';
import Pdata from '../../Pdata/Pdata';
import DrawerNavigation from '../DrawerNavigation/DrawerNavigation';
import './component/Bootstrap/css/bootstrap.min.css';
import './App.css';
import Login from './Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 设置路由，当路径为 /login 时渲染 Login 组件 */}
        <Route path="/login" element={<Login />} />
        {/* 设置其他路由 */}
        <Route path="/app/*" element={<AuthenticatedApp />} />
        {/* 添加根路径重定向 */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

const AuthenticatedApp: React.FC = () => {
  return (
    <>
      {/* Your DrawerNavigation component and other authenticated routes */}
      <DrawerNavigation tabs={[]} onAddTab={function (): void {
        throw new Error('Function not implemented.');
      } } onDeleteTab={function (index: number): void {
        throw new Error('Function not implemented.');
      } } isOpen={false} toggleDrawer={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group" element={<Group users={[]} addUser={function (): void {
          throw new Error('Function not implemented.');
        } } deleteUser={function (index: number): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="/profile" element={<Pdata />} />
        {/* Add other routes */}
      </Routes>
    </>
  );
};

export default App;
