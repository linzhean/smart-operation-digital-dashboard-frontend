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
      <Navbar
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
      />
      <div className="theContent">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/group" element={<Group users={users} addUser={addUser} deleteUser={deleteUser} />} />
          <Route path="/profile" element={<Pdata />} />
          <Route path="/mail" element={<Mail />} />
          <Route path="/InterimKPIControl" element={<InterimKPIControl />} />
          <Route path="/AssignExportControl/*" element={<AssignExportControl />} />
          <Route path="/UserControl/*" element={<UserControl />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Main;
