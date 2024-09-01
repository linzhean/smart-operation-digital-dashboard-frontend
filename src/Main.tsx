// src/Main.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Pdata from './pages/Pdata/PersonalData';
import Mail from './pages/Mail/Mail';
import Navbar from './component/Common/Navbar';
import InterimKPIControl from './pages/InterimKPIControl/InterimKPIControl';
import AssignExportControl from './pages/AssignExportControl/AssignExportControl';
import UserControl from './pages/UserControl/UserControl';
import GroupManagement from './pages/GroupManagement/GroupManagement';
import ChartAdmin from './pages/ChartAdmin/ChartAdmin';
import './component/Bootstrap/css/bootstrap.min.css';
import './styles/Main.css';
import { useUserContext } from './context/UserContext';
import PrivateRoute from './component/PrivateRoute';

const Main: React.FC = () => {
  const { isAuthenticated } = useUserContext();

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/home" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Home /></PrivateRoute>} />
        <Route path="/profile/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Pdata /></PrivateRoute>} />
        <Route path="/GroupManagement/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><GroupManagement /></PrivateRoute>} />
        <Route path="/mail" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Mail /></PrivateRoute>} />
        <Route path="/InterimKPIControl" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><InterimKPIControl /></PrivateRoute>} />
        <Route path="/AssignExportControl/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><AssignExportControl /></PrivateRoute>} />
        <Route path="/UserControl/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><UserControl /></PrivateRoute>} />
        {/* <Route path="/TaskKpiSetting/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><TaskKpiSetting /></PrivateRoute>} /> */}
        <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

         {/* <Route path="/home" element={<Home />} />
        <Route path="/profile/*" element={<Pdata />} />
        <Route path="/GroupManagement/*" element={<GroupManagement />} />
        <Route path="/mail" element={<Mail />} />
        <Route path="/InterimKPIControl" element={<InterimKPIControl />} />
        <Route path="/AssignExportControl/*" element={<AssignExportControl />} />
        <Route path="/UserControl/*" element={<UserControl />} />
        <Route path="/ChartAdmin" element={<ChartAdmin />} /> */}
      </Routes>
    </div>
  );
};

export default Main;
