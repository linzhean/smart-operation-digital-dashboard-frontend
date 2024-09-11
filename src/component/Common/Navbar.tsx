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

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

// Import statements for icons remain the same
import burgerMenuIcon from '../../assets/icon/burgerMenu-icon.svg';
import dashBoardIcon from '../../assets/icon/dashBoard-icon.svg';
import groupIcon from '../../assets/icon/group-icon.svg';
import emailIcon from '../../assets/icon/email-icon.svg';
import userDataIcon from '../../assets/icon/userData-icon.svg';
import AssignExportControlIcon from '../../assets/icon/AssignExportControl.svg';
import InterimKPIControlIcon from '../../assets/icon/InterimKPIControl.svg';
import UserControlIcon from '../../assets/icon/UserControl.svg';
import ChartAdminIcon from '../../assets/icon/ChartAdmin.png';

const NavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeLink = location.pathname;
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(true);

  useEffect(() => {
    if (isNavVisible) {
      setIsNavVisible(false);
    }
  }, [location]);

  const toggleNav = () => {
    if (isNavVisible) {
      setIsNavVisible(false);
      setTimeout(() => setIsNavHidden(true), 300);
    } else {
      setIsNavHidden(false);
      setTimeout(() => setIsNavVisible(true), 10);
    }
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    toggleNav();
  };

  const navItems = [
    { path: '/ChartAdmin', icon: ChartAdminIcon, text: '圖表後台管理' },
    { path: '/AssignExportControl', icon: AssignExportControlIcon, text: '權限管理' },
    { path: '/UserControl/userApply', icon: UserControlIcon, text: '使用者管理' },
    { path: '/InterimKPIControl', icon: InterimKPIControlIcon, text: '臨時KPI審核' },
    { path: '/GroupManagement', icon: groupIcon, text: '群組管理' },
    { path: '/home', icon: dashBoardIcon, text: '儀表板' },
    { path: '/mail', icon: emailIcon, text: '信件' },
    { path: '/profile', icon: userDataIcon, text: '個人資料' },
  ];

  return (
    <nav className={`navbar navbar-expand-md ${styles.bgBodyTertiary}`}>
      <div className={`container-fluid ${styles.containerfluid}`}>
        <a className={`brand ${styles.navbarHamburger}`} id='hamburger' href="#" onClick={toggleNav}>
          <img className={`brandImg ${styles.brandImg}`} src={burgerMenuIcon} alt="menu" />
        </a>
        <button
          className={`navbar-toggler ${styles.navbarToggler}`}
          type="button"
          aria-controls="navbarNavAltMarkup"
          aria-expanded={isNavVisible}
          aria-label="Toggle navigation"
          onClick={toggleNav}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div 
          className={`navbar-collapse ${styles.navbarCollapse} ${isNavVisible ? styles.show : ''} ${isNavHidden ? styles.hidden : ''}`}
        >
          <ul className={`navbar-nav ${styles.navbarNav}`}>
            {navItems.map((item) => (
              <li key={item.path} className={`nav-item ${styles.navbarNavItem}`}>
                <Link
                  className={`nav-link ${styles.navLink} ${activeLink.startsWith(item.path) ? styles.activeNavLink : ''}`}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                >
                  <img 
                    className={`${styles.navbarNavItemImg} ${item.path === '/mail' ? styles.navbarNavItemMail : ''}`} 
                    src={item.icon} 
                    alt={item.text} 
                  />
                  <span className={`${styles.navbarText} ${activeLink.startsWith(item.path) ? styles.activeNavLinkText : ''}`}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;