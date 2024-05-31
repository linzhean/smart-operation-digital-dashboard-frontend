import React from 'react';
import { GrMenu, GrClose } from 'react-icons/gr';
import './DrawerNavigation.css';

interface DrawerNavigationProps {
  tabs: string[];
  onAddTab: () => void;
  onDeleteTab: (index: number) => void;
  isOpen: boolean;
  toggleDrawer: () => void;
}

const DrawerNavigation: React.FC<DrawerNavigationProps> = ({
  tabs,
  onAddTab,
  onDeleteTab,
  isOpen,
  toggleDrawer,
}) => {
  return (
    <div className={`drawer-navigation ${isOpen ? 'open' : 'closed'}`}>
      <div className="drawer-header">
        <div className="toggle-button" onClick={toggleDrawer}>
          {isOpen ? <GrClose /> : <GrMenu />}
        </div>
      </div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div className="tab" key={index}>
            <span>{tab}</span>
            <button onClick={() => onDeleteTab(index)}>删除</button>
          </div>
        ))}
        <div className="add-group-button-container"> {/* 新的容器 */}
          <button className="add-tab-button" onClick={onAddTab}>新增群組</button>
        </div>
      </div>
    </div>
  );
};

export default DrawerNavigation;
