// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Home from './pages/Home/Home';
// import Pdata from './pages/Pdata/PersonalData';
// import Mail from './pages/Mail/Mail';
// import Navbar from './component/Common/Navbar';
// import InterimKPIControl from './pages/InterimKPIControl/InterimKPIControl';
// import AssignExportControl from './pages/AssignExportControl/AssignExportControl';
// import UserControl from './pages/UserControl/UserControl';
// import GroupManagement from './pages/GroupManagement/GroupManagement';
// import ChartAdmin from './pages/ChartAdmin/ChartAdmin';
// import './component/Bootstrap/css/bootstrap.min.css';
// import './styles/Main.css';
// import { useUserContext } from './context/UserContext';
// import AdvancedSmartAnalysis from './pages/AdvancedSmartAnalysis/AdvancedSmartAnalysis';
// import PrivateRoute from './component/PrivateRoute';

// const Main: React.FC = () => {
//   const { isAuthenticated } = useUserContext();

//   return (
//     <div className="App">
//       <Navbar />
//       <Routes>
//         <Route path="/home" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Home /></PrivateRoute>} />
//         <Route path="/profile/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Pdata /></PrivateRoute>} />
//         <Route path="/GroupManagement/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><GroupManagement /></PrivateRoute>} />
//         <Route path="/mail" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Mail /></PrivateRoute>} />
//         <Route path="/InterimKPIControl" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><InterimKPIControl /></PrivateRoute>} />
//         <Route path="/AssignExportControl/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><AssignExportControl /></PrivateRoute>} />
//         <Route path="/UserControl/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><UserControl /></PrivateRoute>} />
//         <Route path="/ChartAdmin" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><ChartAdmin /></PrivateRoute>} />
//         <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} /> 

//        <Route path="/home" element={<Home />} />
//         <Route path="/profile/*" element={<Pdata />} />
//         <Route path="/GroupManagement/*" element={<GroupManagement />} />
//         <Route path="/mail" element={<Mail />} />
//         <Route path="/InterimKPIControl" element={<InterimKPIControl />} />
//         <Route path="/AssignExportControl/*" element={<AssignExportControl />} />
//         <Route path="/UserControl/*" element={<UserControl />} />
//         <Route path="/ChartAdmin" element={<ChartAdmin />} />
//         <Route path="/AdvancedSmartAnalysis" element={<AdvancedSmartAnalysis />} />
//       </Routes>
//     </div>
//   );
// };

// export default Main; 

//src\Main.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Pdata from './pages/Pdata/PersonalData';
import Mail from './pages/Mail/Mail';
import NavbarRoute from './NavbarRoute'
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


const Main: React.FC = () => {
  const { isAuthenticated } = useUserContext();

  return (
    <div className="App">
      <Routes>
        {/* 沒有 Navbar  */}
        {/* 刷新頁面重新登錄 所以如果套Private直接跳轉會強制被帶回login*/}
        <Route path="/advanced-analysis" element={<AdvancedSmartAnalysis />} />

        {/* 有 Navbar  */}
        <Route element={<NavbarRoute />}>
          {/* <Route path="/home" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Home /></PrivateRoute>} />
          <Route path="/profile/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Pdata /></PrivateRoute>} />
          <Route path="/GroupManagement/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><GroupManagement /></PrivateRoute>} />
          <Route path="/mail" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><Mail /></PrivateRoute>} />
          <Route path="/InterimKPIControl" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><InterimKPIControl /></PrivateRoute>} />
          <Route path="/AssignExportControl/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><AssignExportControl /></PrivateRoute>} />
          <Route path="/UserControl/*" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><UserControl /></PrivateRoute>} />
          <Route path="/ChartAdmin" element={<PrivateRoute allowedRoles={['MANAGER', 'EMPLOYEE', 'ADMIN']}><ChartAdmin /></PrivateRoute>} />
          <Route path="*" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} /> */}

          <Route path="/home" element={<Home />} />
          <Route path="/profile/*" element={<Pdata />} />
          <Route path="/GroupManagement/*" element={<GroupManagement />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/InterimKPIControl" element={<InterimKPIControl />} />
          <Route path="/AssignExportControl/*" element={<AssignExportControl />} />
          <Route path="/UserControl/*" element={<UserControl />} />
          <Route path="/ChartAdmin" element={<ChartAdmin />} />
        </Route>
      </Routes>
    </div>
  );
};

export default Main;