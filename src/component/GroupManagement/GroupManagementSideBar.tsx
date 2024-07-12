import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './GroupManagementSideBar.module.css';
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

  // 假数据数组
  const fakeGroups = [
    { id: 0, name: '生產群組' },
    { id: 1, name: '製造群組' },
    { id: 2, name: '銷售群組' },
  ];

  return (
    <div className={`${styles.wrapper} ${isActive ? styles.active : ''}`}>
      <div className={styles.sidebar}>
        <div
          className={styles.bg_shadow}
          onClick={() => setIsActive(false)}
        ></div>
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
          <ul className={`${styles.siderbar_menu} mostly-customized-scrollbar`}>
            {/* 新增群組的按鈕 */}
            <li className={location.pathname === "/UserControl/userApply" ? styles.active : ''}>
              <Link to="/UserControl/userApply">
                <div className={styles.title}>新增群組</div>
              </Link>
            </li>

            {/* 邏輯：遍歷總共有幾個群組 */}
            {fakeGroups.map((group, index) => (
              <li
                key={group.id}
                className={location.pathname === `/UserControl/group/${group.id}` ? styles.active : ''}
              >
                <Link to={`/UserControl/group/${group.id}`}>
                  <div className={styles.title}>{group.name}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
