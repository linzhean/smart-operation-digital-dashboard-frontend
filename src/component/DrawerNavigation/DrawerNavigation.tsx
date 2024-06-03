import React from 'react';
import { GrMenu, GrClose } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleLogout = () => {
    // 清除本地存储的身份验证令牌
    localStorage.removeItem('authToken');
    // 导航到登录页面并传递状态
    navigate('/login', { state: { message: '登出成功' } });
  };

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
        <div className="add-group-button-container">
          <button className="add-tab-button" onClick={onAddTab}>新增群組</button>
        </div>
        <div className="logout-button-container">
          <button className="logout-button" onClick={handleLogout}>登出</button>
        </div>
      </div>
    </div>
  );
};

export default DrawerNavigation;
