//src\Main.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

  return (
    <div className="App">
      <Routes>
        <Route path="/advanced-analysis" element={<AdvancedSmartAnalysis />} />
        <Route element={<NavbarRoute />}>
        {/*  */}
          <Route path="/home" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><Home /></PrivateRoute>} />
          <Route path="/profile/*" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><Pdata /></PrivateRoute>} />
          <Route path="/GroupManagement/*" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><GroupManagement /></PrivateRoute>} />
          <Route path="/mail" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><Mail /></PrivateRoute>} />
          <Route path="/InterimKPIControl" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><InterimKPIControl /></PrivateRoute>} />
          <Route path="/AssignExportControl/*" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><AssignExportControl /></PrivateRoute>} />
          <Route path="/UserControl/*" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><UserControl /></PrivateRoute>} />
          <Route path="/ChartAdmin" element={<PrivateRoute allowedRoles={['USER', 'DEVELOPER', 'ADMIN']}><ChartAdmin /></PrivateRoute>} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        </Route>
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </div>
  );
};

export default Main;
