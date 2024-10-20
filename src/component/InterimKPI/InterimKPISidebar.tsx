import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './InterimKPISidebar.module.css';

interface SidebarProps {
  onStatusChange: (status: string) => void;
  selectedStatus: string;
}

const statusMap: { [key: string]: number } = {
  '已關閉': 0,
  '申請未通過': 1,
  '申請已通過': 2,
  '正在啓用': 3,
};

const Sidebar: React.FC<SidebarProps> = ({ onStatusChange, selectedStatus }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);

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

  const handleMenuItemClick = (status: string) => {
    onStatusChange(status);
  };

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
            onClick={handleSidebarToggle}
            disabled={isDisabled}
          ></button>
          <div className={styles.close} onClick={() => setIsActive(false)}>
            <img src={closearrow} alt="Click to close sidebar" />
          </div>
          <ul className={`${styles.siderbar_menu} mostly-customized-scrollbar`}>
            {Object.keys(statusMap).map(status => (
              <li key={status} className={selectedStatus === status ? styles.active : ''}>
                <a href="#" onClick={() => handleMenuItemClick(status)}>
                  <div className={styles.title}>{status}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
