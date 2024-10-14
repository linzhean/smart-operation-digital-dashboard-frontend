import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Pdata from './pages/Pdata/PersonalData';
import Mail from './pages/Mail/Mail';
import NavbarRoute from './NavbarRoute';
import InterimKPIControl from './pages/InterimKPIControl/InterimKPIControl';
import AssignExportControl from './pages/AssignExportControl/AssignExportControl';
import UserControl from './pages/UserControl/UserControl';
import GroupManagement from './pages/GroupManagement/GroupManagement';
import ChartAdmin from './pages/ChartAdmin/ChartAdmin';
import './component/Bootstrap/css/bootstrap.min.css';
import './styles/Main.css';
import { useUserContext } from './context/UserContext';
import AdvancedSmartAnalysis from './pages/AdvancedSmartAnalysis/AdvancedSmartAnalysis';
import PrivateRoute from './component/PrivateRoute';
import NotFound from './pages/NotFound/NotFound';

const Main: React.FC = () => {
  const { isAuthenticated } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查當前路徑是否為 /profile-setup 或 /awaiting-approval
    if (location.pathname === '/profile-setup' || location.pathname === '/awaiting-approval') {
      // 清除特定的 localStorage 項目，例如 authToken
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      // 如果當前路徑不是 /profile-setup 或 /awaiting-approval，才儲存 lastVisitedPath
      localStorage.setItem('lastVisitedPath', location.pathname);
    }
  }, [location, navigate]);

  useEffect(() => {
    const savedPath = localStorage.getItem('lastVisitedPath');
    if (savedPath) {
      navigate(savedPath);
    }
  }, [navigate]);

  const identityMapping: { [key: string]: string } = {
    '無權限': 'NO_PERMISSION',
    '職員': 'USER',
    '管理員': 'ADMIN',
    '開發者': 'DEVELOPER'
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/advanced-analysis" element={<AdvancedSmartAnalysis />} />
        <Route element={<NavbarRoute />}>
          <Route path="/home" element={<PrivateRoute allowedRoles={['USER', 'ADMIN', 'DEVELOPER']}><Home /></PrivateRoute>} />
          <Route path="/profile/*" element={<PrivateRoute allowedRoles={['USER', 'ADMIN', 'DEVELOPER']}><Pdata /></PrivateRoute>} />
          <Route path="/mail" element={<PrivateRoute allowedRoles={['USER', 'ADMIN', 'DEVELOPER']}><Mail /></PrivateRoute>} />
          <Route path="/GroupManagement/*" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><GroupManagement /></PrivateRoute>} />
          <Route path="/InterimKPIControl" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><InterimKPIControl /></PrivateRoute>} />
          <Route path="/AssignExportControl/*" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><AssignExportControl /></PrivateRoute>} />
          <Route path="/UserControl/*" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><UserControl /></PrivateRoute>} />
          <Route path="/ChartAdmin" element={<PrivateRoute allowedRoles={['DEVELOPER']}><ChartAdmin /></PrivateRoute>} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Main;
