import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Group from './component/Group/Group';
import Pdata from './component/Pdata/Pdata';
import Mail from './pages/Mail/Mail';
import Navbar from './component/Navbar/Navbar';
import DrawerNavigation from './component/DrawerNavigation/DrawerNavigation';
import './component/Bootstrap/css/bootstrap.min.css';
import './styles/Main.css';
import './styles/global.css';

const Main: React.FC = () => {
  const [tabs, setTabs] = useState<string[]>(['群組 1']);
  const [users, setUsers] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState<boolean>(true);

  const addTab = () => {
    const newTab = `群組 ${tabs.length + 1}`;
    setTabs([...tabs, newTab]);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const deleteTab = (index: number) => {
    if (window.confirm('確定要刪除嗎？')) {
      const newTabs = [...tabs];
      newTabs.splice(index, 1);
      setTabs(newTabs);
    }
  };

  const addUser = () => {
    const newUser = {
      username: 'New User',
      department: 'New Department',
      name: 'New Name',
      gmail: 'New Gmail',
      position: 'New Position',
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
    <div className="App">
      <Navbar selectedPage={selectedPage} toggleDrawer={toggleDrawer} selectPage={function (page: string): void {
        throw new Error('Function not implemented.');
      } } isNavbarCollapsed={false} toggleNavbar={function (): void {
        throw new Error('Function not implemented.');
      } } />
      
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
  );
};

export default Main;
