//src\Main.tsx
import React,{ useEffect } from 'react';
import { Routes, Route, Navigate ,useLocation, useNavigate} from 'react-router-dom';
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
    localStorage.setItem('lastVisitedPath', location.pathname);
  }, [location]);

  // 检查 localStorage 中是否有保存的路径，并重定向到该路径
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
          <Route path="/home" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><Home /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><Pdata /></PrivateRoute>} />
          <Route path="/GroupManagement/*" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><GroupManagement /></PrivateRoute>} />
          <Route path="/mail" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><Mail /></PrivateRoute>} />
          <Route path="/InterimKPIControl" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><InterimKPIControl /></PrivateRoute>} />
          <Route path="/AssignExportControl/*" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><AssignExportControl /></PrivateRoute>} />
          <Route path="/UserControl/*" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><UserControl /></PrivateRoute>} />
          <Route path="/ChartAdmin" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><ChartAdmin /></PrivateRoute>} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

          {/* <Route path="/home" element={<PrivateRoute allowedRoles={['USER', 'ADMIN', 'DEVELOPER']}><Home /></PrivateRoute>} />
          <Route path="/profile/*" element={<PrivateRoute allowedRoles={['USER', 'ADMIN', 'DEVELOPER']}><Pdata /></PrivateRoute>} />
          <Route path="/mail" element={<PrivateRoute allowedRoles={['USER', 'ADMIN', 'DEVELOPER']}><Mail /></PrivateRoute>} />
          <Route path="/GroupManagement/*" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><GroupManagement /></PrivateRoute>} />
          <Route path="/InterimKPIControl" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><InterimKPIControl /></PrivateRoute>} />
          <Route path="/AssignExportControl/*" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><AssignExportControl /></PrivateRoute>} />
          <Route path="/UserControl/*" element={<PrivateRoute allowedRoles={['ADMIN', 'DEVELOPER']}><UserControl /></PrivateRoute>} />
          <Route path="/ChartAdmin" element={<PrivateRoute allowedRoles={['DEVELOPER']}><ChartAdmin /></PrivateRoute>} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} /> */}

          {/* <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Pdata />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/GroupManagement/*" element={<GroupManagement />} />
          <Route path="/InterimKPIControl" element={<InterimKPIControl />} />
          <Route path="/AssignExportControl/*" element={<AssignExportControl />} />
          <Route path="/UserControl/*" element={<UserControl />} />
          <Route path="/ChartAdmin" element={<ChartAdmin />} />
          <Route path="*" element={<Navigate to="/login" />} /> */}

        </Route>
        <Route path="/404" element={<NotFound />} />
        {/* <Route path="*" element={<Navigate to="/404" />} /> */}
      </Routes>
    </div>
  );
};

export default Main;
