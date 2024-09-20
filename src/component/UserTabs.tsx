import React from 'react';
import styles from './UserTabs.module.css';

interface UserTabsProps {
  tabs: string[];
  addTab: () => void;
  deleteTab: (index: number) => void;
}

const UserTabs: React.FC<UserTabsProps> = ({ tabs, addTab, deleteTab }) => {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => (
        <div className={styles.tab} key={index}>
          {tab}
          <button className={styles.deleteButton} onClick={() => deleteTab(index)}>X</button>
        </div>
      ))}
      <button className={styles.addUserButton} onClick={addTab}>新增</button>
    </div>
  );
};

export default UserTabs;
