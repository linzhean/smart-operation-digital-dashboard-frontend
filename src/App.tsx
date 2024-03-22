import React, { useState } from 'react';
import DrawerNavigation from './component/DrawerNavigation';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import './App.css';
import Home from './component/Home';
import Group from './component/Group';
// import Services from './component/Services';
// import Email from './component/Email';
// import Profile from './component/Profile';

const App: React.FC = () => {
  const [tabs, setTabs] = useState([" 群組 1"]);
  const [users, setUsers] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home"); // 新增狀態來跟踪当前选中的页面，默认为"home"

  const addTab = () => {
    const newTab = `群組 ${tabs.length + 1}`;
    setTabs([...tabs, newTab]);
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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const selectPage = (page: string) => {
    setSelectedPage(page);
  };

  return (
    <div className='App'>
      <div className="top-navigation">
        <button className={`top-nav-item ${selectedPage === "home" ? "active" : ""}`} onClick={() => selectPage("home")}>首頁</button>
        <button className={`top-nav-item ${selectedPage === "group" ? "active" : ""}`} onClick={() => selectPage("group")}>群組</button>
        <button className={`top-nav-item ${selectedPage === "services" ? "active" : ""}`} onClick={() => selectPage("services")}>服務</button>
        <button className={`top-nav-item ${selectedPage === "email" ? "active" : ""}`} onClick={() => selectPage("email")}>郵件</button>
        <button className={`top-nav-item ${selectedPage === "profile" ? "active" : ""}`} onClick={() => selectPage("profile")}>個人資料</button>
      </div>
      <button className="toggle-button" onClick={toggleDrawer}>
        {isDrawerOpen ? <FaAngleLeft /> : <FaAngleRight />}
      </button>
      <DrawerNavigation
        tabs={tabs}
        onAddTab={addTab}
        onDeleteTab={deleteTab}
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      />
      <div className={`content ${isDrawerOpen ? 'drawer-open' : 'drawer-closed'}`}>
        {selectedPage === "home" && <Home />}
        {selectedPage === "group" && <Group users={users} addUser={addUser} deleteUser={deleteUser} />}
        {/* {selectedPage === "services" && <Services />}
        {selectedPage === "email" && <Email />}
        {selectedPage === "profile" && <Profile />} */}
      </div>
    </div>
  );
};

export default App;
