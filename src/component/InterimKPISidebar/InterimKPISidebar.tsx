import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './InterimKPISidebar.module.css';

interface SidebarProps {
  onStatusChange: (status: string) => void;
  selectedStatus: string;
}

const statusMap: { [key: string]: string } = {
  '已關閉': '0',
  '申請未通過': '1',
  '申請已通過': '2',
  '正在啓用': '3',
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

  useEffect(() => {
    const handleMenuClick = () => {
      const menuItems = document.querySelectorAll(`.${styles.siderbar_menu} li`);
      menuItems.forEach(item => {
        item.addEventListener("click", () => {
          menuItems.forEach(i => i.classList.remove(styles.active));
          item.classList.add(styles.active);
          onStatusChange(item.textContent?.trim() || '');
        });
      });
    };

    handleMenuClick();
  }, [onStatusChange]);

  const handleSidebarToggle = () => {
    if (!isDisabled) {
      setIsActive(!isActive);
    }
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
            <li className={selectedStatus === '已關閉' ? styles.active : ''}>
              <a href="#" onClick={() => onStatusChange('已關閉')}>
                <div className={styles.title}>已關閉</div>
              </a>
            </li>
            <li className={selectedStatus === '申請未通過' ? styles.active : ''}>
              <a href="#" onClick={() => onStatusChange('申請未通過')}>
                <div className={styles.title}>申請未通過</div>
              </a>
            </li>
            <li className={selectedStatus === '申請已通過' ? styles.active : ''}>
              <a href="#" onClick={() => onStatusChange('申請已通過')}>
                <div className={styles.title}>申請已通過</div>
              </a>
            </li>
            <li className={selectedStatus === '正在啓用' ? styles.active : ''}>
              <a href="#" onClick={() => onStatusChange('正在啓用')}>
                <div className={styles.title}>正在啓用</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
