import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../styles/Admin/adminDrawerNavigation.css';

interface AdminDrawerNavigationProps {
  tabs: string[];
  onAddTab: () => void;
  onDeleteTab: (index: number) => void;
  isOpen: boolean;
  toggleDrawer: () => void;
}

const AdminDrawerNavigation: React.FC<AdminDrawerNavigationProps> = ({
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
      const newTabs = [...tabs, `群組 ${tabs.length + 1}`];
      onAddTab(); // 更新父组件中的 tabs
    }, 1500);
  };

  return (
    <div className={`drawer-navigation ${isOpen ? 'open' : ''}`}>
      <div className="drawer-content">
        <InfiniteScroll
          dataLength={tabs.length}
          next={fetchMoreData}
          hasMore={true} // 是否还有更多数据
          loader={<h4>Loading...</h4>} // 加载时显示的组件
          scrollThreshold={0.9} // 触发加载更多的滚动阈值
          className="tabs" // 自定义类名
        >
          <h3>管理</h3>
          <ul>
            {tabs.map((tab, index) => (
              <li key={index}>
                <span>{tab}</span>
                <button onClick={() => onDeleteTab(index)}>刪除</button>
              </li>
            ))}
          </ul>
          <button onClick={onAddTab}>新增群組</button>
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

export default AdminDrawerNavigation;
