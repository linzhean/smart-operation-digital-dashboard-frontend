import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './InterimKPISidebar.module.css';

const Sidebar: React.FC = () => {
  //控制側邊欄left值 及openButton(hamburger上的)的顯示
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
          console.log(item.textContent + ' 被點了');
        });
      });
    };

    handleMenuClick();
  }, []);

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
            <li>
              <a href="#">
                <div className={styles.title}>啟用中</div>
              </a>
            </li>
            <li>
              <a href="#">
                <div className={styles.title}>已過期</div>
              </a>
            </li>
            <li>
              <a href="#">
                <div className={styles.title}>已關閉</div>
              </a>
            </li>
            <li>
              <a href="#">
                <div className={styles.title}>待審核</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
