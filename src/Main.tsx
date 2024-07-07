import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Group from './component/Group';
import Pdata from './component/Pdata';
import Mail from './pages/Mail/Mail';
import Navbar from './component/Common/Navbar';
import DrawerNavigation from './component/Common/DrawerNavigation';
import { UserProvider } from './context/UserContext';
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
    <UserProvider>
      <div className="App">
        <Navbar
          selectedPage={selectedPage}
          selectPage={selectPage}
          toggleDrawer={toggleDrawer}
          isNavbarCollapsed={isNavbarCollapsed}
          toggleNavbar={toggleNavbar}
        />
        
        <DrawerNavigation
          tabs={tabs}
          onAddTab={addTab}
          onDeleteTab={deleteTab}
          isOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
        />

        <div className="content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/group" element={<Group users={users} addUser={addUser} deleteUser={deleteUser} />} />
            <Route path="/profile" element={<Pdata />} />
            <Route path="/email" element={<Mail />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </UserProvider>
  );
};

export default Main;
