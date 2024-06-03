import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './component/Home/Home';
import Group from './component/Group/Group';
import Pdata from './Pdata/Pdata';
import Mail from './component/Mail/Mail';
import DrawerNavigation from './component/DrawerNavigation/DrawerNavigation';
import Login from './component/GoogleLogin/Login';
import './component/Bootstrap/css/bootstrap.min.css';
import './App.css';
import Menu from './assets/icon/burgerMenu-icon.svg';
import Dashboard from './assets/icon/dashBoard-icon.svg';
import groupIcon from './assets/icon/group-icon.svg';
import Manage from './assets/icon/graphManage-icon.svg';
import Email from './assets/icon/email-icon.svg';
import Profile from './assets/icon/userData-icon.svg';

const App: React.FC = () => {
  const [tabs, setTabs] = useState<string[]>(["群組 1"]);
  const [users, setUsers] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState<boolean>(true);

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

  const authToken = localStorage.getItem('authToken');

  return (
    <Router>
      <Routes>
        {!authToken ? (
          <Route path="/login" element={<Login />} />
        ) : (
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
        )}
        <Route path="/" element={<Navigate to={authToken ? "/app" : "/login"} />} />
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
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="brand hamburger" href="#">
            <img src={Menu} alt="Menu" onClick={toggleDrawer} />
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded={!isNavbarCollapsed ? "true" : "false"} aria-label="Toggle navigation"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isNavbarCollapsed ? '' : 'show'}`} id="navbarNavAltMarkup">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className={`nav-link ${selectedPage === "home" ? "active" : ""}`} href="#"
                  onClick={() => selectPage("home")}>
                  <img src={Dashboard} alt="儀表板" />
                  <span className="nav-text">儀表板</span>
                </a>
              </li>

              <li className="nav-item">
                <a className={`nav-link ${selectedPage === "group" ? "active" : ""}`} href="#"
                  onClick={() => selectPage("group")}>
                  <img src={groupIcon} alt="群組" />
                  <span className="nav-text">群組</span>
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${selectedPage === "services" ? "active" : ""}`} href="#"
                  onClick={() => selectPage("services")}>
                  <img src={Manage} alt="管理圖表" />
                  <span className="nav-text">管理圖表</span>
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${selectedPage === "email" ? "active" : ""}`} href="#"
                  onClick={() => selectPage("email")}>
                  <img src={Email} alt="信件" />
                  <span className="nav-text">信件</span>
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${selectedPage === "profile" ? "active" : ""}`} href="#"
                  onClick={() => selectPage("profile")}>
                  <img src={Profile} alt="個人資料" />
                  <span className="nav-text">個人資料</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

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
    </div>
  );
};

export default App;
