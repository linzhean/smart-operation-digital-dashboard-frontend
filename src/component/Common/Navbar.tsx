import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

import burgerMenuIcon from '../../assets/icon/burgerMenu-icon.svg';
import dashBoardIcon from '../../assets/icon/dashBoard-icon.svg';
import groupIcon from '../../assets/icon/group-icon.svg';
import emailIcon from '../../assets/icon/email-icon.svg';
import userDataIcon from '../../assets/icon/userData-icon.svg';
import AssignExportControlIcon from '../../assets/icon/AssignExportControl.svg';
import InterimKPIControl from '../../assets/icon/InterimKPIControl.svg';
import UserControl from '../../assets/icon/UserControl.svg';

const NavBar: React.FC = () => {
  const location = useLocation();
  const activeLink = location.pathname;

  return (
    <nav className={`navbar navbar-expand-lg ${styles.bgBodyTertiary}`}>
      <div className="container-fluid">
        <a className={`brand ${styles.navbarHamburger}`} id='hamburger' href="#">
          <img className={`brandImg ${styles.brandImg}`} src={burgerMenuIcon} alt="menu" />
        </a>
        <button
          onClick={() => console.log('clicked!!!!')}
          className={`navbar-toggler ${styles.navbarToggler}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse`} id="navbarNavAltMarkup">
          <ul className={`navbar-nav ${styles.navbarNav}`}>

            {/* 權限管理 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/AssignExportControl') ? styles.activeNavLink : ''}`}
                to="/AssignExportControl"
              >
                <img className={styles.navbarNavItemImg} src={AssignExportControlIcon} alt="graphManage" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/AssignExportControl') ? styles.activeNavLinkText : ''}`}>權限管理</span>
              </Link>
            </li>


            {/* 使用者管理 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/UserControl') ? styles.activeNavLink : ''}`}
                to="/UserControl/userApply"
              >
                <img className={styles.navbarNavItemImg} src={UserControl} alt="UserControl" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/UserControl') ? styles.activeNavLinkText : ''}`}>使用者管理</span>
              </Link>
            </li>


            {/* ＫＰＩ審核 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/InterimKPIControl') ? styles.activeNavLink : ''}`}
                to="/InterimKPIControl"
              >
                <img className={styles.navbarNavItemImg} src={InterimKPIControl} alt="graphManage" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/InterimKPIControl') ? styles.activeNavLinkText : ''}`}>臨時KPI審核</span>
              </Link>
            </li>




            {/* 群組管理 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/group') ? styles.activeNavLink : ''}`}
                to="/group"
              >
                <img className={styles.navbarNavItemImg} src={groupIcon} alt="group" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/group') ? styles.activeNavLinkText : ''}`}>群組</span>
              </Link>
            </li>
            {/* 首頁－儀表板 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink === '/' ? styles.activeNavLink : ''}`}
                aria-current="page"
                to="/"
              >
                <img className={styles.navbarNavItemImg} src={dashBoardIcon} alt="dashboard" />
                <span className={`${styles.navbarText} ${activeLink === '/' ? styles.activeNavLinkText : ''}`}>儀表板</span>
              </Link>
            </li>
            {/* 信件 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/mail') ? styles.activeNavLink : ''}`}
                to="/mail"
              >
                <img className={`${styles.navbarNavItemImg} ${styles.navbarNavItemMail}`} src={emailIcon} alt="mail" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/mail') ? styles.activeNavLinkText : ''}`}>信件</span>
              </Link>
            </li>
            {/* 個人資料 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/profile') ? styles.activeNavLink : ''}`}
                to="/profile"
              >
                <img className={styles.navbarNavItemImg} src={userDataIcon} alt="profile" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/profile') ? styles.activeNavLinkText : ''}`}>個人資料</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
