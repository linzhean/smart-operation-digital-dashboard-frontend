import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Group from './component/Group';
import Pdata from './component/Pdata';
import Mail from './pages/Mail/Mail';
import Navbar from './component/Common/Navbar';
import DrawerNavigation from './component/Common/DrawerNavigation';
import InterimKPIControl from './pages/InterimKPIControl/InterimKPIControl';
import AssignExportControl from './pages/AssignExportControl/AssignExportControl';
import UserControl from './pages/UserControl/UserControl';
import './component/Bootstrap/css/bootstrap.min.css';
import './styles/Main.css';
import useMain from './Hook/useMain';
import GroupManagement from './pages/GroupManagement/GroupManagement';
import PrivateRoute from './component/PrivateRoute';
// import PrivateRoute from './component/PrivateRoute';
// 需要sideBar的頁面－套wrapper包裹sideBar以及內容
// 用main_container包裹，控制內容顯示在右側
// 所有不管如何都需套theContent
// 無SideBar : theContent直接包
// 有SideBar : main_container > theContent

const Main: React.FC = () => {
  const {
    tabs,
    users,
    isDrawerOpen,
    selectedPage,
    isNavbarCollapsed,
    addTab,
    toggleDrawer,
    deleteTab,
    addUser,
    deleteUser,
    selectPage,
    toggleNavbar,
  } = useMain();

  return (
    <div className="App">
      {/* <Navbar
        selectedPage={selectedPage}
        selectPage={selectPage}
        toggleDrawer={toggleDrawer}
        toggleNavbar={toggleNavbar}
      />
      <DrawerNavigation
        tabs={tabs}
        onAddTab={addTab}
        onDeleteTab={deleteTab}
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      /> */}
      <Navbar />
      <Routes>
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Pdata />} />} />
        <Route path="/GroupManagement/*" element={<PrivateRoute element={<GroupManagement />} />} />
        <Route path="/mail" element={<PrivateRoute element={<Mail />} />} />
        <Route path="/InterimKPIControl" element={<PrivateRoute element={<InterimKPIControl />}/>} />
        <Route path="/AssignExportControl/*" element={<PrivateRoute element={<AssignExportControl />} />} />
        <Route path="/UserControl/*" element={<PrivateRoute element={<UserControl />} />} />
        {/* <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Pdata />} />
        <Route path="/GroupManagement/*" element={<GroupManagement />}/>
        <Route path="/mail" element={<Mail />} />
        <Route path="/InterimKPIControl" element={<InterimKPIControl />}/>
        <Route path="/AssignExportControl/*" element={<AssignExportControl />} />
        <Route path="/UserControl/*" element={<UserControl />} />
        <Route path="*" element={<Navigate to="/home" />} /> */}
      </Routes>
    </div>
  );
};

export default Main;
