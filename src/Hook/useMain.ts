import { useState } from 'react';

const useMain = () => {
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

  return {
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
  };
};

export default useMain;
