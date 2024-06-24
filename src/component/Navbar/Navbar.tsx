import React from 'react';
import { Link } from 'react-router-dom';
import Menu from '../../assets/icon/burgerMenu-icon.svg';
import Dashboard from '../../assets/icon/dashBoard-icon.svg';
import groupIcon from '../../assets/icon/group-icon.svg';
import Manage from '../../assets/icon/graphManage-icon.svg';
import Email from '../../assets/icon/email-icon.svg';
import Profile from '../../assets/icon/userData-icon.svg';
import '../../styles/navbar.css'; // 确保导入正确的样式文件
import "../../styles/content.css"

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
        <Link className="brand hamburger" to="/" onClick={toggleDrawer}>
          <img src={Menu} alt="Menu" />
        </Link>

        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className={`nav-link ${selectedPage === 'home' ? 'active' : ''}`}
              to="/home"
              onClick={() => selectPage('home')}
            >
              <img src={Dashboard} alt="儀表板" />
              <span className="nav-text">儀表板</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${selectedPage === 'group' ? 'active' : ''}`}
              to="/group"
              onClick={() => selectPage('group')}
            >
              <img src={groupIcon} alt="群組" />
              <span className="nav-text">群組</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${selectedPage === 'services' ? 'active' : ''}`}
              to="/services"
              onClick={() => selectPage('services')}
            >
              <img src={Manage} alt="管理圖表" />
              <span className="nav-text">管理圖表</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${selectedPage === 'email' ? 'active' : ''}`}
              to="/email"
              onClick={() => selectPage('email')}
            >
              <img src={Email} alt="信件" />
              <span className="nav-text">信件</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${selectedPage === 'profile' ? 'active' : ''}`}
              to="/profile"
              onClick={() => selectPage('profile')}
            >
              <img src={Profile} alt="個人資料" />
              <span className="nav-text">個人資料</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
