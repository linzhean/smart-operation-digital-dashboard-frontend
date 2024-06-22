// src/components/Navbar/Navbar.tsx
import React from 'react';
import Menu from '../../assets/icon/burgerMenu-icon.svg';
import Dashboard from '../../assets/icon/dashBoard-icon.svg';
import groupIcon from '../../assets/icon/group-icon.svg';
import Manage from '../../assets/icon/graphManage-icon.svg';
import Email from '../../assets/icon/email-icon.svg';
import Profile from '../../assets/icon/userData-icon.svg';
import '../../styles/Navbar.css';

interface NavbarProps {
  selectedPage: string;
  selectPage: (page: string) => void;
  isNavbarCollapsed: boolean;
  toggleNavbar: () => void;
  toggleDrawer: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  selectedPage,
  selectPage,
  isNavbarCollapsed,
  toggleNavbar,
  toggleDrawer,
}) => {
  return (
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
  );
};

export default Navbar;
