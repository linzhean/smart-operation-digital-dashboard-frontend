// src/components/UserTabs/UserTabs.tsx
import React from 'react';
import '../styles/UserTabs.css';

interface UserTabsProps {
  tabs: string[];
  addTab: () => void;
  deleteTab: (index: number) => void;
}

const UserTabs: React.FC<UserTabsProps> = ({ tabs, addTab, deleteTab }) => {
  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <div className="tab" key={index}>
          {tab}
          <button className="delete-button" onClick={() => deleteTab(index)}>X</button>
        </div>
      ))}
      <button className="add-user-button" onClick={addTab}>新增</button>
    </div>
  );
};

export default UserTabs;
