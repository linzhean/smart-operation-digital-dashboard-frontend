import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../styles/DrawerNavigation.css';
import '../../styles/content.css';

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
  const fetchMoreData = () => {
    // 模拟异步加载更多数据
    setTimeout(() => {
      // 示例：添加更多菜单项
      const newTabs = [...tabs, `標籤 ${tabs.length + 1}`];
      onAddTab(); // 更新父组件中的 tabs
    }, 1500);
  };

  return (
    <div className={`drawer-navigation ${isOpen ? 'open' : 'closed'}`}>
      <div className="drawer-content">
        <InfiniteScroll
          dataLength={tabs.length}
          next={fetchMoreData}
          hasMore={true}
          loader={<div className={`loadingMsg`}></div>}
          scrollThreshold={0.9}
          className="tabs"
        >
          <h3>標籤</h3>
          <ul>
            {tabs.map((tab, index) => (
              <li key={index}>
                <span>{tab}</span>
                <button onClick={() => onDeleteTab(index)}>刪除</button>
              </li>
            ))}
          </ul>
          <button onClick={onAddTab}>新增標籤</button>
        </InfiniteScroll>
      </div>
      <div className="drawer-toggle" onClick={toggleDrawer}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default DrawerNavigation;
