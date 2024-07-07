import React from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import Menu from '../../assets/icon/burgerMenu-icon.svg';
import Dashboard from '../../assets/icon/dashBoard-icon.svg';
import groupIcon from '../../assets/icon/group-icon.svg';
import Manage from '../../assets/icon/graphManage-icon.svg';
import Email from '../../assets/icon/email-icon.svg';
import Profile from '../../assets/icon/userData-icon.svg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../styles/navbar.css';

interface AdminNavbarProps {
  selectedPage: string;
  selectPage: (page: string) => void;
  isNavbarCollapsed: boolean;
  toggleNavbar: () => void;
  toggleDrawer: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  selectedPage,
  selectPage,
  isNavbarCollapsed,
  toggleNavbar,
  toggleDrawer,
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  const navItems = [
    { to: "#home", icon: Dashboard, key: "home" },
    { to: "#group", icon: groupIcon, key: "group" },
    { to: "#services", icon: Manage, key: "services" },
    { to: "#email", icon: Email, key: "email" },
    { to: "#profile", icon: Profile, key: "profile" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light admin-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand hamburger" to="/" onClick={toggleDrawer}>
          <img src={Menu} alt="Menu" />
        </Link>
        <div className="d-lg-none position-absolute top-0 end-0">
          <Slider {...settings}>
            {navItems.map((item) => (
              <div key={item.key} className="nav-item-slider text-center">
                <Link
                  className={`nav-link ${selectedPage === item.key ? 'active' : ''}`}
                  to={item.to}
                  onClick={() => selectPage(item.key)}
                >
                  <img src={item.icon} alt="" />
                </Link>
              </div>
            ))}
          </Slider>
        </div>
        <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.key}>
                <Link
                  className={`nav-link ${selectedPage === item.key ? 'active' : ''}`}
                  to={item.to}
                  onClick={() => selectPage(item.key)}
                >
                  <img src={item.icon} alt="" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
