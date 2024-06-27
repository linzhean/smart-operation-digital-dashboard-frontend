// src/Main.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Group from './component/Group/Group';
import Pdata from './component/Pdata/Pdata';
import Mail from './pages/Mail/Mail';
import DrawerNavigation from './component/DrawerNavigation/DrawerNavigation';
import Login from './pages/Login/Login';
import Navbar from './component/Navbar/Navbar';
import UserTabs from './component/UserTabs/UserTabs';
import './styles/Bootstrap/css/bootstrap.min.css';
import './styles/Main.css';

const Main: React.FC = () => {
  const [tabs, setTabs] = useState<string[]>(["群組 1"]);
  const [users, setUsers] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState<boolean>(true);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setSelectedPage("home");
    }
  }, []);

  const addTab = () => {
    const newTab = `群組 ${tabs.length + 1}`;
    setTabs([...tabs, newTab]);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const deleteTab = (index: number) => {
    if (window.confirm("確定要刪除嗎？")) {
      const newTabs = [...tabs];
      newTabs.splice(index, 1);
      setTabs(newTabs);
    }
  };

  const addUser = () => {
    const newUser = {
      username: "New User",
      department: "New Department",
      name: "New Name",
      gmail: "New Gmail",
      position: "New Position",
    };
    setUsers([...users, newUser]);
  };

  const deleteUser = (index: number) => {
    const newUsers = [...users];
    newUsers.splice(index, 1);
    setUsers(newUsers);
  };

  const selectPage = (page: string) => {
    setSelectedPage(page);
    setIsDrawerOpen(false);
    setIsNavbarCollapsed(true);
  };

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AuthenticatedApp
          tabs={tabs}
          addTab={addTab}
          deleteTab={deleteTab}
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
          users={users}
          addUser={addUser}
          deleteUser={deleteUser}
          selectedPage={selectedPage}
          selectPage={selectPage}
          isNavbarCollapsed={isNavbarCollapsed}
          toggleNavbar={toggleNavbar}
        />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

interface AuthenticatedAppProps {
  tabs: string[];
  addTab: () => void;
  deleteTab: (index: number) => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  users: any[];
  addUser: () => void;
  deleteUser: (index: number) => void;
  selectedPage: string;
  selectPage: (page: string) => void;
  isNavbarCollapsed: boolean;
  toggleNavbar: () => void;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({
  tabs,
  addTab,
  deleteTab,
  isDrawerOpen,
  toggleDrawer,
  users,
  addUser,
  deleteUser,
  selectedPage,
  selectPage,
  isNavbarCollapsed,
  toggleNavbar,
}) => {
  return (
    <div className='App'>
      <Navbar 
        selectedPage={selectedPage} 
        selectPage={selectPage} 
        isNavbarCollapsed={isNavbarCollapsed} 
        toggleNavbar={toggleNavbar} 
        toggleDrawer={toggleDrawer}
      />

      <div className="content">
        {selectedPage === "home" && <Home />}
        {selectedPage === "group" && <Group users={users} addUser={addUser} deleteUser={deleteUser} />}
        {selectedPage === "profile" && <Pdata />}
        {selectedPage === "email" && <Mail />}
      </div>

      <DrawerNavigation
        tabs={tabs}
        onAddTab={addTab}
        onDeleteTab={deleteTab}
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />
      <UserTabs tabs={tabs} addTab={addTab} deleteTab={deleteTab} />
    </div>
  );
};

export default Main;
