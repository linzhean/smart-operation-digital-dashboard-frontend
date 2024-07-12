import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './UserControlSidebar.module.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSidebarToggle = () => {
    if (!isDisabled) {
      setIsActive(!isActive);
    }
  };

  return (
    <div className={`${styles.wrapper} ${isActive ? styles.active : ''}`}>
      <div className={styles.sidebar}>
        <div className={styles.bg_shadow} onClick={() => setIsActive(false)}></div>
        <div className={styles.sidebar_inner}>
          <button
            className={styles.openbutton}
            onClick={() => {
              console.log('我被點擊了');
              handleSidebarToggle();
            }}
            disabled={isDisabled}
          ></button>

          <div className={styles.close} onClick={() => setIsActive(false)}>
            <img src={closearrow} alt="Click to close sidebar" />
          </div>
          <ul className={`${styles.sidebar_menu} mostly-customized-scrollbar`}>
            <li className={location.pathname === "/UserControl/userApply" ? styles.active : ''}>
              <Link to="/UserControl/userApply">
                <div className={styles.title}>待審核清單</div>
              </Link>
            </li>
            <li className={location.pathname === "/UserControl/userStatus" ? styles.active : ''}>
              <Link to="/UserControl/userStatus">
                <div className={styles.title}>使用者控制</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
