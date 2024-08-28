// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import Slider from "react-slick";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import styles from './NavBar.module.css';
// import burgerMenuIcon from '../../assets/icon/burgerMenu-icon.svg';
// import dashBoardIcon from '../../assets/icon/dashBoard-icon.svg';
// import groupIcon from '../../assets/icon/group-icon.svg';
// import emailIcon from '../../assets/icon/email-icon.svg';
// import userDataIcon from '../../assets/icon/userData-icon.svg';
// import AssignExportControlIcon from '../../assets/icon/AssignExportControl.svg';
// import InterimKPIControlIcon from '../../assets/icon/InterimKPIControl.svg';
// import UserControlIcon from '../../assets/icon/UserControl.svg';

// interface NavBarProps {
//   selectedPage: string;
//   selectPage: (page: string) => void;
//   toggleDrawer: () => void;
//   toggleNavbar: () => void;
// }

// const NavBar: React.FC<NavBarProps> = ({
//   selectedPage,
//   selectPage,
//   toggleDrawer,
//   toggleNavbar,
// }) => {
//   const location = useLocation();
//   const activeLink = location.pathname;

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3, // 一次顯示三個項目
//     slidesToScroll: 1,
//     swipeToSlide: true,
//   };

//   const navItems = [
//     { to: "/AssignExportControl", icon: AssignExportControlIcon, key: "AssignExportControl", text: "權限管理" },
//     { to: "/UserControl/userApply", icon: UserControlIcon, key: "UserControl", text: "使用者管理" },
//     { to: "/InterimKPIControl", icon: InterimKPIControlIcon, key: "InterimKPIControl", text: "臨時KPI審核" },
//     { to: "/group", icon: groupIcon, key: "group", text: "群組" },
//     { to: "/", icon: dashBoardIcon, key: "dashboard", text: "儀表板" },
//     { to: "/mail", icon: emailIcon, key: "mail", text: "信件" },
//     { to: "/profile", icon: userDataIcon, key: "profile", text: "個人資料" },
//   ];

//   return (
//     <nav className={`navbar navbar-expand-lg ${styles.bgBodyTertiary}`}>
//       <div className="container-fluid">
//         <a className={`navbar-brand ${styles.navbarHamburger}`} href="#" onClick={toggleDrawer}>
//           <img className={`brandImg ${styles.brandImg}`} src={burgerMenuIcon} alt="menu" />
//         </a>
//         <div className="d-lg-none w-100">
//           <Slider {...settings} className={styles.slider}>
//             {navItems.map((item) => (
//               <div key={item.key} className={`nav-item-slider text-center ${styles.navItemSlider}`}>
//                 <Link
//                   className={`nav-link ${selectedPage === item.key ? 'active' : ''}`}
//                   to={item.to}
//                   onClick={() => selectPage(item.key)}
//                 >
//                   <img src={item.icon} alt={item.text} className={styles.sliderImg} />
//                   <span className={styles.sliderText}>{item.text}</span>
//                 </Link>
//               </div>
//             ))}
//           </Slider>
//         </div>
//         <div className={`collapse navbar-collapse d-none d-lg-flex`} id="navbarNavAltMarkup">
//           <ul className={`navbar-nav ms-auto ${styles.navbarNav}`}>
//             {navItems.map((item) => (
//               <li className={`nav-item ${styles.navbarNavItem}`} key={item.key}>
//                 <Link
//                   className={`nav-link ${styles.navLink} ${activeLink.startsWith(item.to) ? styles.activeNavLink : ''}`}
//                   to={item.to}
//                   onClick={() => selectPage(item.key)}
//                 >
//                   <img className={styles.navbarNavItemImg} src={item.icon} alt={item.text} />
//                   <span className={`${styles.navbarText} ${activeLink.startsWith(item.to) ? styles.activeNavLinkText : ''}`}>{item.text}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

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
import ChartAdmin from '../../assets/icon/ChartAdmin.png'

const NavBar: React.FC = () => {
  const location = useLocation();
  const activeLink = location.pathname;

  return (
    <nav className={`navbar navbar-expand-md ${styles.bgBodyTertiary}`}>
      <div className={`container-fluid ${styles.containerfluid}`}>
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

            {/* 圖表新增後台 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/ChartAdmin') ? styles.activeNavLink : ''}`}
                to="/ChartAdmin"
              >
                <img className={styles.navbarNavItemImg} src={ChartAdmin} alt="ChartAdmin" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/ChartAdmin') ? styles.activeNavLinkText : ''}`}>圖表後台管理</span>
              </Link>
            </li>

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
            {/* <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/group') ? styles.activeNavLink : ''}`}
                to="/group"
              >
                <img className={styles.navbarNavItemImg} src={groupIcon} alt="group" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/group') ? styles.activeNavLinkText : ''}`}>群組</span>
              </Link>
            </li> */}

            {/* 群組管理2 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/GroupManagement') ? styles.activeNavLink : ''}`}
                to="/GroupManagement"
              >
                <img className={styles.navbarNavItemImg} src={groupIcon} alt="GroupManagement" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/GroupManagement') ? styles.activeNavLinkText : ''}`}>群組管理</span>
              </Link>
            </li>

            {/* 首頁－儀表板 */}
            <li className={`nav-item ${styles.navbarNavItem}`}>
              <Link
                className={`nav-link ${styles.navLink} ${activeLink.startsWith('/home') ? styles.activeNavLink : ''}`}
                to="/home"
              >
                <img className={styles.navbarNavItemImg} src={dashBoardIcon} alt="home" />
                <span className={`${styles.navbarText} ${activeLink.startsWith('/home') ? styles.activeNavLinkText : ''}`}>儀表板</span>
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
