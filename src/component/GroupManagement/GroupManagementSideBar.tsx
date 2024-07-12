import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './GroupManagementSideBar.module.css';

const Sidebar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);

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

  // 假的數據
  const fakeGroups = [
    { id: 0, name: '生產群組' },
    { id: 1, name: '製造群組' },
    { id: 2, name: '銷售群組' },
  ];

  return (
    <div className={`${styles.wrapper} ${isActive ? styles.active : ''}`}>
      <div className={styles.sidebar}>
        {/* sideBar的遮罩 */}
        <div
          className={styles.bg_shadow}
          onClick={() => setIsActive(false)}
        ></div>

        {/* 內部 */}
        <div className={styles.sidebar_inner}>

          {/* 開關按鈕 */}
          <button
            className={styles.openbutton}
            onClick={() => {
              handleSidebarToggle();
            }}
            disabled={isDisabled}
          ></button>

          <div className={styles.close} onClick={() => setIsActive(false)}>
            <img src={closearrow} alt="Click to close sidebar" />
          </div>
          <ul className={`${styles.siderbar_menu} mostly-customized-scrollbar`}>

            {/* 新增群組的按鈕 */}
            <li>
              <button className={styles.addButton}>新增群組</button>
            </li>

            {/* 遍歷總共有幾個群組 */}
            {fakeGroups.map((group) => (
              <li
                key={group.id}
                className={activeGroup === group.id ? styles.active : ''}
                onClick={() => setActiveGroup(group.id)}
              >
                <div className={styles.sidebartitle}>{group.name}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
