import React, { useState } from 'react';
import DrawerNavigation from './component/DrawerNavigation/DrawerNavigation';
import './component/Bootstrap/css/bootstrap.min.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import './App.css';
import Home from './component/Home/Home';
import Group from './component/Group/Group';
import Pdata from './component/Pdata';
import Menu from './assets/icon/burgerMenu-icon.svg';
import Dashboard from './assets/icon/dashBoard-icon.svg';
import group from './assets/icon/group-icon.svg';
import Manage from './assets/icon/graphManage-icon.svg';
import Email from './assets/icon/email-icon.svg';
import Profile from './assets/icon/userData-icon.svg';


const App: React.FC = () => {
  const [tabs, setTabs] = useState(["群組 1"]);
  const [users, setUsers] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home");

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
  };

  return (
    <div className='App'>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="brand" href="#">
            <img src={Menu} alt="Menu" onClick={toggleDrawer} />
          </a>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a
                className={`nav-item nav-link ${selectedPage === "home" ? "active" : ""}`}
                href="#"
                onClick={() => selectPage("home")}
              >
                <img src={Dashboard} alt="儀表板" />
                <span className="nav-text">儀表板</span>
              </a>
              <a
                className={`nav-item nav-link ${selectedPage === "group" ? "active" : ""}`}
                href="#"
                onClick={() => selectPage("group")}
              >
                <img src= {group} alt="群組" />
                <span className="nav-text">群組</span>
              </a>
              <a
                className={`nav-item nav-link ${selectedPage === "services" ? "active" : ""}`}
                href="#"
                onClick={() => selectPage("services")}
              >
                <img src={Manage} alt="" />
                <span className="nav-text">管理圖表</span>
              </a>
              <a
                className={`nav-item nav-link ${selectedPage === "email" ? "active" : ""}`}
                href="#"
                onClick={() => selectPage("email")}
              >
                <img src={Email} alt="" />
                <span className="nav-text">信件</span>
              </a>
              <a
                className={`nav-item nav-link ${selectedPage === "profile" ? "active" : ""}`}
                href="#"
                onClick={() => selectPage("profile")}
              >
                <img src={Profile} alt="" />
                <span className="nav-text">個人資料</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="content">
        {/* 根据 selectedPage 的值来显示不同的页面内容 */}
        {selectedPage === "home" && <Home />}
        {selectedPage === "group" && <Group users={users} addUser={addUser} deleteUser={deleteUser} />}
        {selectedPage === "profile" && <Pdata />}
      </div>

      {/* 添加 DrawerNavigation 组件，根据 isDrawerOpen 的值来决定是否显示 */}
      {isDrawerOpen && (
        <DrawerNavigation
          tabs={tabs}
          onAddTab={addTab}
          onDeleteTab={deleteTab}
          isOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
        />
      )}
    </div>
  );
};

export default App;
