import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';
import { useState, useEffect } from 'react';
import burgerMenuIcon from '../../assets/icon/menubar.png';
import dashBoardIcon from '../../assets/icon/dashBoard-icon.svg';
import groupIcon from '../../assets/icon/group-icon.svg';
import emailIcon from '../../assets/icon/email-icon.svg';
import AssignExportControlIcon from '../../assets/icon/AssignExportControl.svg';
import InterimKPIControl from '../../assets/icon/InterimKPIControl.svg';
import UserControl from '../../assets/icon/UserControl.svg';
import ChartAdmin from '../../assets/icon/ChartAdmin.png'
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useUserContext } from '../../context/UserContext';
import LOGO from '../../assets/icon/LOGOwhite.png'

const NavBar: React.FC = () => {

  const WhiteTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} PopperProps={{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -12],
          },
        },
      ],
    }} />
  ))(() => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: '#ffffff',
      color: '#000000',
      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
      fontSize: '0.8rem',
      fontWeight: '700',
      border: '1px solid #000000',
    }
  }));

  const { user } = useUserContext();
  const location = useLocation();
  const activeLink = location.pathname;
  const currentLocation = useLocation();
  const [isNavBarExpanded, setIsNavBarExpanded] = useState(false);

  useEffect(() => {
    closeNavBarOnRouteChange();
  }, [currentLocation]);

  const closeNavBarOnRouteChange = () => {
    setIsNavBarExpanded(false);
  };

  const toggleNavBarExpansion = () => {
    setIsNavBarExpanded(!isNavBarExpanded);
  };

  // 有側邊欄的路徑
  const SidebarPaths = ['/UserControl', '/InterimKPIControl', '/GroupManagement', '/home'];
  const ShowBurgerIcon = SidebarPaths.some((path) => activeLink.startsWith(path));

  return (
    <>
      {isNavBarExpanded && (
        <div className={styles.navbarOverlay} onClick={toggleNavBarExpansion}></div>
      )}

      <nav className={`navbar navbar-expand-md ${styles.bgBodyTertiary}`}>
        <div className={`container-fluid ${styles.containerfluid}`}>

          <a className={`brand ${styles.navbarHamburger} ${styles.theLOGO}`} id='hamburger' href="#">
            {!ShowBurgerIcon ? (<>
              <img className={`brandImg ${styles.brandImg} ${styles.showBurgerIcon}`} src={LOGO} alt="menu" />
              <h1 className={styles.LogoTitle}>智慧儀表板系統</h1>
            </>
            ) : (
              <>
                <img className={`brandImg ${styles.brandImg} ${styles.showBurgerIcon} ${styles.theBurger}`} src={burgerMenuIcon} alt="menu" />
                <img className={`brandImg ${styles.brandImg} ${styles.showBurgerIcon} ${styles.theLOGOicon}`} src={LOGO} alt="menu" />
                <h1 className={styles.LogoTitle}>智慧儀表板系統</h1>
              </>)}
          </a>

          <button
            onClick={toggleNavBarExpansion}
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

          <div className={`collapse navbar-collapse  ${styles.controlZindex}  ${isNavBarExpanded ? 'show' : ''}`} id="navbarNavAltMarkup">
            <ul className={`navbar-nav ${styles.navbarNav}`}>

              {/* 首頁－儀表板 */}
              <li className={`nav-item ${styles.navbarNavItem}`}>
                <Link
                  className={`nav-link ${styles.navLink} ${activeLink.startsWith('/home') ? styles.activeNavLink : ''}`}
                  to="/home"
                >
                  <WhiteTooltip title="數位儀表板" enterDelay={700} leaveDelay={100} >
                    <img className={styles.navbarNavItemImg} src={dashBoardIcon} alt="home" />
                  </WhiteTooltip>
                  <span className={`${styles.navbarText} ${activeLink.startsWith('/home') ? styles.activeNavLinkText : ''}`}>數位儀表板</span>
                </Link>
              </li>

              {/* 信件 */}
              <li className={`nav-item ${styles.navbarNavItem}`}>
                <Link
                  className={`nav-link ${styles.navLink} ${activeLink.startsWith('/mail') ? styles.activeNavLink : ''}`}
                  to="/mail"
                >
                  <WhiteTooltip title="交辦事項" enterDelay={700} leaveDelay={100} >
                    <img className={`${styles.navbarNavItemImg} ${styles.navbarNavItemMail}`} src={emailIcon} alt="mail" />
                  </WhiteTooltip>
                  <span className={`${styles.navbarText} ${activeLink.startsWith('/mail') ? styles.activeNavLinkText : ''}`}>交辦事項</span>
                </Link>
              </li>

              {/* 圖表新增後台 */}
              {user?.identity === 'DEVELOPER' && (
                <li className={`nav-item ${styles.navbarNavItem}`}>
                  <Link
                    className={`nav-link ${styles.navLink} ${activeLink.startsWith('/ChartAdmin') ? styles.activeNavLink : ''}`}
                    to="/ChartAdmin"
                  >
                    <WhiteTooltip title="圖表管理" enterDelay={700} leaveDelay={100} >
                      <img className={styles.navbarNavItemImg} src={ChartAdmin} alt="ChartAdmin" onClick={() => console.log(activeLink)} />
                    </WhiteTooltip>
                    <span className={`${styles.navbarText} ${activeLink.startsWith('/ChartAdmin') ? styles.activeNavLinkText : ''}`}>圖表管理</span>
                  </Link>
                </li>
              )}

              {/* 權限管理 */}
              {/* {['ADMIN', 'USER'].includes(user?.role ?? '') && ( */}
              {user?.identity === 'ADMIN' && (
                <li className={`nav-item ${styles.navbarNavItem}`}>
                  <Link
                    className={`nav-link ${styles.navLink} ${activeLink.startsWith('/AssignExportControl') ? styles.activeNavLink : ''}`}
                    to="/AssignExportControl"
                  >
                    <WhiteTooltip title="權限管理" enterDelay={700} leaveDelay={100}>
                      <img className={styles.navbarNavItemImg} src={AssignExportControlIcon} alt="graphManage" />
                    </WhiteTooltip>
                    <span className={`${styles.navbarText} ${activeLink.startsWith('/AssignExportControl') ? styles.activeNavLinkText : ''}`}>權限管理</span>
                  </Link>
                </li>
              )}

              {/* 使用者管理 */}
              {user?.identity === 'ADMIN' && (
                <li className={`nav-item ${styles.navbarNavItem}`}>
                  <Link
                    className={`nav-link ${styles.navLink} ${activeLink.startsWith('/UserControl') ? styles.activeNavLink : ''}`}
                    to="/UserControl/userApply"
                  >
                    <WhiteTooltip title="帳號管理" enterDelay={700} leaveDelay={100}>
                      <img className={styles.navbarNavItemImg} src={UserControl} alt="UserControl" />
                    </WhiteTooltip>
                    <span className={`${styles.navbarText} ${activeLink.startsWith('/UserControl') ? styles.activeNavLinkText : ''}`}>帳號管理</span>
                  </Link>
                </li>
              )}

              {/* ＫＰＩ審核 */}
              {user?.identity === 'ADMIN' && (
                <li className={`nav-item ${styles.navbarNavItem}`}>
                  <Link
                    className={`nav-link ${styles.navLink} ${activeLink.startsWith('/InterimKPIControl') ? styles.activeNavLink : ''}`}
                    to="/InterimKPIControl"
                  >
                    <WhiteTooltip title="查看圖表申請" enterDelay={700} leaveDelay={100} >
                      <img className={styles.navbarNavItemImg} src={InterimKPIControl} alt="graphManage" />
                    </WhiteTooltip>
                    <span className={`${styles.navbarText} ${activeLink.startsWith('/InterimKPIControl') ? styles.activeNavLinkText : ''}`}>查看圖表申請</span>
                  </Link>
                </li>
              )}

              {/* 群組管理 */}
              {user?.identity === 'ADMIN' && (
                <li className={`nav-item ${styles.navbarNavItem}`}>
                  <Link
                    className={`nav-link ${styles.navLink} ${activeLink.startsWith('/GroupManagement') ? styles.activeNavLink : ''}`}
                    to="/GroupManagement"
                  >
                    <WhiteTooltip title="群組管理" enterDelay={700} leaveDelay={100} >
                      <img className={styles.navbarNavItemImg} src={groupIcon} alt="GroupManagement" />
                    </WhiteTooltip>

                    <span className={`${styles.navbarText} ${activeLink.startsWith('/GroupManagement') ? styles.activeNavLinkText : ''}`}>群組管理</span>
                  </Link>
                </li>
              )}

              {/* 分隔線 */}
              <div className={styles.thePartition}></div>

              <li className={`nav-item ${styles.navbarNavItem}`}>
                <Link
                  className={`nav-link ${styles.navLink} ${activeLink.startsWith('/profile') ? styles.activeNavLink : ''}`}
                  to="/profile"
                >
                  <WhiteTooltip title="個人資料" enterDelay={700} leaveDelay={100} >
                    <div className={`${styles.theUserName} ${activeLink.startsWith('/profile') ? styles.activeUserName : ''}`}>
                      {user?.name
                        ? user.name
                        : (user?.id
                          ? user.id
                          : (user?.email
                            ? user.email.split('@')[0]
                            : '訪客'))}
                    </div>
                  </WhiteTooltip>
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;

